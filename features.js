'use strict';

/*! groupby-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/**
 * Groups elements from an iterable into an object based on a callback function.
 *
 * @template T
 * @template {PropertyKey} K
 * @param {Iterable<T>} iterable - The iterable to group.
 * @param {function(T, number): K} callbackfn - The callback function to
 * determine the grouping key.
 * @returns {Partial<Record<K, T[]>>} An object where keys are the grouping keys
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
 * @template {Record<any, any>} T
 * @template R
 * @param {T} obj
 * @param {(value: T[keyof T] & {}, key: keyof T) => R} mapper
 * @returns {{ [K in keyof T]: R }}
 */
function mapValues(obj, mapper) {
  return /** @type {any} */ (
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        mapper(value, /** @type {keyof T} */ (key)),
      ])
    )
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

function loadFeatureDetection() {
  // Please cache bust by bumping the `v` parameter whenever `feature.json` is
  // updated to depend on a new version of the library. See #353 for discussion.
  // Make sure to also match the preload link in `feature-table.html`.
  const module =
    // @ts-ignore
    import('https://unpkg.com/wasm-feature-detect@1/dist/esm/index.js?v=1');
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

/** @typedef {{ name: string, queryKey: string, default?: boolean }} Category */

/** @param {Category[]} allCategories */
function loadSelectedCategories(allCategories) {
  // Support both styles: `?categories=c1,c2` and `?categories=c1&categories=c2`
  const names = new URLSearchParams(location.search)
    .getAll('categories')
    .flatMap((values) => values.split(','))
    .flatMap((param) => {
      const category = allCategories.find(({ queryKey }) => queryKey === param);
      return category ? [category.name] : [];
    });

  return names.length
    ? names
    : allCategories
        .filter((category) => category.default)
        .map((category) => category.name);
}

/**
 * @param {Category[]} allCategories
 * @param {string[]} selected
 */
function saveSelectedCategories(allCategories, selected) {
  const defaultSelection = allCategories
    .filter((category) => category.default)
    .map((category) => category.name);

  if (
    selected.length === defaultSelection.length &&
    selected.every((name) => defaultSelection.includes(name))
  ) {
    selected = [];
  }

  // Keep the same order as in `allCategories`
  const queryKeys = allCategories
    .filter(({ name }) => selected.includes(name))
    .map(({ queryKey }) => queryKey);

  const url = new URL(location.href);
  if (queryKeys.length) {
    url.searchParams.set('categories', queryKeys.join(','));
  } else {
    url.searchParams.delete('categories');
  }

  history.replaceState(null, '', url);
}

// Preload icon templates from DOM into a frozen lookup object
const icons = ((names) =>
  Object.freeze(
    names.reduce((icons, name) => {
      // @ts-expect-error
      icons[name] = document.getElementById(`icon-${name}`).content;
      return icons;
    }, /** @type {{ [K in (typeof names)[number]]: DocumentFragment }}  */ ({}))
  ))(
  /** @type {const} */ ([
    'check',
    'checkbox-circle',
    'close',
    'close-circle',
    'checkbox-blank-circle',
    'flask',
    'forbid-2',
    'asterisk',
    'question-mark',
    'more',
    'loading',
  ])
);

/**
 * @param {DecodedStatus | undefined} status
 * @param {Partial<Record<DecodedStatus['type'], keyof typeof icons>> & { 'unknown': keyof typeof icons }} map
 */
const getIconByStatus = (status, map) =>
  icons[status?.type ? (map[status.type] ?? map['unknown']) : 'loading'];

/**
 * @typedef {{
 *  name: string;
 *  url: string;
 *  logo: string;
 *  logoClassName?: string;
 *  category: string;
 *  categories: string[];
 *  features: Record<string, DecodedStatus | undefined>
 * }} Platform
 */

const state = () => ({
  ICONS: icons,

  /** @type {Platform[]} */
  platforms: [],

  /** @type {Record<string, DecodedStatus | undefined>} */
  yourBrowser: {},

  /** @type {{ name: string; features: object[] }[]} */
  featureGroups: [],

  /** @type {Category[]} */
  categories: [],

  get categoryNames() {
    return this.categories.map(({ name }) => name);
  },

  /** @type {string[]} */
  selectedCategories: [],

  async init() {
    const {
      features,
      categories,
      browsers: platforms,
    } = await fetch('/features.json', {
      // Both are required for preload to work: https://stackoverflow.com/a/63814972
      credentials: 'include',
      mode: 'no-cors',
    }).then((res) => res.json());

    const categoriesInUse = new Set(
      Object.values(platforms).flatMap(({ category }) => category)
    );

    // Hide empty categories.
    this.categories = categories.filter(({ name }) =>
      categoriesInUse.has(name)
    );
    this.selectedCategories = loadSelectedCategories(categories);

    this.platforms = Object.entries(platforms).map(
      ([name, { category, ...platform }]) => {
        // Determine the primary category, reusing the variable `category`.
        let categories = [];
        if (Array.isArray(category)) {
          categories = category;
          category = category[0];
        }

        // Decode the compact status format for easier future processing.
        const platformFeatures = mapValues(features, (_, featName) => {
          const raw = platform.features[featName];
          return typeof raw === 'undefined'
            ? { type: 'no' } // Missing values default to 'no'
            : decodeSupportStatus(raw);
        });

        return {
          name,
          ...platform,
          category,
          categories,
          features: platformFeatures,
        };
      }
    );

    /** @type {any} */
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

    const featureDetect = loadFeatureDetection();
    for (const id of Object.keys(features)) {
      featureDetect(id)
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

    // The loading indicator includes a "report issue" link. In case of errors, we just leave that visible.
    document.getElementById('feature-table-loading')?.remove();
  },

  /**
   * @param {string[]} value
   * @param {string[]} oldValue
   */
  onSelectedCategoryChange(value, oldValue) {
    if (!value.length && this.categories.length) {
      // Prevent user from deselecting all categories.
      this.selectedCategories = this.categoryNames.filter(
        (name) => !oldValue.includes(name)
      );
    }

    saveSelectedCategories(this.categories, this.selectedCategories);
  },

  /**
   * Returns the cells to be rendered in a specific feature row
   * (or null for the header row), excluding the row header.
   *
   * @param {string | null} featureId
   * @returns {(Omit<Partial<Platform>, 'features'> & {
   *  name: string;
   *  category: string;
   *  status?: DecodedStatus | undefined;
   *  rendered: object;
   * })[]}
   */
  cellsForRow(featureId) {
    const columns = [
      {
        name: 'Your browser',
        category: 'Web Browsers',
        features: this.yourBrowser,
        categories: undefined,
      },
      ...this.platforms,
    ];

    const selected = new Set(this.selectedCategories);
    const cells = columns.flatMap(({ category, features, ...platform }) => {
      if (!selected.has(category)) {
        // Look for the next available option if the primary category is not selected.
        category =
          platform.categories?.find((/** @type {string} */ category) =>
            selected.has(category)
          ) ?? '';

        // Skip the platform if none of its categories are selected,.
        if (!category) return [];
      }

      const status = featureId ? features[featureId] : undefined;
      return [
        {
          ...platform,
          category,
          status,
          rendered: this.renderStatus(status, platform.name),
        },
      ];
    });

    const { categoryNames } = this;
    return cells.sort(
      (a, b) =>
        categoryNames.indexOf(a.category) - categoryNames.indexOf(b.category)
    );
  },

  /** The categories currently displayed and their number of columns. */
  get cellGroupsForRow() {
    return mapValues(
      Object.groupBy(this.cellsForRow(null), ({ category }) => category),
      (platforms) => platforms.length
    );
  },

  get numColumns() {
    return 1 + this.cellsForRow(null).length;
  },

  /** @param {DecodedStatus} selected  */
  toggleFeatureDetails(selected) {
    if (selected.expanded) {
      selected.expanded = false;
    } else {
      // Only one should be open at a time, close everything else first.
      const collapseAll = (
        /** @type {Record<any, DecodedStatus | undefined>} */ features
      ) => {
        for (const feat of Object.values(features))
          feat?.expanded && (feat.expanded = false);
      };

      collapseAll(this.yourBrowser);
      for (const platform of this.platforms) collapseAll(platform.features);
      selected.expanded = true;
    }
  },

  /**
   * @param {DecodedStatus | undefined} status
   * @param {string | null} platformName
   */
  renderStatus(status, platformName) {
    const className = status?.type ? `status-${status.type}` : null;

    const cellIcon = getIconByStatus(status, {
      yes: 'check',
      no: 'close',
      'not-applicable': 'forbid-2',
      experimental: 'flask',
      unknown: 'question-mark',
    });

    const noteIcon = getIconByStatus(status, {
      yes: 'checkbox-circle',
      no: 'close-circle',
      'not-applicable': 'forbid-2',
      experimental: 'flask',
      unknown: 'checkbox-blank-circle',
    });

    const statusLabel = status?.version || null;
    const detailsLabel = this.detailsLabelForStatus(status, platformName);
    const note = this.renderNote(status?.note);

    return {
      className,
      cellIcon,
      statusLabel,
      detailsLabel,
      noteIcon,
      note,
    };
  },

  /**
   * @param {DecodedStatus | undefined} status
   * @param {string | null} platformName
   */
  detailsLabelForStatus(status, platformName) {
    if (!status?.type) return null;
    switch (status.type) {
      case 'yes':
        if (platformName === 'Your browser') return 'Supported in your browser';
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
        if (platformName === 'Your browser')
          return 'Not supported in your browser';
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

  /** @param {string | undefined} note  */
  renderNote(note) {
    if (!note) return;

    // Transform markdown-like backticks into html <code></code>
    // TODO: use regex
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

  /** @param {string} s  */
  str2id(s) {
    return s.replaceAll(/\W+/g, '-').toLowerCase();
  },
});

document.addEventListener('alpine:init', () => {
  // @ts-ignore
  const Alpine = window.Alpine;

  // A custom direction `x-replace` to directly insert DOM nodes into the document.
  // This avoids HTML parsing and is much more performant than `x-html`.
  Alpine.directive(
    'replace',
    (/** @type {Element} */ el, { expression }, { evaluateLater, effect }) => {
      const getChild = evaluateLater(expression);
      effect(() =>
        getChild((/** @type {string | Node} */ child) => {
          if (Array.isArray(child))
            throw new TypeError(
              'x-replace cannot operate on arrays, use DocumentFragment instead'
            );

          el.replaceChildren(
            child instanceof Node ? document.importNode(child, true) : child
          );
        })
      );
    }
  );

  Alpine.data('data', state);
});
