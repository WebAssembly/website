'use strict';

/*! groupby-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */

/**
 * Groups elements from an iterable into an object based on a callback function.
 *
 * @template T, K
 * @param {Iterable<T>} iterable - The iterable to group.
 * @param {function(T, number): K} callbackfn - The callback function to
 * determine the grouping key.
 * @returns {Object.<string, T[]>} An object where keys are the grouping keys
 * and values are arrays of grouped elements.
 *
 * This was introduced because of https://github.com/GoogleChromeLabs/wasm-feature-detect/issues/82.
 */
Object.groupBy ??= function groupBy(iterable, callbackfn) {
  const obj = Object.create(null);
  let i = 0;
  for (const value of iterable) {
    const key = callbackfn(value, i++);
    key in obj ? obj[key].push(value) : (obj[key] = [value]);
  }
  return obj;
};

function _loadFeatureDetectModule() {
  // Please cache bust by bumping the `v` parameter whenever `feature.json` is
  // updated to depend on a new version of the library. See #353 for discussion.
  // Make sure to also match the preload link in `features.md`.
  const module = import(
    'https://unpkg.com/wasm-feature-detect@1/dist/esm/index.js?v=1'
  );
  return (featureName) =>
    module.then((wasmFeatureDetect) => wasmFeatureDetect[featureName]());
}

const container = document.getElementById('feature-table');
if (!container.shadowRoot) {
  // Polyfill declarative shadow DOM
  const template = container.querySelector('template');
  template.parentNode
    .attachShadow({ mode: 'open' })
    .appendChild(template.content);
  template.remove();
}

/**
 * @typedef {{
 *  type: 'yes' | 'no' | 'not-applicable' | 'experimental' | 'unknown';
 *  version?: string;
 *  note?: string;
 * }} DecodedStatus
 */
/** @typedef {null | boolean | 'flag' | string} RawState */ /**
 * @param {RawState | [RawState, string]} status
 */
function decodeSupportStatus(status) {
  // Meaning of each entry:
  // * null                     => not applicable for this browser
  // * true/false               => supported/unsupported
  // * "version"                => supported since "version"
  // * "flag"                   => flag required (must be lowercase)
  // * [true, "footnotes"]      => supported, with "footnotes"
  // * ["version", "footnotes"] => supported since "version", with "footnotes"
  // …and any combination thereof

  /** @type {RawState} */
  let state, note;
  if (Array.isArray(status)) {
    if (status.length !== 2) throw new TypeError();
    [state, note] = status;
  } else {
    state = status;
  }

  /** @type {DecodedStatus['type']} */
  let type, version;
  if (typeof state === 'string') {
    type = state === 'flag' ? 'experimental' : 'yes';
    version = state !== 'flag' ? state : undefined;
  } else if (!state) {
    type = state === null ? 'not-applicable' : 'no';
  } else {
    if (state !== true) throw new TypeError();
    type = 'yes';
  }

  return { type, version, note };
}

/** @type {Record<DecodedStatus['type'] | 'asterisk' | 'loading', string>} */
const statusIcons = Object.fromEntries(
  Object.entries({
    yes: 'icon-check',
    no: 'icon-close',
    'not-applicable': 'icon-subtract',
    experimental: 'icon-flask',
    unknown: 'icon-question-mark',
    asterisk: 'icon-asterisk',
    loading: 'icon-loading',
  }).map(([type, id]) => [type, document.getElementById(id).innerHTML])
);

const state = () => ({
  features: {},
  platforms: {},

  numColumns: 0,
  featureGroups: [],
  yourBrowser: {},

  async init() {
    const { features, browsers: platforms } = await fetch('/features.json', {
      credentials: 'include', // https://stackoverflow.com/a/63814972
      mode: 'no-cors',
    }).then((res) => res.json());

    this.features = features;
    this.platforms = platforms;

    this.numColumns = 2 + Object.keys(platforms).length;
    let featureByGroup = Object.groupBy(
      Object.entries(features).map(([id, feature]) =>
        Object.assign(feature, { id })
      ),
      (f) => f.phase
    );

    this.featureGroups = [
      {
        name: 'Phase 5 – The Feature is Standardized',
        features: featureByGroup[5],
      },
      {
        name: 'Phase 4 – Standardize the Feature',
        features: featureByGroup[4],
      },
      { name: 'Phase 3 – Implementation Phase', features: featureByGroup[3] },
      {
        name: 'Phase 2 – Proposed Spec Text Available',
        features: featureByGroup[2],
      },
      { name: 'Phase 1 – Feature Proposal', features: featureByGroup[1] },
      { name: 'Inactive', features: featureByGroup['inactive'] },
    ];

    for (const platform of Object.values(this.platforms)) {
      for (const id of Object.keys(this.features)) {
        const raw = platform.features[id];
        platform.features[id] =
          typeof raw === 'undefined'
            ? { type: 'no' } // Missing values default to 'no'
            : decodeSupportStatus(raw);
      }
    }

    for (const id of Object.keys(this.features)) {
      _loadFeatureDetectModule()(id)
        .then((supported) => {
          this.yourBrowser[id] = {
            type: supported ? 'yes' : 'no',
            version: supported ? 'Yes' : undefined,
          };
        })
        .catch(() => {
          this.yourBrowser[id] = { type: 'unknown' };
        });
    }
  },

  /** @param {DecodedStatus | undefined} status */
  classForStatus(status) {
    if (!status?.type) return null;
    return `status-${status.type}`;
  },

  /** @param {DecodedStatus | undefined} status */
  iconForStatus(status) {
    if (!status?.type) return null;
    return statusIcons[status.type];
  },

  get iconForNote() {
    return statusIcons['asterisk'];
  },

  get iconWhenLoading() {
    return statusIcons['loading'];
  },

  /** @param {DecodedStatus | undefined} status */
  labelForStatus(status) {
    if (status?.version) return status.version;
    switch (status?.type) {
      //   case 'no':
      //     return 'No';
      case 'not-applicable':
        return 'N/A';
    }
    return null;
  },
});

function updateColorScheme(colorScheme) {
  Alpine.store('colorScheme', colorScheme, false);
}

document.addEventListener('alpine:init', () => {
  const meta = document.querySelector('meta[name=color-scheme]');
  updateColorScheme(meta?.content || 'light dark');
  Alpine.data('data', state);
});

document.addEventListener('alpine:initialized', () => {
  Alpine.initTree(container.shadowRoot);
});

document.addEventListener('colorschemechange', (ev) =>
  updateColorScheme(ev.detail.colorScheme)
);
