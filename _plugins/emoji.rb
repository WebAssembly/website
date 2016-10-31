require 'jekyll'
require 'gemoji'
require 'html/pipeline'

module HTML
  class Pipeline
    class EmojiUnicodeFilter < Filter
      DEFAULT_IGNORED_ANCESTOR_TAGS = %w(pre code tt).freeze

      def call
        doc.search('.//text()').each do |node|
          content = node.to_html
          next if has_ancestor?(node, ignored_ancestor_tags)
          html = emoji_image_filter(content)
          next if html == content
          node.replace(html)
        end
        doc
      end

      # Implementation of validate hook.
      # Errors should raise exceptions or use an existing validator.
      def validate
        needs :asset_root
      end

      # Replace :emoji: with corresponding images.
      #
      # text - String text to replace :emoji: in.
      #
      # Returns a String with :emoji: replaced with images.
      def emoji_image_filter(text)
        text.gsub(emoji_pattern) do |match|
          emoji_image_tag($1)
        end
      end

      # The base url to link emoji sprites
      #
      # Raises ArgumentError if context option has not been provided.
      # Returns the context's asset_root.
      def asset_root
        context[:asset_root]
      end

      # The url path to link emoji sprites
      #
      # :file_name can be used in the asset_path as a placeholder for the sprite file name. If no asset_path is set in the context "emoji/:file_name" is used.
      # Returns the context's asset_path or the default path if no context asset_path is given.
      def asset_path(name)
        if context[:asset_path]
          context[:asset_path].gsub(":file_name", emoji_filename(name))
        else
          File.join("emoji", emoji_filename(name))
        end
      end

      private

      # Build an emoji image tag
      def emoji_image_tag(raw)
        require "active_support/core_ext/hash/indifferent_access"
        emoji = Emoji.find_by_unicode(raw)
        name = emoji.name
        html_attrs =
          default_img_attrs(name).
            merge!((context[:img_attrs] || {}).with_indifferent_access).
            map { |attr, value| !value.nil? && %(#{attr}="#{value.respond_to?(:call) && value.call(name) || value}") }.
            reject(&:blank?).join(" ".freeze)

        "<img #{html_attrs}>"
      end

      # Default attributes for img tag
      def default_img_attrs(name)
        {
          "class" => "emoji".freeze,
          "title" => ":#{name}:",
          "alt" => ":#{name}:",
          "src" => "#{emoji_url(name)}",
          "height" => "20".freeze,
          "width" => "20".freeze,
          "align" => "absmiddle".freeze,
        }
      end

      def emoji_url(name)
        File.join(asset_root, asset_path(name))
      end

      # Build a regexp that matches all valid :emoji: names.
      def self.emoji_pattern
        @emoji_pattern ||= /(#{emoji_raw.map { |name| Regexp.escape(name) }.join('|')})/
      end

      def emoji_pattern
        self.class.emoji_pattern
      end

      def self.emoji_raw
        Emoji.all.map(&:raw).flatten.compact
      end

      def emoji_filename(name)
        Emoji.find_by_alias(name).image_filename
      end

      # Return ancestor tags to stop the emojification.
      #
      # @return [Array<String>] Ancestor tags.
      def ignored_ancestor_tags
        if context[:ignored_ancestor_tags]
          DEFAULT_IGNORED_ANCESTOR_TAGS | context[:ignored_ancestor_tags]
        else
          DEFAULT_IGNORED_ANCESTOR_TAGS
        end
      end

    end
  end
end

module Jekyll
  class Emoji
    GITHUB_DOT_COM_ASSET_HOST_URL = "https://assets-cdn.github.com".freeze
    ASSET_PATH = "/images/icons/".freeze
    BODY_START_TAG = "<body".freeze

    class << self
      def emojify(doc)
        return unless (doc.output =~ HTML::Pipeline::EmojiFilter.emoji_pattern || doc.output =~ HTML::Pipeline::EmojiUnicodeFilter.emoji_pattern)
        src = emoji_src(doc.site.config)
        if doc.output.include? BODY_START_TAG
          parsed_doc    = Nokogiri::HTML::Document.parse(doc.output)
          body          = parsed_doc.at_css('body')
          body.children = filter_with_emoji(src).call(body.inner_html)[:output].to_s
          doc.output    = parsed_doc.to_html
        else
          doc.output = filter_with_emoji(src).call(doc.output)[:output].to_s
        end
      end

      # Public: Create or fetch the filter for the given {{src}} asset root.
      #
      # src - the asset root URL (e.g. https://assets-cdn.github.com/images/icons/)
      #
      # Returns an HTML::Pipeline instance for the given asset root.
      def filter_with_emoji(src)
        filters[src] ||= HTML::Pipeline.new([
          HTML::Pipeline::EmojiFilter,
          HTML::Pipeline::EmojiUnicodeFilter
        ], { :asset_root => src })
      end

      # Public: Filters hash where the key is the asset root source.
      # Effectively a cache.
      def filters
        @filters ||= {}
      end

      # Public: Calculate the asset root source for the given config.
      # The custom emoji asset root can be defined in the config as
      # emoji.src, and must be a valid URL (i.e. it must include a
      # protocol and valid domain)
      #
      # config - the hash-like configuration of the document's site
      #
      # Returns a full URL to use as the asset root URL. Defaults to the root
      # URL for assets provided by an ASSET_HOST_URL environment variable,
      # otherwise the root URL for emoji assets at assets-cdn.github.com.
      def emoji_src(config = {})
        if config.key?("emoji") && config["emoji"].key?("src")
          config["emoji"]["src"]
        else
          default_asset_root
        end
      end

      # Public: Defines the conditions for a document to be emojiable.
      #
      # doc - the Jekyll::Document or Jekyll::Page
      #
      # Returns true if the doc is written & is HTML.
      def emojiable?(doc)
        (doc.is_a?(Jekyll::Page) || doc.write?) &&
          doc.output_ext == ".html" || (doc.permalink && doc.permalink.end_with?("/"))
      end

      private

      def default_asset_root
        if !ENV["ASSET_HOST_URL"].to_s.empty?
          # Ensure that any trailing "/" is trimmed
          asset_host_url = ENV["ASSET_HOST_URL"].chomp("/")
          "#{asset_host_url}#{ASSET_PATH}"
        else
          "#{GITHUB_DOT_COM_ASSET_HOST_URL}#{ASSET_PATH}"
        end
      end
    end
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  Jekyll::Emoji.emojify(doc) if Jekyll::Emoji.emojiable?(doc)
end