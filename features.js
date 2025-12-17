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

/**
 * `Array.map` but for object values.
 *
 * @template {object} T
 * @template R
 * @param {T} obj
 * @param {(value: T[keyof T], key: keyof T) => R} mapper
 * @returns {{ [K in keyof T]: R }}
 */
function mapValues(obj, mapper) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, mapper(value, key)])
  );
}

/**
 * Break a string into three parts using the given delimiter.
 * @param {string} str
 * @param {string} delim
 * @returns {[string, string, string]}
 */
function splitParts(str, delim) {
  const start = str.indexOf(delim);
  const end = str.indexOf(delim, start + 1);
  if (start >= 0 && end > start) {
    const head = str.substring(0, start);
    const body = str.substring(start + 1, end);
    const tail = str.substring(end + 1);
    return [head, body, tail];
  }
  return [str, '', ''];
}

function _loadFeatureDetectModule() {
  // Please cache bust by bumping the `v` parameter whenever `feature.json` is
  // updated to depend on a new version of the library. See #353 for discussion.
  // Make sure to also match the preload link in `feature-table.html`.
  const module = import(
    'https://unpkg.com/wasm-feature-detect@1/dist/esm/index.js?v=1'
  );
  return (featureName) =>
    module.then((wasmFeatureDetect) => wasmFeatureDetect[featureName]());
}

const container = document.getElementById('feature-table');

/**
 * @typedef {{
 *  type: 'yes' | 'no' | 'not-applicable' | 'experimental' | 'unknown';
 *  version?: string;
 *  note?: string;
 *  expanded?: boolean;
 * }} DecodedStatus
 */
/** @typedef {null | boolean | 'flag' | string} RawState */ /**
 * @param {RawState | [RawState, string]} status
 */
function decodeSupportStatus(status) {
  // Meaning of each entry:
  // * null                     => not applicable to this browser
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
    if (state !== true)
      throw new TypeError(
        `unexpected supported status ${JSON.stringify(state)}`
      );
    type = 'yes';
  }

  return { type, version, note, expanded: false };
}

// TODO: think of a cleaner way to store icons
const statusIcons = mapValues(
  {
    yes: 'icon-check',
    no: 'icon-close',
    'not-applicable': 'icon-forbid-2',
    experimental: 'icon-flask',
    unknown: 'icon-question-mark',
    asterisk: 'icon-asterisk',
    more: 'icon-more',
    loading: 'icon-loading',
  },
  (id) => /** @type {DocumentFragment} */ (document.getElementById(id).content)
);

const noteIcons = mapValues(
  {
    yes: 'icon-checkbox-circle',
    no: 'icon-close-circle',
    'not-applicable': 'icon-forbid-2',
    experimental: 'icon-flask',
    unknown: 'icon-checkbox-blank-circle',
  },
  (id) => /** @type {DocumentFragment} */ (document.getElementById(id).content)
);

/**
 * @typedef {{
 *  url: string;
 *  logo: string;
 *  category: string;
 *  features: Record<string, DecodedStatus | undefined>
 * }} Platform
 */

