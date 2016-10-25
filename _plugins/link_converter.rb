module LocalMdLinksToHtml
  class Generator < Jekyll::Generator
    def generate(site)
      site.pages.each { |p| rewrite_links(p) }
    end
    def rewrite_links(page)
      page.content = page.content.gsub(/\[([^\]]*)\]\(([^:\)]*)\.md(#[^\)\s]*)?(?: "[^"\)]*")?\)/, '[\1](../\2/\3)')
      page.content = page.content.gsub(/\[([^\]]*)\]: ([^:\)]*)\.md(#[^\)]*)?/, '[\1]: ../\2/\3')
      page.content = page.content.gsub(/\[([^\]]*)\]: <([^:\)]*)\.md(#[^\)]*)?>/, '[\1]: <../\2/\3>')
    end
  end
end