# Website

Project overview for WebAssembly: [webassembly.org](http://webassembly.org)

## Dependencies

- Ruby >= 2.0.0
- [Bundler](http://bundler.io/)

## Building the site

Clone the project and the `design` submodule:

```
$ git clone https://github.com/WebAssembly/website
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

> You must run `bundle exec jekyll build` after every change and include the `docs` directory in your commit!

## Publishing

This site uses Jekyll plugins, so GitHub Pages will not build it automatically. To publish, check in manually built static site files to the `docs` directory.

The static site should be configured to build to the `docs` directory. The `docs` directory is a special directory from which GitHub pages can publish directly. The naming convention is unfortunate given the confusing overlap with the site's own `docs` pages (output to `docs/docs`) which are themselves generated from the design docs submodule located at `design`.

## What is the role of `_config.yml` and the custom Jekyll plugins?

> Note: the following plugins are all hacks to make the workflow of generating website docs from the `design` repo work without updating the sources in the design repo.

- `gem 'jekyll-optional-front-matter'` loaded directly in the `Gemfile` allows markdown files without YAML frontmatter to be consumed directly. This is included to allow `design` repo `.md` files to be used as pages without modifying their source to add frontmatter.
- The `defaults` section of `_config.yml` adds default values to the YAML frontmatter of documents from the `design` repo. In particular, it specifies that all `.md` files in the design submodule should be labelled as type `doc` and given layout `doc.html`. It also manually moves a few docs into the `community` tree where they fit the site organization better.
- `auto_titles.rb` adds a `title` value to YAML frontmatter by looking for the first header tag in the source files. It also orders the design docs based on a hardcoded list.
- `emoji.rb` replaces `.md` emoji signifiers of the form `:unicorn:` and emoji unicode characters with image elements which are more accessible.
- `fix_header_ids.rb` monkey-patches the `kramdown` Markdown converter to obey GitHub Flavored Markdown's conventions in generating HTML `id` attributes from the contents of headers.
- `link_converter.rb` turns the `design` repo's links (e.g. `[threads](FutureFeatures.md#threads)`) into their respective locations on this website (e.g. `[threads](/docs/future-features/#threads)`).
- `underscore_paths.rb` rewrites Jekyll page permalinks to convert `/design/FutureFeatures/` to `/docs/future-features/`.
