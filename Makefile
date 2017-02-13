PHONY=all,pages,tests,serve,help

all: pages tests ## Builds the web pages and converts test cases to JS.

pages: ## Builds the web pages with Jekyll.
	bundle exec jekyll build

tests: ## Builds the wast interpreter and converts test cases to JS.
	mkdir -p ./docs/tests
	./spec/test/build.py --front ./docs/tests

serve: all ## Serves the pages and tests in http://localhost:4000
	bundle exec jekyll serve --skip-initial-build

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
