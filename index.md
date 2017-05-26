---
layout: default
lead: WebAssembly / <i>wasm</i> 提供一种便携的，体积小加载速度快的格式，它适合编译后再Web中运行。
---

<div class="flash flash-warn">
  WebAssembly 现在被<a href="https://www.w3.org/community/webassembly/">W3C 社区组</a> 设计为开放标准，成员包括所有主流浏览器的代表。
</div>
<div class="row">
  <div class="bubble col-xs-12 col-md-6">
    <h3>高效 快速</h3>
    <p>Wasm的 <a href="/docs/semantics/">stack machine</a> 被设计成<a href="/docs/binary-encoding/">二进制格式</a>，它的体积更小，加载时间更快。 WebAssembly 使用可用的广泛平台的<a href="/docs/portability/#assumptions-for-efficient-execution">通用硬件功能</a>来实现原声的执行速度</p>
  </div>
  <div class="bubble col-xs-12 col-md-6">
    <h3>安全</h3>
    <p>
    WebAssembly描述了一个内存安全的沙盒 <a href="/docs/semantics/#linear-memory">执行环境</a>，甚至可以在现有的JavaScript虚拟机中实现。在<a href="/docs/web/">web环境中</a>，WebAssembly将会严格遵守同源和权限安全策略。
    </p>
  </div>
</div>
<div class="row">
  <div class="bubble col-xs-12 col-md-6">
    <h3>Open and debuggable</h3>
    <p>WebAssembly is designed to be pretty-printed in a <a href="/docs/text-format/">textual format</a> for debugging, testing, experimenting, optimizing, learning, teaching, and writing programs by hand. The textual format will be used when <a href="/docs/faq/#will-webassembly-support-view-source-on-the-web">viewing the source</a> of wasm modules on the web.</p>
  </div>
  <div class="bubble col-xs-12 col-md-6">
    <h3>Part of the open web platform</h3>
    <p>WebAssembly is designed to maintain the versionless, feature-tested, and backwards-compatible <a href="/docs/web/">nature of the web</a>. WebAssembly modules will be able to call into and out of the JavaScript context and access browser functionality through the same Web APIs accessible from JavaScript. WebAssembly also supports <a href="/docs/non-web/">non-web</a> embeddings.</p>
  </div>
</div>