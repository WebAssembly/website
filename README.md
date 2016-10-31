# Website

Project overview for WebAssembly: [webassembly.org](http://webassembly.org)

## Dependencies

- Ruby >= 2.0.0

## Building the site

Clone the project and the `design` submodule:

```
$ git clone https://github.com/WebAssembly/webassembly.github.io
$ git submodule update --init --recursive
```

Install gem dependencies:

```
$ bundle install
```

Build with Jekyll or serve local preview:

```
$ bundle exec jekyll build
$ bundle exec jekyll serve
```

## Publishing

This site uses Jekyll plugins, so GitHub Pages will not build it automatically. To publish, check in manually build static site files and configure GitHub Pages to serve from the output directory. 