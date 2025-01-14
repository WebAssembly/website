---
layout: default
lead:
  WebAssembly (abbreviated <i>Wasm</i>) is a binary instruction format for a
  stack-based virtual machine. Wasm is designed as a portable compilation target
  for programming languages, enabling deployment on the web for client and
  server applications.
---

<div class="flash flash-warn">
  Developer reference documentation for Wasm can be found on <a href="https://developer.mozilla.org/en-US/docs/WebAssembly">MDN's WebAssembly pages</a>.
  The open standards for WebAssembly are developed in a <a href="https://www.w3.org/community/webassembly/">W3C Community Group</a> (that includes representatives from all major browsers) as well as a <a href="https://www.w3.org/wasm/">W3C Working Group</a>.
</div>
<div class="row">
  <div class="bubble col-xs-12 col-md-6">
    <h3>Efficient and fast</h3>
    <p>The Wasm <a href="https://webassembly.github.io/spec/core/exec/index.html">stack machine</a> is designed to be encoded in a size- and load-time-efficient <a href="https://webassembly.github.io/spec/core/binary/index.html">binary format</a>. WebAssembly aims to execute at native speed by taking advantage of <a href="/docs/portability/#assumptions-for-efficient-execution">common hardware capabilities</a> available on a wide range of platforms.</p>
  </div>
  <div class="bubble col-xs-12 col-md-6">
    <h3>Safe</h3>
    <p>WebAssembly describes a memory-safe, sandboxed <a href="https://webassembly.github.io/spec/core/exec/index.html#linear-memory">execution environment</a> that may even be implemented inside existing JavaScript virtual machines. When <a href="/docs/web/">embedded in the web</a>, WebAssembly will enforce the same-origin and permissions security policies of the browser.</p>
  </div>
</div>
<div class="row">
  <div class="bubble col-xs-12 col-md-6">
    <h3>Open and debuggable</h3>
    <p>WebAssembly is designed to be pretty-printed in a <a href="https://webassembly.github.io/spec/core/text/index.html">textual format</a> for debugging, testing, experimenting, optimizing, learning, teaching, and writing programs by hand. The textual format will be used when <a href="/docs/faq/#will-webassembly-support-view-source-on-the-web">viewing the source</a> of Wasm modules on the web.</p>
  </div>
  <div class="bubble col-xs-12 col-md-6">
    <h3>Part of the open web platform</h3>
    <p>WebAssembly is designed to maintain the versionless, feature-tested, and backwards-compatible <a href="/docs/web/">nature of the web</a>. WebAssembly modules will be able to call into and out of the JavaScript context and access browser functionality through the same Web APIs accessible from JavaScript. WebAssembly also supports <a href="/docs/non-web/">non-web</a> embeddings.</p>
  </div>
</div>
