import markdownIt from "markdown-it";
import { full as markdownItEmoji } from "markdown-it-emoji";

// ── Port of auto_titles.rb ──
// Hardcoded doc ordering (from Jekyll plugin)
const DOC_ORDER = [
  "WebAssembly High-Level Goals",
  "JavaScript API",
  "Binary Encoding",
  "Text Format",
  "Semantics",
  "Modules",
  "FAQ",
  "Design Rationale",
  "Minimum Viable Product",
  "Features to add after the MVP",
  "Portability",
  "Security",
  "Nondeterminism in WebAssembly",
  "Use Cases",
  "Guide for C/C++ developers",
  "Web Embedding",
  "Non-Web Embeddings",
  "Feature Test",
  "Tooling support",
  "GC / DOM / Web API Integration :unicorn:",
  "JIT and Optimization Library",
  "Dynamic linking",
];

function guessTitle(content) {
  const match = content.match(/^#{1,6}\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function assignWeight(title) {
  const idx = DOC_ORDER.indexOf(title);
  return idx >= 0 ? idx : 999;
}

// ── Port of underscore_paths.rb ──
// Convert CamelCase to kebab-case
function toKebab(str) {
  return str
    .replace(/::/g, "/")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

// ── Port of link_converter.rb ──
// Rewrite .md links to relative pretty URLs with kebab-case
function rewriteMdLinks(content) {
  // Inline links: [text](File.md) or [text](File.md#anchor)
  content = content.replace(
    /\[([^\]]*)\]\(([^:)]*?)\.md(#[^)\s]*)?\)/g,
    (_, text, file, anchor) => {
      const slug = toKebab(file);
      return `[${text}](../${slug}/${anchor || ""})`;
    },
  );
  // Reference links: [text]: File.md or [text]: File.md#anchor
  content = content.replace(
    /\[([^\]]*)\]: ([^:)]*?)\.md(#[^\s]*)?/g,
    (_, text, file, anchor) => {
      const slug = toKebab(file);
      return `[${text}]: ../${slug}/${anchor || ""}`;
    },
  );
  // Angle-bracket reference links: [text]: <File.md#anchor>
  content = content.replace(
    /\[([^\]]*)\]: <([^:)]*?)\.md(#[^\s]*)?>?/g,
    (_, text, file, anchor) => {
      const slug = toKebab(file);
      return `[${text}]: <../${slug}/${anchor || ""}>`;
    },
  );
  return content;
}

