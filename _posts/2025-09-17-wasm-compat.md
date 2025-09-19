---
title: 'A &lt;wasm-compat&gt; custom element'
author: 'Thomas Steiner'
---

# A <code>&lt;wasm-compat&gt;</code> custom element

_Published on September 17, 2025 by [Thomas Steiner](https://github.com/tomayac)._

The [Feature Status](https://webassembly.org/features/) table on the WebAssembly website shows the various engines' support statuses in one handy global overview, including the support status in your own browser. That's fantastic and what most people will usually resort to when they need compatibility information about Wasm features.

For the occasional case where you want to show a feature's support status for the various Wasm engines in isolation, for example, in the context of an article, this is the custom element `<wasm-compat>` that you can use.

## Installation

You can install the custom element from npm, use a CDN like [unpkg.com](https://unpkg.com/wasm-compat), or simply host the [code](https://raw.githubusercontent.com/WebAssembly/website/refs/heads/main/js/wasm-compat.js) yourself.

```bash
npm install wasm-compat
```

## Usage

 The following code snippet shows you how to use it to display the support status for the *JS BigInt to Wasm i64 Integration* feature.

```html
<!-- Load the script. Be sure to include the `type="module"` attribute. -->
<script type="module" src="wasm-compat.js"></script>
<!-- Style the element according to your needs -->
<style>
  wasm-compat {
    font-family: system-ui, sans-serif;
    max-width: 600px;
  }
</style>
<!-- Place the custom element anywhere. -->
<wasm-compat wasm-feature="bigInt"></wasm-compat>
```

The value of the `wasm-feature` attribute is any of the `$.features` (in [JSONPath](https://www.rfc-editor.org/rfc/rfc9535.html) notation) keys of the community-maintained [`features.json`](https://github.com/WebAssembly/website/blob/main/features.json#L3) file. For instance, in the case of the *JS BigInt to Wasm i64 Integration* feature, the key is `bigInt`.

For the fun of it, the following section contains the support statuses for all currently documented features. If you prefer, there's a simple [test page](/js/wasm-compat-test.html) available with just one example.

<div id="wasm-compat-container"></div>

<script type="module">
  const data = await fetch('https://raw.githubusercontent.com/WebAssembly/website/main/features.json').then(response => response.json());
  const html = Object.keys(data.features).map(featureId => {
    return `<wasm-compat wasm-feature="${featureId}"></wasm-compat>`;
  }).join('');
  document.querySelector('#wasm-compat-container').innerHTML = html;
</script>
