---
layout: getting-started
---

# 高级工具

WebAssembly 由很多工具来支持开发者构建处理源文件输出二进制文件。如果你是一个写编译器的人、想尝试低级代码或只想尝试使用原始的 WebAssembly 格式进行试验，这些工具适合你。

这里有两套不同的工具，编译器作者或者 WebAssembly 开发者可以使用这些工具输出二进制文件，比如说 [Emscripten](http://kripken.github.io/emscripten-site/):

* [WABT](https://github.com/WebAssembly/wabt) - WebAssembly 二进制工具包
* [Binaryen](https://github.com/WebAssembly/binaryen) - 编译器和工具链基础包

## WABT: WebAssembly 二进制工具

这个工具可以将二进制的 WebAssembly 代码和人类可以阅读的文本格式代码相互转换。文本格式代码类似于 [S-expression](https://en.wikipedia.org/wiki/S-expression)，这种文本格式的代码可以方便 WebAssembly 的编译器输出并进行分析和调试。

注意，S-expression 格式是 WABT 来支持的，并不是 WebAssembly 本身。它是可以用来表示 WebAssembly 的很多文本格式的语言之一，所以，他被开发成一个便于 WABT 工具编解码的格式。开发者能够非常简单的为其他的文本格式构建解码器/编码器，可以轻松的表达 WebAssembly 的堆栈机器语义。

### wasm2wast 工具

这个工具将 WebAssembly 二进制转换为 S-expressions。他是命令行工具，一个二进制文件作为输入，输出一个包含可以读文本的文件

开发者可以编辑文本文件，然后再将其转换为二进制文件，比如优化算法、追踪问题、插入调试语句等等。

### wast2wasm 工具

这个命令行工具和 **wasm2wast** 是反的。也就是说，它将一个 S-expression WAST 文件转换为二进制的 WebAssembly 文件。


使用 **wasm2wast** 和 **wast2wasm** 可以掌控 WebAssembly 的二进制代码，开发者可以通过工具来操作修改 WebAssembly 的二进制代码。

#### wasm-interp 工具

这个工具是个可以让 WebAssembly 二进制代码在命令行中运行的翻译器。它实现了基于堆栈机的解释器，直接解释 WebAssembly 二进制文件。和浏览器将 WebAssembly 二进制通过JIT转换成目标机器的原生代码不一样的是，他不需要加载时间。

这个解释器对单元测试、检测二进制文件可用性等等很有用。是脱离浏览器的一个环境。

## Binaryen

[Binaryen](https://github.com/WebAssembly/binaryen)是一套全面的工具，用作将WebAssembly作为输出格式定位的编译器的后端。它具有 C API 和一套自己的逻辑程序的中间表示([IR](https://en.wikipedia.org/wiki/Intermediate_representation))，并可以在 IR 上执行一些优化，支持代码合并等。

比如，binaryen 使用了 **[asm2wasm](https://github.com/WebAssembly/binaryen/blob/master/src/asm2wasm.h)** 作为编译器，将 asm.js 转换成 WebAssembly 文件。它还支持 [LLVM](http://llvm.org/) 编译器的基础架构，可以将[Rust](https://www.rust-lang.org/en-US/) 转换成 WebAssembly。


通过 binaryen，可以进行编译、优化，它提供了一个壳，可以解释 WebAssembly代码，汇编和反汇编，可以将 asm.js 和 LLVM .s 文件转换成 WebAssembly 等等。


我们特别希望开发者能够探索由 binaryen 提供的所有功能。

