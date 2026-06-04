# This generates search index during build
# For GitHub Pages, pre-generate or use JavaScript indexing

module Jekyll
  class SearchIndexGenerator < Generator
    safe true
    priority :lowest
    
    def generate(site)
      index = []
      
      site.pages.each do |page|
        next unless page.data['layout'] == 'docs'
        
        index << {
          'id' => page.url,
          'title' => page.data['title'],
          'content' => strip_markdown(page.content),
          'url' => page.url,
          'excerpt' => page.content[0..200].gsub(/\n/, ' ')
        }
      end
      
      File.write('search-data.json', index.to_json)
    end
    
    def strip_markdown(content)
      content.gsub(/\[([^\]]+)\]\([^)]+\)/, '\1')
             .gsub(/[#*`>_~]/, '')
             .gsub(/\n+/, ' ')
             .strip
    end
  end
end