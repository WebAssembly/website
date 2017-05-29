require 'nokogiri'

module AutoTitles
  class Generator < Jekyll::Generator
    def generate(site)
      site.pages.each { |p| generate_title(p) }
    end

    def generate_title(page)
      page.data["title"] = guess_title(page)
      page.data["weight"] = assign_weight(page.data["title"])
    end

    # TODO:s3ththompson avoid hard-coding titles
    def assign_weight(title)
      order = [
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
        "Dynamic linking"
      ]
      if order.include?(title)
        order.index(title)
      else
        999
      end

    end

    def guess_title(page)
      # return first heading
      html = Kramdown::Document.new(page.content).to_html
      doc = Nokogiri::HTML(html)
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].each do |query|
        unless (h = doc.at_css(query)).nil?
          return h.inner_text
        end
      end
      ""
    end
  end
end