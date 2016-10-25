module AutoTitles
  class Generator < Jekyll::Generator
    def generate(site)
      site.pages.each { |p| generate_title(p) }
    end

    def generate_title(page)
      page.data["title"] = guess_title(page)
    end

    def guess_title(page)
      # return first markdown heading, sans #
      page.content.each_line do |line|
        unless (m = line.match(/^\s*#+\s*([^#]+)[\s#]*/)).nil?
          return m.captures.first
        end
      end
      ""
    end
  end
end