const state = () => ({
  /** @type {Record<string, object>} */
  features: {},

  /** @type {Record<string, Platform>} */
  platforms: {},

  /** @type {Record<string, DecodedStatus | undefined>} */
  yourBrowser: {},

  /** @type {{ name: string; features: object[] }[]} */
  featureGroups: [],

  categories: [],
  selectedCategories: ['Web Browsers', 'Standalone Runtimes'],

  async init() {
    const { features, browsers: platforms } = await fetch('/features.json', {
      credentials: 'include', // https://stackoverflow.com/a/63814972
      mode: 'no-cors',
    }).then((res) => res.json());

    this.features = features;
    this.categories = [
      ...new Set(Object.values(platforms).map(({ category }) => category)),
    ];

    // Decode the compact status format for easier future processing.
    this.platforms = mapValues(platforms, (platform) => {
      const featuresForPlatform = mapValues(features, (_, featName) => {
        const raw = platform.features[featName];
        return typeof raw === 'undefined'
          ? { type: 'no' } // Missing values default to 'no'
          : decodeSupportStatus(raw);
      });
      return { ...platform, features: featuresForPlatform };
    });

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

  onSelectedCategoryChange(value, oldValue) {
    if (!value.length && this.categories.length) {
      // Prevent user from deselecting all categories.
      this.selectedCategories = this.categories.filter(
        (category) => !oldValue.includes(category)
      )
    }
  },

  get selectedPlatforms() {
    return Object.entries(this.platforms).filter(([, { category }]) =>
      this.selectedCategories.includes(category)
    );
  },

  get hasBrowsers() {
    return this.selectedCategories.includes('Web Browsers');
  },

  get numColumns() {
    let n = 1;
    if (this.hasBrowsers) n++; // "Your Browser"
    n += this.selectedPlatforms.length;
    return n;
  },

  /**
   * @param {[string, Platform][]} platforms
   * @returns {[string | null, DecodedStatus | undefined]}
   * */
  supportForPlatforms(platforms, featureId) {
    const columns = [
      // "Your browser"
      [null, this.yourBrowser[featureId]],
      // Rest of the columns
      ...platforms.map(([name, platform]) => [
        name,
        platform.features[featureId],
      ]),
    ];
    if (!this.hasBrowsers) columns.shift();
    return columns;
  },

  /** @param {DecodedStatus} selected  */
  toggleFeatureDetails(selected) {
    if (selected.expanded) {
      selected.expanded = false;
    } else {
      // Only one should be open at a time, close everything else first.
      Object.values(this.yourBrowser).forEach(
        (feat) => feat?.expanded && (feat.expanded = false)
      );
      Object.values(this.platforms)
        .flatMap((platform) => Object.values(platform.features))
        .forEach((feat) => feat?.expanded && (feat.expanded = false));
      selected.expanded = true;
    }
  },

  /** @param {DecodedStatus | undefined} status */
  classForStatus(status) {
    if (!status?.type) return null;
    return `status-${status.type}`;
  },

  /** @param {DecodedStatus | undefined} status */
  iconForStatus(status) {
    if (!status?.type) return statusIcons['loading'];
    return statusIcons[status.type];
  },

  get iconMoreDetails() {
    return statusIcons['more'];
  },

  get iconNote() {
    return statusIcons['asterisk'];
  },

  /** @param {DecodedStatus | undefined} status */
  iconForNote(status) {
    if (!status?.type) return noteIcons['unknown'];
    return noteIcons[status.type] ?? noteIcons['unknown'];
  },

  /** @param {DecodedStatus | undefined} status */
  labelForStatus(status) {
    if (!status) return null;
    if (status.version) return status.version;
    switch (
      status.type
      //   case 'no':
      //     return 'No';
      // case 'not-applicable':
      //   return 'N/A';
    ) {
    }
    return null;
  },

  /**
   * @param {DecodedStatus | undefined} status
   * @param {string | null} platformName
   */
  detailsLabelForStatus(status, platformName) {
    if (!status?.type) return null;
    switch (status.type) {
      case 'yes':
        if (!platformName) return 'Supported in your browser';
        if (status.version) {
          return `Supported in ${platformName} ${status.version}`;
        } else {
          const fragment = document.createDocumentFragment(),
            note = document.createElement('span');
          note.className = 'text-secondary';
          note.textContent = '(version unknown)';
          fragment.append(`Supported in ${platformName} `, note);
          return fragment;
        }
      case 'no':
        if (!platformName) return 'Not supported in your browser';
        return `Not supported in ${platformName}`;
      case 'experimental':
        return `Experimental support in ${platformName}`;
      case 'not-applicable':
        return `This feature is not applicable to ${platformName}`;
      case 'unknown':
        return 'Detection unavailable for this feature';
    }
    throw new TypeError();
  },

  /** @param {string} note  */
  renderNote(note) {
    if (!note) return note;

    // Transform markdown-like backticks into html <code></code>
    const fragment = document.createDocumentFragment();
    while (note) {
      const [head, body, tail] = splitParts(note, '`');
      head && fragment.append(head);
      if (body) {
        const el = document.createElement('code');
        el.textContent = body;
        fragment.appendChild(el);
      }
      note = tail;
    }
    return fragment;
  },
});

document.addEventListener('alpine:init', () => {
  // A custom direction `x-replace` to directly insert DOM nodes into the document.
  // This avoids HTML parsing and is much more performant than `x-html`.
  Alpine.directive(
    'replace',
    (
      /** @type {Element} */ el,
      { expression, modifiers },
      { evaluateLater, effect }
    ) => {
      const getChild = evaluateLater(expression);
      effect(() =>
        getChild((child) => {
          if (Array.isArray(child))
            throw new TypeError(
              'x-replace cannot operate on arrays, use DocumentFragment instead'
            );
          if (modifiers.includes('clone') && child instanceof Node)
            child = document.importNode(child, true);
          el.replaceChildren(child);
        })
      );
    }
  );

  Alpine.data('data', state);
});
