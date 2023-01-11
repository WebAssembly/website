(async () => {
  'use strict';

  function partitionArray(arr, condition) {
    const matched = [];
    const unmatched = [];

    for (const item of arr) {
      if (condition(item)) {
        matched.push(item);
      } else {
        unmatched.push(item);
      }
    }

    return { matched, unmatched };
  }

  function h(name, props = {}, children = []) {
    const node = Object.assign(document.createElement(name), props);
    node.append(...children);
    return node;
  }

  // Convert number to lowercase hexavigesimal like "a, b, c, .., x, y, z, aa, ab, ..", starting from zero.
  // This is the same format as CSS `list-style: lower-alpha`, which is used for our footnote lists.
  function toAlphabet(num) {
    const digit = num % 26,
      char = String.fromCharCode(97 + digit),
      rem = num - digit;
    return rem ? toAlphabet(Math.floor(rem / 26) - 1) + char : char;
  }

  // Map names to HTML ids. For example, idMap['table-col']('Chrome') will return 'table-col-chrome'.
  // This is to satisfy the need for unique ids in `headers` attributes.
  // Hardcoded array makes it easier to find typos, since it would throw an error if the namespace is mistyped.
  const idMap = ['table-group', 'table-col', 'table-row'].reduce((map, namespace) => {
    map[namespace] = (str) => namespace + '-' + str.toLowerCase().replace(/[^\w\d-_]+/g, '-');
    return map;
  }, {});

  // Get a copy of the requested SVG icon. Those are defined in the markdown as templates.
  function icon(key) {
    return document.getElementById(`support-symbol-${key}`).content.firstElementChild.cloneNode(true);
  }

  const scrollbox = document.getElementById('feature-support-scrollbox');
  const table = document.getElementById('feature-support');

  const detectWasmFeature = _loadFeatureDetectModule();
  const addTooltip = _loadTooltipModule();

  const { features, browsers } = await fetch('/features.json', {
    credentials: 'include', // https://stackoverflow.com/a/63814972
    mode: 'no-cors'
  }).then(res => res.json());

  const tBody = document.createElement('tbody');
  table.append(
    h('thead', {}, [
      h('tr', {}, [
        h('th', { id: 'table-blank' }),
        h('th', { scope: 'col', id: idMap['table-col']('Your browser') }, ['Your browser']),
        ...Object.entries(browsers).map(([name, { url, logo }]) =>
          h('th', { scope: 'col', id: idMap['table-col'](name) }, [
            h('a', { href: url, target: '_blank' }, [
              // https://www.w3.org/WAI/WCAG22/Techniques/html/H2
              h('img', { src: logo, width: 48, height: 32, alt: '' }),
              h('br'),
              name
            ])
          ])
        )
      ])
    ]),
    tBody
  );

  let featureGroups = partitionArray(
    Object.entries(features).map(([name, feature]) => Object.assign(feature, { name })),
    feature => feature.phase >= 4
  );

  featureGroups = [
    { name: 'Standardized features', features: featureGroups.matched },
    { name: 'In-progress proposals', features: featureGroups.unmatched },
  ];

  // Collect all notes and assign an index to each unique item
  // { "First unique note": 0, "Second unique note": 1, ...}
  const notes = Object.values(browsers).flatMap(b =>
    Object.values(b.features)
      .filter(s => Array.isArray(s))
      .map(s => s[1])
  );
  const note2index = new Map();
  let noteIndex = 0;
  for (const note of notes) {
    if (!note2index.has(note)) {
      note2index.set(note, noteIndex++);
    }
  }

  // Generate the footnote list. They are later referenced in the actual table.
  const noteList = document.createElement('ol');
  // Place footnote list outside of the scolling area
  scrollbox.parentNode.insertBefore(noteList, scrollbox.nextSibling);
  for (const [note, index] of note2index) {
    const item = h('li', { id: `feature-note-${index}` });
    noteList.appendChild(item).appendChild(renderNote(note));
  }

  // Create an <a> element that links to the specified footnote.
  // Also returns the HTML id of the footnote it refers to.
  function createNoteRef(index) {
    const id = `feature-note-${index}`;
    return [id, h('a', { href: `#${id}` }, [`[${toAlphabet(index)}]`])];
  }

  const columnCount = 2 + Object.keys(browsers).length;

  for (const { name: groupName, features } of featureGroups) {
    tBody.append(
      h('tr', {}, [
        h('th', {
          scope: 'colgroup',
          colSpan: columnCount,
          id: idMap['table-group'](groupName),
          headers: 'table-blank',
          // Chrome doesn't handle `headers` attribute correctly.
          // Just hide the group headers for now...
          // https://bugs.chromium.org/p/chromium/issues/detail?id=1081201
          //
          // Actually Firefox doesn't support `ariaHidden` attribute.
          // This is a happy coincidence, since `headers` works fine on Firefox anyway.
          ariaHidden: true
        }, [groupName])
      ])
    );
    for (const { name: featName, description, url } of features) {
      const detectResult = h('td', {
        headers: [idMap['table-col']('Your browser'), idMap['table-row'](featName)].join(' ') 
      }, [buildCellInner('loading')]);

      detectWasmFeature(featName).then(supported => {
        detectResult.textContent = '';
        detectResult.appendChild(buildCellInner(supported ? 'yes' : 'no'));
        addTooltip(detectResult, supported ? '✓ Supported' : '✗ Not supported', [tBody, scrollbox]);
      }, _err => {
        detectResult.textContent = '';
        detectResult.appendChild(buildCellInner('unknown'));
        addTooltip(detectResult, 'Detection unavailable for this feature', [tBody, scrollbox]);
      });

      tBody.append(
        h('tr', {}, [
          h('th', {
            scope: 'row',
            id: idMap['table-row'](featName),
            headers: idMap['table-group'](groupName)
          }, [h('a', { href: url, target: '_blank' }, [description])]),
          detectResult,
          ...Object.entries(browsers).map(([browserName, { features }]) => {
            // Meaning of each entry:
            // * null                     => not applicable for this browser
            // * true/false               => supported/unsupported
            // * "version"                => supported since "version"
            // * "flag"                   => flag required (must be lowercase)
            // * [true, "footnotes"]      => supported, with "footnotes"
            // * ["version", "footnotes"] => supported since "version", with "footnotes"
            // ...and any combination thereof
            let support = features[featName];
            let box, note;

            // First extract the footnote part if it's an array
            if (Array.isArray(support)) {
              note = support[1];
              support = support[0];
            }

            if (typeof support === 'string') {
              if (support === 'flag') {
                // 'flag' is treated specially as the "requires flag" icon
                box = buildCellInner('flag');
              } else {
                // Otherwise it's a version number, like "95"
                box = buildCellInner('yes', support);
                note ||= `✓ Supported since version ${support}`;
              }
            } else if (!support) {
              if (support === null) {
                box = buildCellInner('na', 'N/A');
                note ||= '✗ Not applicable for this browser/engine';
              } else {
                box = buildCellInner('no');
                note ||= '✗ Not supported';
              }
            } else {
              if (support !== true) throw new TypeError();
              box = buildCellInner('yes');
              // Magic value, keep in sync with `renderNote`
              note ||= '✓ Supported, introduced in unknown version';
            }

            const cell = h('td', {
              headers: [idMap['table-col'](browserName), idMap['table-row'](featName)].join(' ')
            }, [box]);

            // Give the cell itself an `aria-lebel` to avoid screen readers calling it "empty cell".
            const icon = box.firstElementChild;
            if (icon?.hasAttribute('aria-label')) {
              cell.setAttribute('aria-label', icon.getAttribute('aria-label'));
              icon.removeAttribute('aria-label');
            }

            if (note && note2index.has(note)) {
              cell.tabIndex = 0;  // focusable
              const index = note2index.get(note);
              const [noteId, refLink] = createNoteRef(index);
              box.appendChild(h('sup', {}, [refLink]));

              const noteItem = document.getElementById(noteId);
              if (noteItem) {
                cell.addEventListener('mouseenter', () => noteItem.classList.add('ref-highlight'));
                cell.addEventListener('mouseleave', () => noteItem.classList.remove('ref-highlight'));
              }
            }

            // Clip to both <tbody> and the scrollbox.
            // the former is to avoid blocking out the headers;
            // the latter is to keep the tooltip inside the scrollable area
            addTooltip(cell, note, [tBody, scrollbox]);
            return cell;
          })
        ])
      );
      tBody.lastElementChild.setAttribute('aria-describedby', idMap['table-row'](featName));
    }
  }

  function buildCellInner(type, text) {
    const content = text || icon(type);
    return h('div', { className: `feature-cell icon-${type}`}, [content]);
  }

  function renderNote(note) {
    const fragment = document.createDocumentFragment();
    const isMissingData = note.includes('introduced in unknown version');

    // Transform markdown-like backticks into html <code></code>
    while (note) {
      const [head, body, tail] = splitParts(note, '`');
      head && fragment.append(head);
      body && fragment.appendChild(h('code', {}, [body]));
      note = tail;
    }

    const firstNode = fragment.firstChild;
    if (firstNode.nodeType === Node.TEXT_NODE) {
      // No point for screen readers to pronounce those symbols out loud.
      for (const symbol of ['✓', '✗']) {
        if (firstNode.nodeValue?.startsWith(symbol)) {
          // Before: <#text>✓ Supported</#text>
          // After:  <span>✓</span><#text> Supported</#text>
          firstNode.splitText(1);
          const symbolNode = h('span', {}, firstNode.nodeValue);
          symbolNode.setAttribute('aria-hidden', '');
          fragment.replaceChild(symbolNode, firstNode);
          break;
        }
      }
    }

    if (isMissingData) {
      fragment.appendChild(h('a', {
        href: 'https://github.com/WebAssembly/website/blob/master/features.json',
        target: '_blank'
      }, [' (contribute data)']))
    }

    return fragment;
  }

  // Break a string into three parts using the given delimiter.
  function splitParts(str, delim) {
    const start = str.indexOf(delim);
    const end = str.indexOf(delim, start + 1);
    if (start >= 0 && end > start) {
      const head = str.substring(0, start);
      const body = str.substring(start + 1, end);
      const tail = str.substring(end + 1);
      return [head, body, tail];
    }
    return [str, '', '']
  }

  // Lazy-loading
  function _loadTooltipModule() {
    // Be sure to change the preloads in markdown when updating url.
    // The ESM bundle of this package doesn't work with unpkg.com.
    const module = import('https://cdn.jsdelivr.net/npm/@floating-ui/dom@1/+esm');

    const subscribers = new Set();
    const updateAll = () => { for (const fn of subscribers) fn(); };

    document.addEventListener('scroll', updateAll, { passive: true });
    scrollbox.addEventListener('scroll', updateAll, { passive: true });
    window.addEventListener('resize', updateAll, { passive: true });

    let counter = 0;
    return (reference, note, boundary) =>
      module.then(({ computePosition, offset, flip, shift, arrow }) => {
        const tooltipId = `tooltip-${counter++}`;
        const tooltip = h('div', { id: tooltipId, className: 'feature-tooltip', role: 'tooltip' });
        tooltip.appendChild(renderNote(note));

        const arrowElement = h('div', { className: 'feature-tooltip-arrow' });
        tooltip.appendChild(arrowElement);

        const update = () => computePosition(reference, tooltip, {
          placement: 'top',
          middleware: [
            offset(6),
            flip({ boundary }),
            shift({ padding: 6, boundary }),
            arrow({ element: arrowElement, padding: 3, boundary })
          ],
        }).then(({ x, y, placement, middlewareData }) => {
          const { x: arrowX, y: arrowY } = middlewareData.arrow;
          Object.assign(arrowElement.style, {
            left: arrowX !== null ? `${arrowX}px` : '',
            top: arrowY !== null ? `${arrowY}px` : '',
          });

          tooltip.style.transform = `translate(${x}px, ${y}px)`;
          // Force the browser to apply CSS changes first
          if (tooltip.dataset.placement !== placement) tooltip.offsetHeight;
          // This will then enable the transition effect
          tooltip.dataset.placement = placement;
        });

        const setVisible = (visible) => {
          if (visible) {
            tooltip.style.removeProperty('display');
            update();
            subscribers.add(update);
          } else {
            subscribers.delete(update);
            tooltip.style.display = 'none';
            delete tooltip.dataset.placement; // disable the transition effect
          }
        };

        setVisible(false);

        const monitor = (name, state, listener = () => setVisible(state)) =>
            reference.addEventListener(name, listener);
        monitor('focusin', true);
        monitor('focusout', false);

        // Add a bit of delay to mouse events
        let timeout = null;
        monitor('mouseenter', true, () => {
          clearTimeout(timeout);
          if (subscribers.size) {
            timeout = setTimeout(() => setVisible(true), 80);
          } else {
            // Immediately show if there aren't other tooltips visible
            setVisible(true);
          }
        });
        monitor('mouseleave', false, () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => setVisible(false), 80);
        });

        reference.appendChild(tooltip);
        reference.setAttribute('aria-describedby', tooltipId);
        return tooltip;
      });
  }

  function _loadFeatureDetectModule() {
    // Be sure to change the preloads in markdown when updating url.
    const module = import('https://cdn.jsdelivr.net/npm/wasm-feature-detect@1.3/dist/esm/index.js');
    return (featureName) => module
      .then(wasmFeatureDetect => wasmFeatureDetect[featureName]());
  }
})();
