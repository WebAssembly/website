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
<script src="/roadmap.js"></script>

To detect supported features at runtime from JavaScript, check out the [`wasm-feature-detect` library](https://github.com/GoogleChromeLabs/wasm-feature-detect), which powers the "Your browser" column above.
