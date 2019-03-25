---
layout: default
---
# Roadmap

## WebAssembly Consensus

WebAssembly CG members representing four browsers, Chrome, Edge, Firefox, and WebKit, have reached consensus that the design of the initial ([MVP](/docs/mvp/)) WebAssembly API and binary format is complete to the extent that no further design work is possible without implementation experience and significant usage. This marks the end of the Browser Preview and signals that browsers can begin shipping WebAssembly on-by-default. From this point forward, future features will be designed to ensure backwards compatibility.

This consensus includes a [JavaScript API](/docs/js/) and [binary format](/docs/binary-encoding/) accompanied by a [reference interpreter](https://github.com/WebAssembly/spec/tree/master/interpreter). You can test out WebAssembly today using the Emscripten toolchain by following the [developer’s guide](/getting-started/developers-guide/) and reading more on [MDN](https://developer.mozilla.org/en-US/docs/WebAssembly). You can also explore a variety of other [advanced tools](/getting-started/advanced-tools/).

See [Getting Started](/getting-started/developers-guide/) to start experimenting and
[Feedback](/community/feedback/) for how and where to direct feedback.

See this message on the community group [mailing list](https://lists.w3.org/Archives/Public/public-webassembly/2017Feb/0002.html).

## Next Steps

The WebAssembly community group and contributors plan to:

* distill the [design](https://github.com/webassembly/design)
  and [spec interpreter](https://github.com/WebAssembly/spec/tree/master/interpreter) repos
  into a single unified specification in the [spec](https://github.com/WebAssembly/spec)
  repo
* propose a new charter for a W3C WebAssembly Working Group
* graduate the [WebAssembly LLVM backend](https://github.com/llvm/llvm-project/tree/master/llvm/test/CodeGen/WebAssembly) from experimental to stable (and update Emscripten)
* prototype additional WebAssembly integration into browser developer tools
* Start work on [post-MVP features](/docs/future-features/)

## Changes Since the Browser Preview

- The [binary version](/docs/binary-encoding/#high-level-structure)
    of WebAssembly has been frozen at `0x1` (from this point forward
    all new features will be added in a backwards-compatible manner,
    and be detected through feature-testing). To update your
    WebAssembly modules, upgrade to the latest version of Emscripten 
    and recompile.

## Past Milestones

- April 2015 - [WebAssembly Community Group](https://www.w3.org/community/webassembly) started
- June 2015 - The first [public announcement](https://github.com/WebAssembly/design/issues/150) [[1](https://blogs.msdn.microsoft.com/mikeholman/2015/06/17/working-on-the-future-of-compile-to-web-applications/)][[2](https://blog.mozilla.org/luke/2015/06/17/webassembly/)]
- March 2016 - Definition of core feature with multiple interoperable implementations [[1](https://blogs.windows.com/msedgedev/2016/03/15/previewing-webassembly-experiments)] [[2](https://v8project.blogspot.com/2016/03/experimental-support-for-webassembly.html)] [[3](https://hacks.mozilla.org/2016/03/a-webassembly-milestone/)]
- October 2016 - Browser Preview announced with multiple interoperable implementations [[1](https://blogs.windows.com/msedgedev/2016/10/31/webassembly-browser-preview/)] [[2](https://v8project.blogspot.com/2016/10/webassembly-browser-preview.html)] [[3](https://hacks.mozilla.org/2016/10/webassembly-browser-preview)]
- February 2017 - Official [logo](https://github.com/WebAssembly/design/issues/980) chosen
- March 2017 - [Cross-browser consensus](https://lists.w3.org/Archives/Public/public-webassembly/2017Feb/0002.html) and end of Browser Preview 
