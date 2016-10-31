module Jekyll
  class Page
    def url=(name)
      @url = name
    end
  end
end

module UnderscorePaths
  # turn "PostMVP" camel case convention (from design repo)
  # into "post-mvp", consistent with desired URL format
  class Generator < Jekyll::Generator
    def generate(site)
      site.pages.each { |p| underscore_links(p) }
    end
    def underscore_links(page)
      page.url = underscore(page.url).gsub(/^\/design\//, '/docs/')
    end

    def underscore(str)
      str.gsub(/::/, '/').
      gsub(/([A-Z]+)([A-Z][a-z])/,'\1-\2').
      gsub(/([a-z\d])([A-Z])/,'\1-\2').
      downcase
    end

  end
end

