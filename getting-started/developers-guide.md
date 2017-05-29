---
layout: getting-started
---

# 开发者引导

这个教程将一步一步指导你将一个简单的程序编译成 WebAssembly。

### 前置条件

想要编译成WebAssembly，你首先需要先编译 LLVM。这是运行后续工具的先决条件。

- Git。Linux 和 OS X 系统中好像已经默认装好了，在 Windows 上需要在这里[安装 Git](https://git-scm.com/)。
- CMake。在 Linux 和 OS X系统中，你可以使用包管理工具 `apt-get` 或 `brew` 来安装。如果是 Windows 系统，你可以[点击这里](https://cmake.org/download/)。
- 系统编译工具。Linux上，[安装 GCC](http://askubuntu.com/questions/154402/install-gcc-on-ubuntu-12-04-lts)。OS X 上，[安装 Xcode](https://itunes.apple.com/us/app/xcode/id497799835)。Windows 上[安装 Visual Studio 2015 Community with Update 3](https://www.visualstudio.com/downloads/) 或更新版本。
- Python 2.7.x，在 Linux 和 OS X上，很可能已经装好了。看[这里](https://wiki.python.org/moin/BeginnersGuide/Download)。

安装完毕后，确认 `git`，`cmake` 和 `python` 已经在你的环境变量里，可以使用。

### 编译 Emascripten

通过 Emscripten SDK 构建 Emscripten 是自动的，下面是步骤。

    $ git clone https://github.com/juj/emsdk.git
    $ cd emsdk
    $ ./emsdk install sdk-incoming-64bit binaryen-master-64bit
    $ ./emsdk activate sdk-incoming-64bit binaryen-master-64bit

这些步骤完成以后，安装完成。将 Emscripten 的环境变量配置到当前的命令行窗口下。

    $ source ./emsdk_env.sh

这条命令将相关的环境变量和目录入口将会配置在当前的命令行窗口中。

在 Windows中，`./emsdk` 使用 `emsdk` 代替，`source ./emsdk_env.sh` 使用 `emsdk_env` 代替。

### 编译并运行一个简单的程序

现在，我们已经有了一个完整的工具链，将简单的程序编译成 WebAssembly。不过，这里有一些值得提醒的地方：

- 在使用 `emcc` 命令时，要带着 `-s WASM=1` 参数（不然，默认将会编译成asm.js）。
- 如果我们想让 Emscripten 生成一个我们所写程序的HTML页面，并带有 wasm 和 JavaScript 文件，我们需要给输出的文件名加 `.html` 后缀名。
- 最后，当我们运行程序的时候，我们不能直接在浏览器中打开 HTML 文件，因为跨域请求是不支持 `file` 协议的。我们需要将我们的输出文件运行在HTTP协议上。

下面这些命令可能让你创建一个简单的“hello word”程序，并且编译它。

<pre>
$ mkdir hello
$ cd hello
$ echo '#include &lt;stdio.h&gt;' &gt; hello.c
$ echo 'int main(int argc, char ** argv) {' &gt;&gt; hello.c
$ echo 'printf("Hello, world!\n");' &gt;&gt; hello.c
$ echo '}' &gt;&gt; hello.c
$ <b>emcc hello.c -s WASM=1 -o hello.html</b>
</pre>

我们可以使用 `emrun` 命令来创建一个 http 协议的 web server 来展示我们编译后的文件。

    $ emrun --no_browser --port 8080 .

HTTP 服务开启后，您可以<a href="http://localhost:8080/hello.html" target="_blank">在浏览器中打开</a>。如果你看到了“Hello，word！”输出到了 Emscripten 的 控制面板，恭喜你！你的 WebAssembly 程序编译成功了！


