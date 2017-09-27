---
layout: getting-started
---

# Developer's Guide

This page provides step-by-step instructions to compile a simple program directly to WebAssembly.

### Prerequisites
To compile to WebAssembly, we will at the moment need to compile LLVM from source. The following tools are needed as a prerequisite:

- Git. On Linux and OS X this is likely already present. On Windows download the [Git for Windows](https://git-scm.com/) installer.
- CMake. On Linux and OS X, one can use package managers like `apt-get` or `brew`, on Windows download [CMake installer](https://cmake.org/download/).
- Host system compiler. On Linux, [install GCC](http://askubuntu.com/questions/154402/install-gcc-on-ubuntu-12-04-lts). On OS X, [install Xcode](https://itunes.apple.com/us/app/xcode/id497799835). On Windows, install [Visual Studio 2015 Community with Update 3](https://www.visualstudio.com/downloads/) or newer.
- Python 2.7.x. On Linux and OS X, this is most likely provided out of the box. See [here](https://wiki.python.org/moin/BeginnersGuide/Download) for instructions.

After installing, make sure that `git`, `cmake` and `python` are accessible in PATH.

### Get Emscripten
The [Emscripten SDK](https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html) can fetch and set up Emscripten for you. The required steps are as follows.

    $ git clone https://github.com/juj/emsdk.git
    $ cd emsdk
    $ ./emsdk update
    $ ./emsdk install latest
    $ ./emsdk activate latest

(Instead of using git to clone the emsdk repo, you can also download it from the Emscripten website in the link above.)

After these steps, the installation is complete. To enter an Emscripten compiler environment in the current command line prompt, type

    $ source ./emsdk_env.sh

This command adds relevant environment variables and directory entries to PATH to set up the current terminal for easy access to the compiler tools.

On Windows, replace `./emsdk` with just `emsdk`, and `source ./emsdk_env.sh` with `emsdk_env` above.

### Compile and run a simple program
We now have a full toolchain we can use to compile a simple program to WebAssembly. There are a few remaining caveats, however:

- We have to pass the linker flag `-s WASM=1` to `emcc` (otherwise by default `emcc` will emit asm.js).
- If we want Emscripten to generate an HTML page that runs our program, in addition to the wasm binary and JavaScript wrapper, we have to specify an output filename with a `.html` extension.
- Finally, to actually run the program, we cannot simply open the HTML file in a web browser because cross-origin requests are not supported for the `file` protocol scheme. We have to actually serve the output files over HTTP.

The commands below will create a simple "hello world" program and compile it. The compilation step is highlighted in bold.

<pre>
$ mkdir hello
$ cd hello
$ echo '#include &lt;stdio.h&gt;' &gt; hello.c
$ echo 'int main(int argc, char ** argv) {' &gt;&gt; hello.c
$ echo 'printf("Hello, world!\n");' &gt;&gt; hello.c
$ echo '}' &gt;&gt; hello.c
$ <b>emcc hello.c -s WASM=1 -o hello.html</b>
</pre>

To serve the compiled files over HTTP, we can use the `emrun` web server provided with the Emscripten SDK:

    $ emrun --no_browser --port 8080 .

Once the HTTP server is running, you can <a href="http://localhost:8080/hello.html" target="_blank">open it in your browser</a>. If you see "Hello, world!" printed to the Emscripten console, then congratulations! You've successfully compiled to WebAssembly!
