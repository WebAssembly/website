require 'nokogiri'

module AutoTitles
  class Generator < Jekyll::Generator
    def generate(site)
      site.pages.each { |p| generate_title(p) }
    end

    def generate_title(page)
      page.data["title"] = guess_title(page)
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