export default function (eleventyConfig) {
  // Markdown with emoji
  const md = markdownIt({ html: true, linkify: true });
  md.use(markdownItEmoji);
  eleventyConfig.setLibrary("md", md);

  // LiquidJS: use Jekyll-compatible unquoted include paths
  eleventyConfig.setLiquidOptions({ dynamicPartials: false });

  // Layout aliases: map upstream layout names to our _layouts_v2/ files
  eleventyConfig.addLayoutAlias("default", "page.html");
  eleventyConfig.addLayoutAlias("news", "page.html");

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("js/**/*.js");
  eleventyConfig.addPassthroughCopy("js/**/*.mjs");
  eleventyConfig.addPassthroughCopy("js/**/*.html");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("features.js");
  eleventyConfig.addPassthroughCopy("features.json");
  eleventyConfig.addPassthroughCopy("features.schema.json");
  eleventyConfig.addPassthroughCopy("google66d80fe1bc71482a.html");

  // Ignore files (matching Jekyll excludes)
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("LICENSE");
  eleventyConfig.ignores.add("Gemfile");
  eleventyConfig.ignores.add("Gemfile.lock");
  eleventyConfig.ignores.add("design/LICENSE");
  eleventyConfig.ignores.add("design/Contributing.md");
  eleventyConfig.ignores.add("design/README.md");
  eleventyConfig.ignores.add("design/tools/**");
  eleventyConfig.ignores.add("docs/**");
  eleventyConfig.ignores.add("node_modules/**");

  // Ignore upstream Jekyll files (avoid conflicts)
  eleventyConfig.ignores.add("_includes/**");
  eleventyConfig.ignores.add("_layouts/**");
  eleventyConfig.ignores.add("_plugins/**");

  // Ignore upstream-only files not processed by Eleventy
  eleventyConfig.ignores.add("feed.xml");
  eleventyConfig.ignores.add("scripts/**");
  eleventyConfig.ignores.add("js/README.md");
  eleventyConfig.ignores.add("js/wasm-compat-test.html");

  // Computed data: auto-generate title, weight, layout, type, and permalink
  eleventyConfig.addGlobalData("eleventyComputed", {
    title: (data) => {
      if (data.title) return data.title;
      if (data.page?.rawInput) return guessTitle(data.page.rawInput);
      return "";
    },
    weight: (data) => {
      const title =
        data.title || (data.page?.rawInput ? guessTitle(data.page.rawInput) : "");
      return assignWeight(title);
    },
    layout: (data) => {
      const input = data.page?.inputPath || "";
      // Homepage uses our home layout instead of upstream's "default"
      if (input === "./index.md") return "home.html";
      // Features page: use upstream layout (no .prose wrapper)
      if (input === "./features.md") return "upstream.html";
      // Posts use page layout
      if (input.startsWith("./_posts/")) return "page.html";
      if (data.layout) return data.layout;
      // design/CodeOfConduct.md and design/Events.md → community layout
      if (input.endsWith("design/CodeOfConduct.md") || input.endsWith("design/Events.md")) {
        return "community.html";
      }
      // All other design/ files → doc layout
      if (input.startsWith("./design/")) {
        return "doc.html";
      }
      return data.layout;
    },
    type: (data) => {
      if (data.type) return data.type;
      const input = data.page?.inputPath || "";
      if (input.endsWith("design/CodeOfConduct.md") || input.endsWith("design/Events.md")) {
        return "community";
      }
      if (input.startsWith("./design/")) {
        return "doc";
      }
      return data.type;
    },
    permalink: (data) => {
      if (data.permalink) return data.permalink;
      const input = data.page?.inputPath || "";
      // Posts: /news/YYYY/MM/DD/slug/ (Jekyll-style)
      if (input.startsWith("./_posts/")) {
        const m = input.match(/_posts\/(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
        if (m) return `/news/${m[1]}/${m[2]}/${m[3]}/${m[4]}/`;
      }
      // Special permalinks for community pages from design/
      if (input.endsWith("design/CodeOfConduct.md")) return "/community/code-of-conduct/";
      if (input.endsWith("design/Events.md")) return "/community/events/";
      // Convert design/ CamelCase paths to /docs/kebab-case/
      if (input.startsWith("./design/")) {
        const filename = input.replace("./design/", "").replace(".md", "");
        return `/docs/${toKebab(filename)}/`;
      }
      return data.permalink;
    },
  });

  // Transform: rewrite .md links in design/ pages
  eleventyConfig.addTransform("rewriteMdLinks", function (content) {
    if (
      this.page.inputPath?.startsWith("./design/") &&
      this.page.outputPath?.endsWith(".html")
    ) {
      return content;
    }
    return content;
  });

  // Pre-render transform: rewrite markdown links before rendering
  eleventyConfig.on("eleventy.before", () => {});
  eleventyConfig.addPreprocessor("rewriteMdLinks", "md", (data, content) => {
    if (data.page?.inputPath?.startsWith("./design/")) {
      return rewriteMdLinks(content);
    }
    return content;
  });

  // Collection: posts from _posts/ (newest first)
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter((item) => item.inputPath?.startsWith("./_posts/"))
      .sort((a, b) => b.date - a.date);
  });

  // Collection: sorted docs for sidebar
  eleventyConfig.addCollection("docs", (collectionApi) => {
    return collectionApi
      .getAll()
      .filter((item) => item.data.type === "doc")
      .sort((a, b) => (a.data.weight || 999) - (b.data.weight || 999));
  });

  // Liquid filter for sorting pages by weight
  eleventyConfig.addFilter("sortByWeight", (pages) => {
    return [...pages].sort(
      (a, b) => (a.data?.weight || 999) - (b.data?.weight || 999),
    );
  });

  // Liquid filter to filter by type
  eleventyConfig.addFilter("whereType", (pages, type) => {
    return pages.filter((p) => p.data?.type === type);
  });

  return {
    dir: {
      input: ".",
      output: "docs",
      includes: "_includes_v2",
      layouts: "_layouts_v2",
      data: "_data",
    },
    templateFormats: ["md", "html", "liquid", "njk"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
  };
}
