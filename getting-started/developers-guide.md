---
layout: getting-started
---

# Developer's Guide

This page provides step-by-step instructions to compile a simple program directly to WebAssembly.

## Windows 10 installation
The easiest way to get set up on Windows 10 is to use one of the Linux subsystem installations available in the Microsoft Store.

To get the installation working:
1. Install the Windows Subsystem for Linux using the instructions here: [https://docs.microsoft.com/en-us/windows/wsl/install-win10](https://docs.microsoft.com/en-us/windows/wsl/install-win10).
   Any flavour of Linux should work, however these instructions assume you install the [Ubuntu](https://www.microsoft.com/en-us/p/ubuntu/9nblggh4msv6?rtc=1) Linux distribution.
2. After you've set up the Linux subsystem, from the Linux command line you need to install python 2.7. Type the following commands:
   - sudo apt update
   - sudo apt upgrade
   - sudo apt install python2.7 python-pip
3. Install the Emscripten SDK by following the instructions below under the heading 'Downloading the Toolchain'

## Windows 7 and earlier installation
Windows versions prior to 10 don't support the Linux susbsytem. To install on earlier versions of Windows do the following:
1. Go to the Emscripten SDK page at [https://github.com/emscripten-core/emsdk](https://github.com/emscripten-core/emsdk)
2. Click the 'Clone or Download' button
3. Choose the 'Download ZIP' option
4. Unpack the downloaded ZIP file somewhere on your file system
5. From a command shell, go into the directory where you unpacked the ZIP file using <b>cd "where-you-unpacked-the-zip"</b>
6. Run these commands from the command line:
   - emsdk update
   - emsdk install latest
   - emsdk activate latest
   - emsdk_env.bat

Note: If you are using Visual Studio 2017, `emsdk install` should be appended with the argument `--vs2017`.

## Mac OS X and Linux installation
If you're on OS X or Linux, SDK installation should be straightfoward by opening a shell terminal and following the instructions below under the next heading 'Downloading the Toolchain'.

## Downloading the Toolchain
A precompiled toolchain to compile C/C++ to WebAssembly is easily obtained via GitHub.

    $ git clone https://github.com/emscripten-core/emsdk.git
    $ cd emsdk
    $ ./emsdk install latest
    $ ./emsdk activate latest

## Compiling the Toolchain for unsupported Linux distributions or just for fun
If you are running a Linux distribution for which Emscripten toolchain is not available precompiled (currently Ubuntu 16.04 works best), or if you want to build the whole toolchain from source, Emscripten SDK can also be used to drive the build. The required steps are as follows.

### Prerequisites
To compile to WebAssembly, some prerequisite tools are needed:

- Git. On Linux and OS X this is likely already present. On Windows download the [Git for Windows](https://git-scm.com/) installer.
- CMake. On Linux and OS X, one can use package managers like `apt-get` or `brew`, on Windows download [CMake installer](https://cmake.org/download/).
- Host system compiler. On Linux, [install GCC](https://askubuntu.com/questions/154402/install-gcc-on-ubuntu-12-04-lts). On OS X, [install Xcode](https://itunes.apple.com/us/app/xcode/id497799835). On Windows, install [Visual Studio 2015 Community with Update 3](https://www.visualstudio.com/downloads/) or newer.
- Python 2.7.x. On Linux and OS X, this is most likely provided out of the box. See [here](https://wiki.python.org/moin/BeginnersGuide/Download) for instructions.

After installing, make sure that `git`, `cmake` and `python` are accessible in PATH. Technically, CMake and a system compiler may not be needed if using a precompiled toolchain, but development options may be a bit limited without them.

    $ git clone https://github.com/emscripten-core/emsdk.git
    $ cd emsdk
    $ ./emsdk install --build=Release sdk-incoming-64bit binaryen-master-64bit
    $ ./emsdk activate --build=Release sdk-incoming-64bit binaryen-master-64bit

## Environment setup after installation (non Windows 7 installs)
After installing or compiling the SDK, the installation is complete. To enter an Emscripten compiler environment in the current command line prompt after downloading a precompiled toolchain or building your own, type

    $ source ./emsdk_env.sh --build=Release

This command adds relevant environment variables and directory entries to PATH to set up the current terminal for easy access to the compiler tools.

## Compile and run a simple program
We now have a full toolchain we can use to compile a simple program to WebAssembly. There are a few remaining caveats, however:

- We have to pass the linker flag `-s WASM=1` to `emcc` (otherwise by default `emcc` will emit asm.js).
- If we want Emscripten to generate an HTML page that runs our program, in addition to the Wasm binary and JavaScript wrapper, we have to specify an output filename with a `.html` extension.
- Finally, to actually run the program, we cannot simply open the HTML file in a web browser because cross-origin requests are not supported for the `file` protocol scheme. We have to actually serve the output files over HTTP.

The commands below will create a simple "hello world" program and compile it. The compilation step is highlighted in bold.

<pre>
$ mkdir hello
$ cd hello
$ cat << EOF > hello.c
#include &lt;stdio.h&gt;
int main(int argc, char ** argv) {
  printf("Hello, world!\n");
}
EOF
$ <b>emcc hello.c -s WASM=1 -o hello.html</b>
</pre>

To serve the compiled files over HTTP, we can use the `emrun` web server provided with the Emscripten SDK:

    $ emrun --no_browser --port 8080 .

Once the HTTP server is running, you can <a href="http://localhost:8080/hello.html" target="_blank">open it in your browser</a>. If you see "Hello, world!" printed to the Emscripten console, then congratulations! You've successfully compiled to WebAssembly!
