---
title: 'The States of WebAssembly'
author: 'Thomas Steiner'
---

# The States of WebAssembly

_Published on January 21, 2026 by
[Thomas Steiner](https://github.com/tomayac)._

This week didn't see just one _State of WebAssembly_ posts, but two, so I decided it's time to feature them.

Uno Platform's [Gerard Gallant](https://cggallant.blogspot.com/) wrote [The State of WebAssembly – 2025 and 2026](https://platform.uno/blog/the-state-of-webassembly-2025-2026/) in which he recaps the events of 2025 and previews what 2026 could bring to this rapidly evolving technology. He starts with some Wasm additions and improvements in the Safari browser, and then covers the latest and greatest developments in features like Relaxed SIMD, JavaScript Promise Integration (JSPI), WebAssembly CSP, Wide Arithmetic, Stack Switching, and Source Phase Imports. Next, he looks at Wasm support in Kotlin and .NET, covers the WebAssembly System Interface (WASI), Wasm debugging, and looks at some stats around Wasm's adoption.

The yearly [Web Almanac](https://almanac.httparchive.org/) from the [HTTP Archive](https://httparchive.org/) community, again after [2022](https://almanac.httparchive.org/en/2022/webassembly) and [2021](https://almanac.httparchive.org/en/2021/webassembly), features a [chapter on WebAssembly](https://almanac.httparchive.org/en/2025/webassembly) in which author and analyst [Nimesh Vadgama](https://ops-ml-architect.blogspot.com/) covers Wasm in 2025. The report finds that 0.35% of desktop sites and 0.28% of mobile sites are using WebAssembly. A curious stat is that of the largest Wasm file, which weighs 228 MB, but the report also covers more down to earth statistics like the used features, the source languages people compiled from, and others. The [raw data](https://docs.google.com/spreadsheets/d/16z2MNwq8FFbuNYcJJZceML6rB5VAmBXNNHZy5FZuf8g/edit) and the used [queries](https://github.com/HTTPArchive/almanac.httparchive.org/tree/main/sql/2025/webassembly/) (the HTTP Archive is queryable on BigQuery) are available if you want to dive deeper.

![Cartoon Web Almanac characters performing scientific experiments on various code symbols resulting in ones and zeros coming out of the other end.](https://almanac.httparchive.org/static/images/2021/webassembly/hero_lg.avif)

In other interesting Wasm news, Microsoft's [João Moreno](https://github.com/joaomoreno) blogged about [docfind](https://code.visualstudio.com/blogs/2026/01/15/docfind), a fast client-side search driven by Rust and WebAssembly that is in use on the [VS Code website](https://code.visualstudio.com/).
