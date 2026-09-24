import fs from 'fs';
import path from 'path';
import MarkdownIt from 'markdown-it';
import * as cheerio from 'cheerio';
import * as prettier from 'prettier';

const PROPOSALS_DIR = process.env.PROPOSALS_DIR ?? '../proposals';
const FEATURES_JSON = 'features.json';

// Matches a repo's bare root URL.
const REPO_ROOT_RE = /^https:\/\/github\.com\/WebAssembly\/([^/?#]+)\/?$/i;

// Matches a blob/tree link into a proposal's own repo, under proposals/.
const PROPOSAL_LINK_RE =
  /^https:\/\/github\.com\/WebAssembly\/([^/?#]+)\/(blob|tree)\/[^/?#]+\/proposals\/([^?#]+?)\/?$/i;

// Splits a proposal name into word tokens for camelCaseSlug. Proposal names
// mix plain words, standalone acronyms, and PascalCase compounds with no
// delimiter between their words (e.g. "WebAssembly"), so each alternative
// below handles one shape:
//   - [A-Z]+(?![a-z])  an acronym not immediately followed by a lowercase
//                       letter, e.g. "JSPI", or the "GC" in "GCFeature"
//   - [A-Z]?[a-z]+      a capitalized or lowercase word, e.g. "Web" and
//                       "Assembly" out of "WebAssembly"
//   - \d+               a run of digits, e.g. "64" out of "Memory64"
const CAMEL_CASE_WORD_RE = /[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+/g;

// nontrapping-float-to-int-conversions' repo name doesn't match its
// features.json key.
const LEGACY_KEY_OVERRIDES = new Map([
  ['nontrapping-float-to-int-conversions', 'saturatedFloatToInt'],
]);

// MVP is the 1.0 baseline, not a feature engines can lack.
const EXCLUDED_NAMES = new Set(['MVP']);

const md = new MarkdownIt();

const problems = [];

function reportProblem(message) {
  console.error(`::error::${message}`);
  problems.push(message);
}

// Canonicalizes a URL to the repo it identifies, so a repo root and a link
// into that repo's proposals/ doc match. Links into WebAssembly/spec are
// keyed by their proposals/<name> directory instead of "spec". Anything
// else falls back to the URL's exact text.
function identityKey(url) {
  const trimmed = url.trim();

  const rootMatch = trimmed.match(REPO_ROOT_RE);
  if (rootMatch) return rootMatch[1].toLowerCase();

  const linkMatch = trimmed.match(PROPOSAL_LINK_RE);
  if (linkMatch) {
    const [, repo, linkType, tail] = linkMatch;
    const segments = tail.split('/');
    const isProposalDoc =
      segments.length <= 2 &&
      (linkType === 'tree' || segments.at(-1).endsWith('.md'));
    if (isProposalDoc) {
      const dir = segments[0];
      return (repo.toLowerCase() === 'spec' ? dir : repo).toLowerCase();
    }
  }

  return trimmed.replace(/\/$/, '').toLowerCase();
}

function camelCaseSlug(name) {
  const words = name.match(CAMEL_CASE_WORD_RE) ?? [];
  return words
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word[0].toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

function extractRows($, table) {
  const rows = [];
  for (const tr of $(table).find('tbody tr').toArray()) {
    const firstCell = $(tr).find('td').first();
    if (firstCell.length === 0) continue;

    const name = firstCell.text().trim();
    const href = firstCell.find('a').first().attr('href');
    if (!href) {
      console.warn(`Skipping row with no link: ${JSON.stringify(name)}`);
      continue;
    }

    rows.push({ name, href });
  }
  return rows;
}

// Phase 0 has no table (just prose), so it's skipped once currentPhase is null.
function parseReadme(text) {
  const $ = cheerio.load(md.render(text));
  const proposals = [];
  let currentPhase = null;

  for (const el of $('h3, table').toArray()) {
    if (el.tagName === 'h3') {
      const match = $(el)
        .text()
        .trim()
        .match(/^Phase ([1-5])\b/);
      currentPhase = match ? Number(match[1]) : null;
    } else if (currentPhase !== null) {
      for (const row of extractRows($, el)) {
        proposals.push({ ...row, phase: currentPhase });
      }
    }
  }

  return proposals;
}

// Each row in finished-proposals.md / inactive-proposals.md shares one implicit phase.
function parseFixedPhaseFile(text, phase) {
  const $ = cheerio.load(md.render(text));
  const proposals = [];

  for (const table of $('table').toArray()) {
    for (const row of extractRows($, table)) {
      proposals.push({ ...row, phase });
    }
  }

  return proposals;
}

function readProposalsFile(name) {
  return fs.readFileSync(path.join(PROPOSALS_DIR, name), 'utf8');
}

function loadProposals() {
  const readmeProposals = parseReadme(readProposalsFile('README.md'));
  if (readmeProposals.length === 0) {
    reportProblem(
      'Parsed zero proposals from README.md - the "Phase N" heading format may have changed upstream'
    );
  }

  return [
    ...readmeProposals,
    ...parseFixedPhaseFile(readProposalsFile('finished-proposals.md'), 5),
    ...parseFixedPhaseFile(
      readProposalsFile('inactive-proposals.md'),
      'inactive'
    ),
  ];
}

function loadFeaturesData() {
  const data = JSON.parse(fs.readFileSync(FEATURES_JSON, 'utf8'));
  data.features = Object.assign(Object.create(null), data.features);
  const originalKeys = new Set(Object.keys(data.features));
  return { data, originalKeys };
}

function buildExistingByKeyMap(features) {
  const existingByKey = new Map();
  for (const [key, entry] of Object.entries(features)) {
    const k = identityKey(entry.url);
    if (existingByKey.has(k)) {
      reportProblem(
        `features.json entries "${existingByKey.get(k)}" and "${key}" both canonicalize to the same key - one is probably stale`
      );
      continue;
    }
    existingByKey.set(k, key);
  }
  return existingByKey;
}

function syncExistingFeature(existingKey, proposal, features) {
  const entry = features[existingKey];
  if (entry.phase !== proposal.phase) {
    console.log(
      `Updating ${existingKey}: phase ${entry.phase} -> ${proposal.phase}`
    );
    entry.phase = proposal.phase;
  }
}

// Catches proposals whose identity didn't resolve (e.g. a repo rename not yet
// in LEGACY_KEY_OVERRIDES) but that are already tracked under a different key.
function findByDescription(proposalName, features) {
  for (const [key, entry] of Object.entries(features)) {
    if (entry.description === proposalName) return key;
  }
  return null;
}

function addNewFeature(proposal, features) {
  const possibleMatch = findByDescription(proposal.name, features);
  if (possibleMatch) {
    reportProblem(
      `"${proposal.name}" (${proposal.href}) isn't linked to existing entry "${possibleMatch}" - it may have moved repos; add a LEGACY_KEY_OVERRIDES entry if so`
    );
    return null;
  }

  const newKey = camelCaseSlug(proposal.name);
  if (features[newKey]) {
    reportProblem(
      `Generated key "${newKey}" for "${proposal.name}" (${proposal.href}) already exists for a different repo - pick a different key or add an override`
    );
    return null;
  }

  console.log(`Adding ${newKey}: ${proposal.name} (phase ${proposal.phase})`);
  features[newKey] = {
    description: proposal.name,
    url: proposal.href,
    phase: proposal.phase,
  };
  return newKey;
}

function reconcileProposal(proposal, { features, existingByKey, seen }) {
  const key = identityKey(proposal.href);
  const existingKey = LEGACY_KEY_OVERRIDES.get(key) ?? existingByKey.get(key);

  if (existingKey) {
    if (!features[existingKey]) {
      reportProblem(
        `LEGACY_KEY_OVERRIDES maps to "${existingKey}", which no longer exists in features.json`
      );
      return;
    }
    syncExistingFeature(existingKey, proposal, features);
    seen.add(existingKey);
    return;
  }

  if (EXCLUDED_NAMES.has(proposal.name)) {
    console.warn(
      `Skipping "${proposal.name}" (${proposal.href}): excluded from tracking`
    );
    return;
  }

  const newKey = addNewFeature(proposal, features);
  if (newKey) seen.add(newKey);
}

function reportUnseenFeatures(originalKeys, seen) {
  for (const key of originalKeys) {
    if (!seen.has(key)) {
      console.warn(
        `features.json entry "${key}" not found in WebAssembly/proposals; leaving untouched`
      );
    }
  }
}

async function writeFeaturesJson(data) {
  const config = (await prettier.resolveConfig(FEATURES_JSON)) ?? {};
  const formatted = await prettier.format(JSON.stringify(data), {
    ...config,
    filepath: FEATURES_JSON,
  });
  fs.writeFileSync(FEATURES_JSON, formatted);
}

async function main() {
  const proposals = loadProposals();
  const { data, originalKeys } = loadFeaturesData();
  const existingByKey = buildExistingByKeyMap(data.features);
  const seen = new Set();

  for (const proposal of proposals) {
    reconcileProposal(proposal, {
      features: data.features,
      existingByKey,
      seen,
    });
  }

  reportUnseenFeatures(originalKeys, seen);

  if (problems.length > 0) {
    throw new Error(
      `${problems.length} problem(s) found - see ::error:: annotations above`
    );
  }

  data.features = Object.fromEntries(
    Object.entries(data.features).sort(([a], [b]) =>
      a < b ? -1 : a > b ? 1 : 0
    )
  );
  await writeFeaturesJson(data);
}

await main();
