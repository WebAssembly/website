module LocalMdLinksToHtml
  class Generator < Jekyll::Generator
    def generate(site)
      site.pages.each { |p| rewrite_links(p) }
    end
    def rewrite_links(page)
      page.content = page.content.gsub(/\[([^\]]*)\]\(([^:\)]*)\.md(#[^\)\s]*)?(?: "[^"\)]*")?\)/) do
        slug = underscore($2)
        "[#{$1}](../#{slug}/#{$3})"
      end
      page.content = page.content.gsub(/\[([^\]]*)\]: ([^:\)]*)\.md(#[^\)]*)?/) do
        slug = underscore($2)
        "[#{$1}]: ../#{slug}/#{$3}"
      end
      page.content = page.content.gsub(/\[([^\]]*)\]: <([^:\)]*)\.md(#[^\)]*)?>/) do
        slug = underscore($2)
        "[#{$1}]: <../#{slug}/#{$3}>"
      end
    end

    def underscore(str)
      str.gsub(/::/, '/').
      gsub(/([A-Z]+)([A-Z][a-z])/,'\1-\2').
      gsub(/([a-z\d])([A-Z])/,'\1-\2').
      downcase
    end
  end
end