---
layout: default
---
# Roadmap

In November 2017, WebAssembly CG members representing four browsers, Chrome, Edge, Firefox, and WebKit, have reached consensus that the design of the initial (MVP) WebAssembly API and binary format is complete to the extent that no further design work is possible without implementation experience and significant usage.

After the initial release, WebAssembly has been gaining new features through the [standardization process](https://github.com/WebAssembly/meetings/blob/master/process/phases.md). For the complete list of current proposals and their respective stages, check out the [`WebAssembly/proposals` repo](https://github.com/WebAssembly/proposals).

The table below aims to track implemented features in popular engines:

<table id="feature-support"></table>
<script src="https://unpkg.com/wasm-feature-detect/dist/umd/index.js"></script>
<script>
  (async () => {
    let { features, browsers } = await fetch('/features.json').then(res => res.json());
    let table = document.getElementById('feature-support');

    function h(name, props = {}, children = []) {
      let node = Object.assign(document.createElement(name), props);
      node.append(...children);
      return node;
    }

    table.append(
      h('tr', {}, [
        h('th'),
        h('th', {}, ['Your browser']),
        ...Object.entries(browsers).map(([name, { url, logo }]) =>
          h('th', {}, [
            h('a', { href: url }, [
              h('img', { src: logo, width: 32, height: 32 }),
              h('br'),
              name
            ])
          ])
        )
      ])
    );

    for (let [name, { description, url }] of Object.entries(features)) {
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
      table.append(
        h('tr', {}, [
          h('th', {}, [h('a', { href: url }, [description])]),
          supportHTML,
          ...Object.values(browsers).map(({ features }) => {
            let support = features[name];
            if (typeof support === 'string') {
              return h('td', { title: support, tabIndex: 0 }, ['⏳']);
            }
            return h('td', {}, [support ? '✔️' : '❌']);
          })
        ])
      );
    }
  })();
</script>

To detect supported features at runtime from JavaScript, check out the [`wasm-feature-detect` library](https://github.com/GoogleChromeLabs/wasm-feature-detect), which powers the "Your browser" column above.
