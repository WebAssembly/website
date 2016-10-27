---
layout: default
---
## Getting Started

### Intro

### Developers Guide

This page aims to provide complete, working step-by-step instructions to compile a simple program directly to WebAssembly.

The instructions on this page are applicable to Linux and Mac OS X systems. Similar instructions for Windows systems are forthcoming.

### Install the correct version of emscripten
To compile to WebAssembly, we need the incoming branch of emscripten. We can install this through the [emscripten SDK](https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html);
  however, we need to switch the branch the SDK downloads and installs from.

    $ curl https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz \
    -o emsdk-portable.tar.gz
    $ gunzip emsdk-portable.tar.gz
    $ tar -xf emsdk-portable.tar
    $ cd emsdk_portable
    $ ./emsdk update
    $ ./emsdk install clang-incoming-64bit emscripten-incoming-64bit sdk-incoming-64bit
    $ ./emsdk activate clang-incoming-64bit emscripten-incoming-64bit sdk-incoming-64bit
    $ source ./emsdk_env.sh
    $ cd ..

### Compile and run a simple program
We now have a full toolchain we can use to compile a simple program to WebAssembly. There are a few remaining caveats, however:

- We have to pass the flag `-s BINARYEN=1` to `emcc` (otherwise by default `emcc` will emit asm.js).
- If we want emscripten to generate an HTML page that runs our program, in addition to the wasm binary and JavaScript wrapper, we have to specify an output filename with a `.html` extension.
- Finally, to actually run the program, we cannot simply open the HTML file in a web browser because cross-origin requests are not supported for the `file` protocol scheme. We have to actually serve the output files over HTTP.

The commands below will create a simple "hello world" program and compile it. The compilation step is highlighted in bold.

<pre>
$ mkdir hello
$ cd hello
$ echo '#include &lt;stdio.h&gt;' &gt; hello.c
$ echo 'int main(int argc, char ** argv) {' &gt;&gt; hello.c
$ echo 'printf("Hello, world!\n");' &gt;&gt; hello.c
$ echo '}' &gt;&gt; hello.c
$ <b>emcc hello.c -s BINARYEN=1 -o hello.html</b>
</pre>

To serve the compiled files over HTTP, we can use the HTTP server built in to Python:

    $ python -m SimpleHTTPServer 8080 > /dev/null 2>&1 &;

Once the HTTP server is running, you can <a href="http://localhost:8080/hello.html" target="_blank">open it in your browser</a>. If you see "Hello, world!" printed to the emscripten console, then congratulations! You've successfully compiled to WebAssembly!

### Advanced Usage