// Mahakal Telecom Mankapur - Search Module
// Provides frontend live search logic

const Search = {
  // Query matching engine
  query(searchTerm) {
    if (!searchTerm || typeof products === 'undefined') return [];
    
    const term = searchTerm.toLowerCase().trim();
    return products.filter(p => {
      return (
        p.model.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.color.toLowerCase().includes(term) ||
        p.storage.toLowerCase().includes(term) ||
        (p.ram && p.ram.toLowerCase().includes(term)) ||
        p.condition.toLowerCase().includes(term)
      );
    });
  },

  // Initialize search inputs
  init() {
    const searchInputs = document.querySelectorAll('.search-input-field');
    const searchOverlays = document.querySelectorAll('.search-overlay');
    const searchButtons = document.querySelectorAll('.search-trigger-btn');
    const closeButtons = document.querySelectorAll('.search-close-btn');

    // Setup input listeners
    searchInputs.forEach(input => {
      input.addEventListener('keyup', (e) => {
        const queryVal = e.target.value;
        
        // Dynamic live filtering if we are on the mobiles.html page
        if (window.location.pathname.includes('mobiles.html') && typeof Filter !== 'undefined') {
          Filter.state.search = queryVal;
          Filter.apply();
        }

        // On pressing Enter, redirect to mobiles if not already there
        if (e.key === 'Enter') {
          if (!window.location.pathname.includes('mobiles.html')) {
            window.location.href = `mobiles.html?q=${encodeURIComponent(queryVal)}`;
          }
        }
      });
    });

    // Toggle search overlay triggers
    searchButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const overlay = document.getElementById('search-overlay-modal');
        if (overlay) {
          overlay.classList.add('active');
          const input = overlay.querySelector('.search-input-field');
          if (input) {
            input.focus();
          }
        }
      });
    });

    // Close buttons
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const overlay = document.getElementById('search-overlay-modal');
        if (overlay) {
          overlay.classList.remove('active');
        }
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Search.init();
});

window.Search = Search;
