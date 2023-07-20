---
layout: default
---
# Roadmap

In November 2017, WebAssembly CG members representing four browsers, Chrome, Edge, Firefox, and WebKit, reached consensus that the design of the initial (MVP) WebAssembly API and binary format is complete to the extent that no further design work is possible without implementation experience and significant usage.

After the initial release, WebAssembly has been gaining new features through the [standardization process](https://github.com/WebAssembly/meetings/blob/master/process/phases.md). For the complete list of current proposals and their respective stages, check out the [`WebAssembly/proposals` repo](https://github.com/WebAssembly/proposals).

<!-- Apache License 2.0, https://github.com/Remix-Design/remixicon -->
<template id="support-symbol-yes">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-label="Supported"><path class="svg-stroke" d="M10 15.2 19.2 6l1.4 1.4L10 18l-6.4-6.4L5 10.2Z"/></svg>
</template>
<template id="support-symbol-no">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-label="Not supported"><path class="svg-stroke" d="m12 10.6 5-5 1.4 1.5-5 4.9 5 5-1.4 1.4-5-5-5 5L5.7 17l5-5-5-5 1.5-1.4z"/></svg>
</template>
<template id="support-symbol-flag">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-label="Not supported by default"><path class="svg-stroke" d="M4 17v5H2V3h19.1a.5.5 0 0 1 .5.7L18 10l3.6 6.3a.5.5 0 0 1-.5.7H4zM4 5v10h14.6l-2.9-5 2.9-5H4z"/></svg>
</template>
<template id="support-symbol-unknown">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-label="Unknown"><path class="svg-stroke" d="M24 38a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0-34a12 12 0 0 1 12 12c0 4.3-1.5 6.6-5.3 9.8-3.9 3.3-4.7 4.8-4.7 8.2h-4c0-5 1.6-7.4 6-11.2 3.1-2.6 4-4 4-6.8a8 8 0 1 0-16 0v2h-4v-2A12 12 0 0 1 24 4z"/></svg>
</template>

<template id="support-symbol-loading">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-label="Loading"><circle fill="#ccc" cx="2" cy="12" r="2"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".1"/></circle><circle fill="#ccc" cx="10" cy="12" r="2"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".2"/></circle><circle fill="#ccc" cx="18" cy="12" r="2"><animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin=".3"/></circle></svg>
</template>

The table below aims to track implemented features in popular engines:

<article id="feature-support-error" style="display:none">
  <div class="alert-icon">&#x26A0;&#xFE0E;</div>
  <div class="alert-body">
    <div class="alert-title">An error occured while loading the feature table</div>
    <div class="alert-subtitle">Check the browser console for details.
    If the problem persists after reloading the page, please
    <a href="https://github.com/WebAssembly/website/issues" target="_blank">file an issue on GitHub</a>.</div>
  </div>
</article>
<div id="feature-support-scrollbox">
  <noscript>&#x26A0;&#xFE0E; Javascript is disabled and the table cannot be displayed.</noscript>
  <table id="feature-support" aria-label="Status of implemented features in popular engines"></table>
</div>
<link rel="preload" href="/features.json" as="fetch">
<link rel="modulepreload" id="preload-tooltip" href="https://cdn.jsdelivr.net/npm/@floating-ui/dom@1/+esm">
<link rel="modulepreload" id="preload-detect" href="https://cdn.jsdelivr.net/npm/wasm-feature-detect@1.5/dist/esm/index.js">
<script src="/roadmap.js"></script>

To detect supported features at runtime from JavaScript, check out the [`wasm-feature-detect` library](https://github.com/GoogleChromeLabs/wasm-feature-detect), which powers the "Your browser" column above.
