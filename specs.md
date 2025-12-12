---
layout: default
---

# Specifications

- [WebAssembly Specification](https://webassembly.github.io/spec/core/)
  (Wasm&nbsp;3.0): defines the semantics of WebAssembly modules independent from
  a concrete embedding. The WebAssembly core is specified in a single document.\
  Older versions:
  - [WebAssembly Core Specification — W3C Candidate Recommendation Draft, 16 June 2025](https://www.w3.org/TR/2025/CRD-wasm-core-2-20250616/)
    (Wasm&nbsp;2.0)
  - [WebAssembly Core Specification — W3C Recommendation, 5 December 2019](https://www.w3.org/TR/2019/REC-wasm-core-1-20191205/)
    (Wasm&nbsp;1.0)
- Embedding interfaces:
  - [JavaScript API](https://webassembly.github.io/spec/js-api/index.html):
    defines JavaScript classes and objects for accessing WebAssembly from within
    JavaScript, including methods for validation, compilation, instantiation,
    and classes for representing and manipulating imports and exports as
    JavaScript objects.
  - [Web API](https://webassembly.github.io/spec/web-api/index.html): defines
    extensions to the JavaScript API made available specifically in web
    browsers, in particular, an interface for streaming compilation and
    instantiation from origin-bound `Response` types.
  - [WASI API](https://github.com/WebAssembly/WASI/blob/main/docs/Proposals.md):
    defines a modular system interface to run WebAssembly outside the web,
    providing access to things like files, network connections, clocks, and
    random numbers.
- [Tool conventions](https://github.com/WebAssembly/tool-conventions):
  repository describing non-standard conventions useful for coordinating
  interoperability between tools working with WebAssembly. This includes
  conventions for linking schemes, debugging information, language ABIs and
  more.
- [Original design documents](https://github.com/WebAssembly/design): documents
  describing the design, goals and high-level overview of WebAssembly. Some of
  these documents are outdated by now.
