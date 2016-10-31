require 'kramdown'

module Kramdown
  module Converter
    class Base
      # monkey-patch anchor ID generation, see 
      # https://github.com/gettalong/kramdown/issues/267
      def basic_generate_id(str)
        gen_id = str.downcase
        gen_id.gsub!(/[^\p{Word}\- ]/u, '')
        gen_id.gsub!(' ', '-')
        gen_id
      end

    end
  end
end