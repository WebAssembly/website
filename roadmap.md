---
layout: default
---
# Roadmap

In November 2017, WebAssembly CG members representing four browsers, Chrome, Edge, Firefox, and WebKit, reached consensus that the design of the initial (MVP) WebAssembly API and binary format is complete to the extent that no further design work is possible without implementation experience and significant usage.

After the initial release, WebAssembly has been gaining new features through the [standardization process](https://github.com/WebAssembly/meetings/blob/master/process/phases.md). For the complete list of current proposals and their respective stages, check out the [`WebAssembly/proposals` repo](https://github.com/WebAssembly/proposals).

<table id="feature-support">
  <caption>The table below aims to track implemented features in popular engines:</caption>
</table>
<script src="https://unpkg.com/wasm-feature-detect/dist/umd/index.js" crossorigin></script>
<script>
  (async () => {
    function partitionArray(arr, condition) {
      let matched = [];
      let unmatched = [];

      for (let item of arr) {
        if (condition(item)) {
          matched.push(item);
        } else {
          unmatched.push(item);
        }
      }

      return { matched, unmatched };
    }

    let { features, browsers } = await fetch('/features.json').then(res => res.json());
    let table = document.getElementById('feature-support');

    function h(name, props = {}, children = []) {
      let node = Object.assign(document.createElement(name), props);
      node.append(...children);
      return node;
    }

    let tBody = document.createElement('tbody');

    table.append(
      h('thead', {}, [
        h('tr', {}, [
          h('th'),
          h('th', {}, ['Your browser']),
          ...Object.entries(browsers).map(([name, { url, logo, version }]) =>
            h('th', {}, [
              h('a', { href: url }, [
                h('img', { src: logo, width: 32, height: 32 }),
                h('br'),
                name,
                h('sup', {}, [version]),
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

    const columnCount = 2 + Object.keys(browsers).length;

    for (let { name, features } of featureGroups) {
      tBody.append(
        h('tr', {}, [
          h('th', { colSpan: columnCount }, [name])
        ])
      );
      for (let { name, description, url, phase } of features) {
        let supportHTML = h('td');
        wasmFeatureDetect[name]()
          .then(
            supported => (supported ? '✔️' : '❌'),
            err => {
              supportHTML.style.backgroundColor = '#ffcdd2';
              return err.message;
            }
          )
          .then(textContent => {
            supportHTML.textContent = textContent;
          });
        tBody.append(
          h('tr', {}, [
            h('th', {}, [h('a', { href: url }, [description])]),
            supportHTML,
            ...Object.values(browsers).map(({ features }) => {
              let support = features[name];
              if (typeof support === 'string') {
                return h('td', { title: support, tabIndex: 0 }, ['⏳']);
              }
              if (support === null) {
                return h('td', { title: support, tabIndex: 0 }, ['ⁿ/ₐ']);
              }
              return h('td', {}, [support ? '✔️' : '❌']);
            })
          ])
        );
      }
    }
  })();
</script>

To detect supported features at runtime from JavaScript, check out the [`wasm-feature-detect` library](https://github.com/GoogleChromeLabs/wasm-feature-detect), which powers the "Your browser" column above.
