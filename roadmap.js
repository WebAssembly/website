(async () => {
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

  const { features, browsers } = await fetch('/features.json').then(res => res.json());
  const table = document.getElementById('feature-support');

  function h(name, props = {}, children = []) {
    const node = Object.assign(document.createElement(name), props);
    node.append(...children);
    return node;
  }

  const tBody = document.createElement('tbody');

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

  for (const { name, features } of featureGroups) {
    tBody.append(
      h('tr', {}, [
        h('th', { colSpan: columnCount }, [name])
      ])
    );
    for (const { name, description, url, phase } of features) {
      const supportHTML = h('td');
      Promise.resolve()
        // Make sure to call `wasmFeatureDetect` inside a promise-chained
        // function so that we can still render table rows for features that
        // we don't have a detector yet.
        .then(() => wasmFeatureDetect[name]())
        .then(
          supported => (supported ? '✔️' : '❌'),
          err => '❌'
        )
        .then(textContent => {
          supportHTML.textContent = textContent;
        });
      tBody.append(
        h('tr', {}, [
          h('th', {}, [h('a', { href: url }, [description])]),
          supportHTML,
          ...Object.values(browsers).map(({ features }) => {
            const support = features[name];
            if (typeof support === 'string') {
              return h('td', { title: support, tabIndex: 0 }, ['⏳']);
            }
            return h('td', {}, [support ? '✔️' : support === null ? 'ⁿ/ₐ' : '❌']);
          })
        ])
      );
    }
  }
})();
