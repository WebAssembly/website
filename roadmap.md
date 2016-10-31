---
layout: default
---
# Roadmap

## Current Status

The [WebAssembly Community Group](https://w3.org/community/webassembly/) has an initial 
([MVP](https://github.com/WebAssembly/design/blob/master/MVP.md))
binary format release candidate and JavaScript API which are
implemented in several browsers. The CG is now soliciting feedback from the
broader community as part of a *Browser Preview* period. The tentative goal of
the CG is for the Browser Preview to conclude in Q1 2017, though significant
findings during the Browser Preview could potentially extend the duration. When
the Browser Preview concludes, the CG will produce a draft specification of WebAssembly and browser vendors can start to ship conforming implementations on-by-default.

Developers should be aware that between the Browser Preview and public launch of WebAssembly, there will be at least one breaking change which will require developers to update their toolchain and binaries. These changes will be announced ahead of time and are listed
[below](#planned-changes-before-release).

See [Getting Started](/getting-started/developers-guide/) to start experimenting and
[Feedback](/community/feedback/) for how and where to direct feedback.

## Next Steps

In addition to processing feedback during the Browser Preview, the WebAssembly community group and contributors plan to:

* distill the [design](https://github.com/webassembly/design)
  and [spec interpreter](https://github.com/WebAssembly/spec/tree/master/interpreter) repos
  into a single unified specification in the [spec](https://github.com/WebAssembly/spec)
  repo
* propose a new charter for a W3C WebAssembly Working Group
* graduate the [WebAssembly LLVM backend](https://github.com/llvm-mirror/llvm/tree/master/test/CodeGen/WebAssembly) from experimental to stable (and update Emscripten)
* prototype additional WebAssembly integration into browser developer tools
* finalize a WebAssembly [logo](https://github.com/WebAssembly/design/issues/112)
* Start work on [post-MVP features](/docs/future-features/)
* Create a publicly-runnable conformance test suite

## Planned Changes Before Release

- At the end of the Browser Preview period, the
  	[binary version](/docs/binary-encoding/#high-level-structure)
  	will be reset to `0x1` (at which point the version will be frozen and all new features will be added in a backwards-compatible manner, and be detected through feature-testing).

As we receive significant user feedback, other items may be added here, or to the [future features](/docs/future-features/) list.

## Past Milestones

- April 2015 - [WebAssembly Community Group](https://www.w3.org/community/webassembly) started
- June 2015 - The first [public announcement](https://github.com/WebAssembly/design/issues/150) [[1](https://blogs.msdn.microsoft.com/mikeholman/2015/06/17/working-on-the-future-of-compile-to-web-applications/)][[2](https://blog.mozilla.org/luke/2015/06/17/webassembly/)]
- March 2016 - Definition of core feature with multiple interoperable implementations [[1](https://blogs.windows.com/msedgedev/2016/03/15/previewing-webassembly-experiments)] [[2](https://v8project.blogspot.com/2016/03/experimental-support-for-webassembly.html)] [[3](https://hacks.mozilla.org/2016/03/a-webassembly-milestone/)]
- October 2016 - Browser Preview announced with multiple interoperable implementations [[1](https://blogs.windows.com/msedgedev/2016/10/31/webassembly-browser-preview/)] [[2](http://v8project.blogspot.com/2016/10/webassembly-browser-preview.html)] [[3](https://hacks.mozilla.org/2016/10/webassembly-browser-preview)]
