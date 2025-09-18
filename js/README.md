# A <code>&lt;wasm-compat&gt;</code> custom element

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
<!-- Load the script. Be sure to include `type="module"` attribute. -->
<script type="module" src="wasm-compat.js"></script>
<!-- Style the element according to your needs -->
<style>
  wasm-compat {
    font-family: system-ui, sans-serif;
    max-width: 600px;
  }
</style>
<!-- Place the custom element anywhere. -->
<wasm-compat wasm-feature="bigInt"></wasm-feature>
<!-- If you don't need it, you can visually hide the header. -->
<wasm-compat wasm-feature="bigInt" hide-header></wasm-feature>
```

The value of the `wasm-feature` attribute is any of the `$.features` (in [JSONPath](https://www.rfc-editor.org/rfc/rfc9535.html) notation) keys of the community-maintained [`features.json`](https://github.com/WebAssembly/website/blob/main/features.json#L3) file. For instance, in the case of the *JS BigInt to Wasm i64 Integration* feature, the key is `bigInt`.

## Demo

Experience the custom element in action on this [example page](https://webassembly.org/js/wasm-compat-test.html). To see all currently existing features, see the bootom part of this [announcement article](https://webassembly.org/news/2025-09-17-wasm-compat/).

## License

Apache 2.0.
