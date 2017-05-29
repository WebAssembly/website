---
layout: default
lead: WebAssembly / <i>wasm</i> 提供一种便携的，体积小加载速度快的格式，它适合编译后再Web中运行。
---

<div class="flash flash-warn">
  WebAssembly 现在被 <a href="https://www.w3.org/community/webassembly/">W3C 社区组</a> 设计为开放标准，成员包括所有主流浏览器的代表。
</div>
<div class="row">
  <div class="bubble col-xs-12 col-md-6">
    <h3>高效 快速</h3>
    <p>Wasm的 <a href="/docs/semantics/">stack machine</a> 被设计成<a href="/docs/binary-encoding/">二进制格式</a>，它的体积更小，加载时间更快。 WebAssembly 使用多平台下<a href="/docs/portability/#assumptions-for-efficient-execution">通用的硬件功能</a>来实现原生的执行速度</p>
  </div>

  <div class="bubble col-xs-12 col-md-6">
    <h3>安全</h3>
    <p>
    WebAssembly 描述了一个内存安全的沙盒<a href="/docs/semantics/#linear-memory">执行环境</a>，甚至可以在现有的 JavaScript 虚拟机中实现。在<a href="/docs/web/">web环境中</a>，WebAssembly将会严格遵守同源和权限安全策略。
    </p>
  </div>

</div>
<div class="row">
  <div class="bubble col-xs-12 col-md-6">
    <h3>开放可调试</h3>
    <p>WebAssembly 设计了一个非常规整的<a href="/docs/text-format/">文本格式</a>用来、调试、测试、实验、优化、学习、教学或者编写程序。可以以这种文本格式在web页面上<a href="/docs/faq/#will-webassembly-support-view-source-on-the-web">查看wasm模块的源码</a>。</p>
  </div>
  <div class="bubble col-xs-12 col-md-6">
    <h3>Web 平台的一部分</h3>
    <p>
      WebAssembly 在 <a href="/docs/web/">web</a> 中被设计成无版本、特性可测试、向后兼容的。WebAssembly 可以被 JavaScript 调用，进入 JavaScript上下文，也可以像 Web API 一样调用浏览器的功能。当然，WebAssembly 不仅可以运行在浏览器上，也可以运行在<a href="/docs/non-web/">非web</a>环境下。
    </p>
  </div>
</div>