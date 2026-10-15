
## 📄 Search Implementation

### **`assets/js/search.js`** - Lunr.js Search
```javascript
// Search index generation and searching
let searchIndex = null;

async function initializeSearch() {
  const response = await fetch('/search-data.json');
  const documents = await response.json();
  
  searchIndex = lunr(function() {
    this.ref('id');
    this.field('title', { boost: 10 });
    this.field('content', { boost: 5 });
    this.field('url');
    
    documents.forEach(function(doc) {
      this.add(doc);
    }, this);
  });
  
  window.searchDocuments = documents;
  window.searchIndex = searchIndex;
}

function searchDocs(query) {
  if (!searchIndex) return [];
  
  const results = searchIndex.search(query);
  return results.map(result => {
    return window.searchDocuments.find(doc => doc.id === result.ref);
  });
}

// Search UI
document.addEventListener('DOMContentLoaded', function() {
  initializeSearch();
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function(e) {
      const query = e.target.value;
      if (query.length >= 2) {
        const results = searchDocs(query);
        displaySearchResults(results);
      }
    }, 300));
  }
});

function displaySearchResults(results) {
  const resultsContainer = document.getElementById('search-results');
  if (!resultsContainer) return;
  
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found.</p>';
    return;
  }
  
  resultsContainer.innerHTML = results.map(result => `
    <div class="search-result">
      <a href="${result.url}">
        <h3>${highlightTerms(result.title)}</h3>
        <p>${highlightTerms(result.excerpt || result.content.substring(0, 150))}</p>
      </a>
    </div>
  `).join('');
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}