---
layout: getting-started
---

# Understanding the JS API

_We assume here that you already have a .wasm module, whether
[compiled from a C/C++ program](/getting-started/developers-guide/) or
[assembled directly from s-exprs](/getting-started/advanced-tools/#wabt-the-webassembly-binary-toolkit)._

## Loading and running

While there are [future plans](/docs/future-features/) to allow WebAssembly
modules to be loaded just like ES6 modules (using `<script type='module'>`),
WebAssembly must currently be loaded and compiled by JavaScript. For basic
loading, there are three steps:

- Get the `.wasm` bytes into a typed array or `ArrayBuffer`
- Compile the bytes into a `WebAssembly.Module`
- Instantiate the `WebAssembly.Module` with imports to get the callable exports

Let’s talk about these steps in more detail.

For the first step there are many ways to get a typed array or `ArrayBuffer` of
bytes: over the network, using XHR or fetch, from a `File` retrieved from
IndexedDB, or even synthesized directly in JavaScript.

The next step is to compile the bytes using the async function
`WebAssembly.compile` which returns a Promise that resolves to a
`WebAssembly.Module`. A `Module` object is stateless and supports
[structured cloning](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
which means that the compiled code can be stored in IndexedDB and/or shared
between windows and workers via `postMessage`.

The last step is to _instantiate_ the `Module` by constructing a new
`WebAssembly.Instance` passing in a `Module` and any imports requested by the
`Module`. `Instance` objects are like
[function closures](<https://en.wikipedia.org/wiki/Closure_(computer_programming)>),
pairing code with environment and are not structured cloneable.

We can combine these last two steps into one `instantiate` operation that takes
both bytes and imports and asynchronously returns an `Instance`:

```js
function instantiate(bytes, imports) {
  return WebAssembly.compile(bytes).then(
    (m) => new WebAssembly.Instance(m, imports)
  );
}
```

To actually demonstrate this in action, we first need to introduce another piece
of the JS API:

## Function imports and exports

Like ES6 modules, WebAssembly modules can import and export functions (and,
we’ll see later, other types of objects too). We can see a simple example of
both in this module which imports a function `i` from module `imports` and
exports a function `e`:

```lisp
;; simple.wasm
(module
  (func $i (import "imports" "i") (param i32))
  (func (export "e")
    i32.const 42
    call $i))
```

(Here, instead of writing the module in C/C++ and compiling to WebAssembly, we
write the module directly in the
[text format](https://webassembly.github.io/spec/core/text/index.html) which can
be
[assembled](/getting-started/advanced-tools/#wabt-the-webassembly-binary-toolkit)
directly into the binary file `simple.wasm`.)

Looking at this module we can see a few things. First, WebAssembly imports have
a two-level namespace; in this case the import with the internal name `$i` is
imported from `imports.i`. Similarly, we must reflect this two-level namespace
in the import object passed to `instantiate`:

```js
var importObject = { imports: { i: (arg) => console.log(arg) } };
```

Putting together everything in this section and the last, we can fetch, compile
and instantiate our module with the simple promise chain:

```js
fetch('simple.wasm')
  .then((response) => response.arrayBuffer())
  .then((bytes) => instantiate(bytes, importObject))
  .then((instance) => instance.exports.e());
```

The last line calls our exported WebAssembly function which, in turn, calls our
imported JS function which ultimately executes `console.log(42)`.

## Memory

[Linear memory](https://webassembly.github.io/spec/core/exec/index.html#linear-memory)
is another important WebAssembly building block that is typically used to
represent the entire heap of a compiled C/C++ application. From a JavaScript
perspective, linear memory (henceforth, just “memory”) can be thought of as a
resizable `ArrayBuffer` that is carefully optimized for low-overhead sandboxing
of loads and stores.

Memories can be created from JavaScript by supplying their initial size and,
optionally, their maximum size:

```js
var memory = new WebAssembly.Memory({ initial: 10, maximum: 100 });
```

The first important thing to notice is that the unit of `initial` and `maximum`
is _WebAssembly pages_ which are fixed to be 64KiB. Thus, `memory` above has an
initial size of 10 pages, or 640KiB and a maximum size of 6.4MiB.

Since most byte-range operations in JavaScript already operate on `ArrayBuffer`
and typed arrays, rather than defining a whole new set of incompatible
operations, `WebAssembly.Memory` exposes its bytes by simply providing a
`buffer` getter that returns an `ArrayBuffer`. For example, to write `42`
directly into the first word of linear memory:

```js
new Uint32Array(memory.buffer)[0] = 42;
```

Once created, a memory can be grown by calls to `Memory.prototype.grow`, where
again the argument is specified in units of WebAssembly pages:

```js
memory.grow(1);
```

If a `maximum` is supplied upon creation, attempts to grow past this `maximum`
will throw a `RangeError` exception. The engines takes advantage of this
supplied upper-bounds to reserve memory ahead of time which can make resizing
more efficient.

Since an `ArrayBuffer`’s `byteLength` is immutable, after a successful
`Memory.grow` operation, the`buffer` getter will return a _new_ `ArrayBuffer`
object (with the new `byteLength`) and any previous `ArrayBuffer` objects become
“detached” (zero length, many operations throw).

Just like functions, linear memories can be defined inside a module or imported.
Similarly, a module may also optionally export its memory. This means that
JavaScript can get access to the memory of a WebAssembly instance either by
creating a `new WebAssembly.Memory` and passing it in as an import _or_ by
receiving a `Memory` export.

For example, let’s take a WebAssembly module that sums an array of integers
(replacing the body of the function with “...”):

```lisp
(module
  (memory (export "mem") 1)
  (func (export "accumulate") (param $ptr i32) (param $length i32) ...))
```

Since this module _exports_ its memory, given an `Instance` of this module
called `instance`, we can use its exports' `mem` getter to create and populate
an input array directly in the instance’s linear memory, as follows:

```js
var i32 = new Uint32Array(instance.exports.mem);
for (var i = 0; i < 10; i++) i32[i] = i;
var sum = instance.exports.accumulate(0, 10);
```

Memory _imports_ work just like function imports, only `Memory` objects are
passed as values instead of JS functions. Memory imports are useful for two
reasons:

- They allow JavaScript to fetch and create the initial contents of memory
  before or concurrent with module compilation.
- They allow a single `Memory` object to be imported by multiple instances,
  which is a critical building block for implementing
  [dynamic linking](https://github.com/WebAssembly/tool-conventions/blob/main/DynamicLinking.md)
  in WebAssembly.
