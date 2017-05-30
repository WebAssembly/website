---
layout: getting-started
---

# 理解 JS API

_我们假定现在您已经有了一个 .wasm 模块了，不管是[是通过 C/C++ 程序编译](/getting-started/developers-guide/) 还是 [通过 S 表达式编写](/getting-started/advanced-tools/#wabt-the-webassembly-binary-toolkit)。_

## 加载/运行

在[未来计划](/docs/future-features/)中，WebAssembly 模块可以使用 ES6 模块(使用`<script type="module">`)加载，WebAssembly 目前只能通过 JavaScript 来加载和编译。基础的加载，只需要3步：

- 获取 `.wasm` 二进制文件，将它转换成类型数组或者 `ArrayBuffer`
- 将二级制数据编译成一个 `WebAssembly.Module`
- 使用 imports 实例化这个 `WebAssembly.Module`，获取 exports。

让我们来讨论一下这几个步骤的更多详情：

第一步，我们有很多方式获取二进制文件的类型数组或 `ArrayBuffer`：通过网络，使用 XHR 或者 fetch，从 `文件`获取，从 IndexedDB获取，或者直接在 JavaScript 合成。

接下来的步骤是编译这个二进制文件，通过一个异步方法 `WebAssembly.conpile`，将会返回一个 Promise，resolve 一个 `WebAssembly.module`。`Module`对象是无状态的，它支持[克隆实例](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)，也就是说，编译的代码可以被存储在 IndexedDB 或者在多个窗口和worker之间通过 `postMessage` 传输。

最后一步是 *实例化* 这个 `Module`，通过实例化一个新的 `WebAssembly.Instance`，传输 imports 和 `Module` 当做参数。`Instance` 对象像[函数闭包](https://en.wikipedia.org/wiki/Closure_(computer_programming))一样，代码与环境结合，不能克隆。

我们可以合并最后两步，在一个 `instantiate` 操作里面，它需要二进制代码和 imports，并且异步返回一个`Instance`：


```js
function instantiate(bytes, imports) {
  return WebAssembly.compile(bytes).then(m => new WebAssembly.Instance(m, imports));
}
```

为了实际证明这一点，我们首先需要介绍另外一个JS API：

## 方法的 imports 和 exports

像 ES6 模块一样， WebAssembly 模块可以通过 import 和 export 来导出和引入函数（我们一会可以看到，其它类型的对象也可以）。我们可以看一个简单的例子，包括 exports 和 imports，引入了 `i` 函数，输出了 `e` 函数。

```lisp
;; simple.wasm
(module
  (func $i (import "imports" "i") (param i32))
  (func (export "e")
    i32.const 42
    call $i))
```

（这里，我们不通过 C/C++ 来编译成 WebAssembly，我们直接使用[文本格式](/docs/text-format/)，它可以直接被[转换](/getting-started/advanced-tools/#wabt-the-webassembly-binary-toolkit)成二进制文件，`simple.masm`）

从这个模块中我们可以发现。第一，WebAssembly 引入了一个有两个层级的命名空间；在这个例子中，通过我们创建的对象中的 `importObject.imports.i`，引入了一个 `$i` 方法。同样的，我们必须提供一个两级的命名空间作为 import 对象传递给 `instantiate`。


```js
var importObject = { imports: { i: arg => console.log(arg) } };
```


将之前讲的内容整合起来，我们可以获取，编译并且实例化一个模块通过简单的 promise 链：

```js
fetch('simple.wasm').then(response => response.arrayBuffer())
.then(bytes => instantiate(bytes, importObject))
.then(instance => instance.exports.e());
```

上面 JS 代码的最后一行调用了我们 WebAssembly export 的函数，这个函数最后调用了我们通过 `importObject` 传递给 WebAssembly 的 `$i` 函数，所以，其实是调用了我们所写 `imports.i` 这个方法，执行了 `console.log(42)`。

## Memory

[Linear memory](/docs/semantics/#linear-memory) 是 WebAssembly 的另外一种构建块，通常用于表示编译的 C/C++ 应用程序的整个堆。从 JavaScript 的角度，linear memory（后面称作 memory）可以被认为是一个可以调整大小的 `ArrayBuffer`，它是通过尽心优化的，用于负载和存储的低开销沙箱。


Memories 可以被 JavaScript 创建，需要提供出初始大小和最大的大小这些选项。


```js
var memory = new WebAssembly.Memory({initial:10, maximum:100});
```


首先要注意的是，“initial” 和 “maximum” 的单位是 *WebAssembly pages*，它固定为64KiB。这样，上面的 `memory` 默认就是 10 pages，640Kib，最大的尺寸是6.4MiB。

在 JavaScript 中大多数的字节操作都是在 `ArrayBuffer` 和 类型数组里面，而不是建立了一套新的不兼容的操作方式，`WebAssembly.Memory` 通过简单的提供一个返回 `ArrayBuffer` 的 `buffer` getter 来返回字节码。比如，将 42 写入 linear memory 的第一个位置。


```js
new Uint32Array(memory.buffer)[0] = 42;
```

一旦被创建，可以通过 `Momory.Prototype.grow` 进行扩充，还是以 WebAssembly pages 为单位当做参数。

```js
memory.grow(1);
```


如果 `maximum` 供不应求了，通过 grow 增加的尺寸大于 `maximum`，就会抛出 `RangeError` 异常。引擎利用这个提供的上限来提前预留内存，这样可以使调整大小更有效率。

当 `ArrayBuffer` 的 `byteLength` 变化的时候，`Memory.grow` 操作成功后，`bugger` getter 将会返回一个 *新的* `ArrayBuffer` 对象(新的`byteLength`)，之前的 `ArrayBuffer` 对象变成“detached”（长度0，将被丢弃）。


就像函数一样，linear memories 可以被定义在模块内或被引入。同样，一个模块还可以选择性的导出它的 memory。也就是说，JavaScript 创建`新的 WebAssembly.Memory`，并且将它通过 import 对象传递给WebAssembly模块，*或者* JavaScript 接收一个 WebAssembly 模块的 `Memory` export，实现 memory 的传递。


比如，让我们写一个将数组相加的 WebAssembly 模块（函数体用“...”代替）



```lisp
(module
  (memory (export "mem") 1)
  (func (export "accumulate") (param $ptr i32) (param $length i32) …))
```


当这个模块 *exports* 这个memory，我们将这个模块的 `Instance` 命名为 `instance`，我们可以通过导出的 `mem` getter 直接传递 array 到实例的 linear memory 中，就像这样：

```js
var i32 = new Uint32Array(instance.exports.mem);
for (var i = 0; i < 10; i++)
  i32[i] = i;
var sum = instance.exports.accumulate(0, 10);
```

Memory 的 *导出* 和方法的的导出是一样的，只不多 `Memory` 对象是用值来代替了JS函数。Memory 的导出是非常有用的：

- 它允许 JavaScript 在模块编译之前或模块编译时去获取并创建初始内存内容。
- 它允许一个简单的 `Memory` 对象被多个实例引入，这是在 WebAssembly 中实现[动态链接](/docs/dynamic-linking)的关键。
