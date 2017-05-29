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
        "WebAssembly 高级目标",
        "JavaScript API",
        "二进制编码",
        "文本格式",
        "语义",
        "模块",
        "FAQ",
        "设计原理",
        "最小可行产品（MVP）",
        "MVP后将要添加的特性",
        "可移植性",
        "安全",
        "WebAssembly中的不确定性",
        "用例",
        "C/C++ 开发者引导",
        "Web 模式",
        "Non-Web 模式",
        "特性测试",
        "工具支持",
        "GC / DOM / Web API 整合 :unicorn:",
        "JIT 和 优化库",
        "动态链接"
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