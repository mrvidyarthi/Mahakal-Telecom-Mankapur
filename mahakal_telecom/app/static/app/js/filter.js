// Mahakal Telecom Mankapur - Filter & Render Module
// Processes page filters, sorts, and renders custom smartphone cards

const Filter = {
  // Current active filter state
  state: {
    brands: [],
    conditions: [],
    storage: [],
    ram: [],
    minPrice: 0,
    maxPrice: 80000,
    availability: 'all', // 'all', 'available', 'sold'
    search: '',
    sortBy: 'newest' // 'newest', 'price-low', 'price-high', 'deals'
  },

  // Initialize filters
  init() {
    // Parse URL params
    this.parseURLParams();
    this.bindDOMEvents();
    this.apply();
  },

  // Parse queries from URL (e.g., mobiles.html?brand=Apple)
  parseURLParams() {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('brand')) {
      this.state.brands = params.get('brand').split(',');
    }
    if (params.has('condition')) {
      this.state.conditions = params.get('condition').split(',');
    }
    if (params.has('availability')) {
      this.state.availability = params.get('availability');
    }
    if (params.has('q')) {
      this.state.search = params.get('q');
      // Set input fields values
      document.querySelectorAll('.search-input-field').forEach(input => {
        input.value = params.get('q');
      });
    }
    if (params.has('filter')) {
      const type = params.get('filter');
      if (type === 'deals') {
        this.state.sortBy = 'deals';
      } else if (type === 'sold') {
        this.state.availability = 'sold';
      }
    }
  },

  // Bind checkbox clicks and inputs to filter logic
  bindDOMEvents() {
    // Brand Checkboxes (Desktop + Mobile)
    document.querySelectorAll('.filter-brand-check').forEach(chk => {
      // Sync checkbox state on load
      if (this.state.brands.includes(chk.value)) chk.checked = true;
      
      chk.addEventListener('change', () => {
        this.state.brands = Array.from(document.querySelectorAll('.filter-brand-check:checked')).map(el => el.value);
        this.apply();
      });
    });

    // Condition Checkboxes
    document.querySelectorAll('.filter-condition-check').forEach(chk => {
      if (this.state.conditions.includes(chk.value)) chk.checked = true;

      chk.addEventListener('change', () => {
        this.state.conditions = Array.from(document.querySelectorAll('.filter-condition-check:checked')).map(el => el.value);
        this.apply();
      });
    });

    // Storage Checkboxes
    document.querySelectorAll('.filter-storage-check').forEach(chk => {
      chk.addEventListener('change', () => {
        this.state.storage = Array.from(document.querySelectorAll('.filter-storage-check:checked')).map(el => el.value);
        this.apply();
      });
    });

    // RAM Checkboxes
    document.querySelectorAll('.filter-ram-check').forEach(chk => {
      chk.addEventListener('change', () => {
        this.state.ram = Array.from(document.querySelectorAll('.filter-ram-check:checked')).map(el => el.value);
        this.apply();
      });
    });

    // Price Slider
    const priceSliders = document.querySelectorAll('.filter-price-slider');
    const priceValLabels = document.querySelectorAll('.price-slider-value');
    
    priceSliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.state.maxPrice = val;
        priceValLabels.forEach(lbl => {
          lbl.textContent = `₹${val.toLocaleString()}`;
        });
      });

      slider.addEventListener('change', () => {
        this.apply();
      });
    });

    // Sort Selectors
    const sortSelects = document.querySelectorAll('.filter-sort-select');
    sortSelects.forEach(select => {
      // Sync initial state
      if (this.state.sortBy) select.value = this.state.sortBy;

      select.addEventListener('change', (e) => {
        this.state.sortBy = e.target.value;
        this.apply();
      });
    });

    // Clear filters button
    document.querySelectorAll('.clear-filters-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.resetFilters();
      });
    });
  },

  // Reset filter state to initial empty values
  resetFilters() {
    this.state = {
      brands: [],
      conditions: [],
      storage: [],
      ram: [],
      minPrice: 0,
      maxPrice: 80000,
      availability: 'all',
      search: '',
      sortBy: 'newest'
    };

    // Reset inputs in DOM
    document.querySelectorAll('.filter-brand-check, .filter-condition-check, .filter-storage-check, .filter-ram-check').forEach(chk => {
      chk.checked = false;
    });

    document.querySelectorAll('.filter-price-slider').forEach(slider => {
      slider.value = 80000;
    });

    document.querySelectorAll('.price-slider-value').forEach(lbl => {
      lbl.textContent = '₹80,000';
    });

    document.querySelectorAll('.filter-sort-select').forEach(select => {
      select.value = 'newest';
    });

    document.querySelectorAll('.search-input-field').forEach(input => {
      input.value = '';
    });

    this.apply();
  },

  // Process logic and refresh view
  apply() {
    if (typeof products === 'undefined') return;

    let filtered = [...products];

    // Search query match
    if (this.state.search) {
      const term = this.state.search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.model.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.color.toLowerCase().includes(term) ||
        p.storage.toLowerCase().includes(term) ||
        p.condition.toLowerCase().includes(term)
      );
    }

    // Brands match
    if (this.state.brands.length > 0) {
      filtered = filtered.filter(p => this.state.brands.includes(p.brand));
    }

    // Conditions match
    if (this.state.conditions.length > 0) {
      filtered = filtered.filter(p => this.state.conditions.includes(p.condition));
    }

    // Storage match
    if (this.state.storage.length > 0) {
      filtered = filtered.filter(p => this.state.storage.includes(p.storage));
    }

    // RAM match
    if (this.state.ram.length > 0) {
      filtered = filtered.filter(p => this.state.ram.includes(p.ram));
    }

    // Price range match
    filtered = filtered.filter(p => p.price >= this.state.minPrice && p.price <= this.state.maxPrice);

    // Availability match
    if (this.state.availability !== 'all') {
      filtered = filtered.filter(p => p.availability === this.state.availability);
    }

    // Sort order processing
    if (this.state.sortBy === 'newest') {
      // Keep static index order or reverse it to mimic fresh items
      filtered.reverse();
    } else if (this.state.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.state.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.state.sortBy === 'deals') {
      // Sort by absolute discount amount
      filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }

    this.renderCatalog(filtered);
  },

  // Generates styled luxury mock SVG for phone placeholders
  getPhonePlaceholderSVG(brand, model, color) {
    // Choose standard base color representation
    let primaryHex = '#4a5568'; // Default Slate
    const colName = color.toLowerCase();
    
    if (colName.includes('blue')) primaryHex = '#3182ce';
    else if (colName.includes('black') || colName.includes('dark')) primaryHex = '#1a202c';
    else if (colName.includes('gold')) primaryHex = '#dd6b20';
    else if (colName.includes('white') || colName.includes('silver')) primaryHex = '#e2e8f0';
    else if (colName.includes('green')) primaryHex = '#38a169';
    else if (colName.includes('purple') || colName.includes('lavender')) primaryHex = '#805ad5';
    else if (colName.includes('yellow')) primaryHex = '#d69e2e';
    else if (colName.includes('beige')) primaryHex = '#cbd5e0';

    const cleanModel = model.replace(/[^a-zA-Z0-9\s]/g, '');

    // Return responsive SVG markup representing premium phone
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="100%" height="100%" fill="#0b0b0d"/>
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${primaryHex}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#0b0b0d" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#27272a"/>
          <stop offset="100%" stop-color="#09090b"/>
        </linearGradient>
        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#18181b"/>
          <stop offset="50%" stop-color="${primaryHex}" stop-opacity="0.12"/>
          <stop offset="100%" stop-color="#050505"/>
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="160" fill="url(#glow)"/>
      <g transform="translate(130, 60)">
        <!-- Phone Frame -->
        <rect x="0" y="0" width="140" height="280" rx="24" ry="24" fill="url(#body)" stroke="#27272a" stroke-width="4"/>
        <rect x="6" y="6" width="128" height="268" rx="18" ry="18" fill="url(#screenGrad)"/>
        
        <!-- Screen Highlight Gradient -->
        <path d="M 6 40 L 134 160 L 134 260 L 100 268 Z" fill="#ffffff" fill-opacity="0.03"/>
        
        <!-- Color matching Accent line -->
        <rect x="4" y="4" width="132" height="272" rx="20" ry="20" fill="none" stroke="${primaryHex}" stroke-width="1.5" stroke-opacity="0.6"/>
        
        <!-- Camera System Front -->
        <circle cx="70" cy="18" r="4" fill="#1a202c"/>
        <rect x="52" y="15" width="36" height="6" rx="3" ry="3" fill="#1a202c" fill-opacity="0.8"/>
      </g>
    </svg>`;

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  },

  // Dynamic template rendering engine
  renderCatalog(items) {
    const grid = document.getElementById('product-grid-container');
    const resultsCount = document.getElementById('filter-results-count');

    // Update count labels
    if (resultsCount) {
      resultsCount.textContent = `Showing ${items.length} ${items.length === 1 ? 'phone' : 'phones'}`;
    }

    if (!grid) return;

    if (items.length === 0) {
      grid.className = 'flex-center section-padding';
      grid.innerHTML = `
        <div class="text-center" style="max-width: 400px; padding: 40px 20px;">
          <div style="font-size: 3rem; margin-bottom: 20px; color: var(--text-muted);">🔍</div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">No Phones Found</h3>
          <p style="margin-bottom: 24px; font-size: 0.9rem;">We couldn't find any products matching your specific combinations. Try resetting filters.</p>
          <button class="btn btn-primary clear-filters-btn">Reset All Filters</button>
        </div>
      `;
      // Rebind newly drawn reset button
      const newReset = grid.querySelector('.clear-filters-btn');
      if (newReset) {
        newReset.addEventListener('click', () => this.resetFilters());
      }
      return;
    }

    // Set standard listing class
    grid.className = 'grid-4 mobile-grid-2';
    
    // Build and insert catalog templates
    grid.innerHTML = items.map(product => {
      const isSold = product.availability === 'sold';
      const badgeClass = `badge-condition badge-${product.condition.toLowerCase()}`;
      const priceFmt = `₹${product.price.toLocaleString()}`;
      const oldPriceFmt = product.oldPrice ? `₹${product.oldPrice.toLocaleString()}` : '';
      const svgPlaceholder = this.getPhonePlaceholderSVG(product.brand, product.model, product.color);
      
      // Select first image or fallback to SVG placeholder
      const cardImgSrc = product.images && product.images.length > 0 ? product.images[0] : svgPlaceholder;

      return `
        <article class="product-card reveal-on-scroll reveal-from-top-right" data-id="${product.id}">
          <div class="product-card-media">
            <span class="${badgeClass}">${product.condition}</span>
            <button class="wishlist-btn" aria-label="Add to Wishlist" onclick="event.preventDefault(); UI.toggleWishlist('${product.id}', this)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </button>
            
            ${isSold ? `
              <div class="sold-overlay-tag">
                <span class="sold-pill">Sold Out</span>
              </div>
            ` : ''}
            
            <a href="product.html?id=${product.id}" style="width:100%; display:flex; justify-content:center;">
              <!-- Load dynamic svg helper if files aren't physically present on local storage -->
              <img class="product-card-img" src="${cardImgSrc}" alt="${product.brand} ${product.model}" onerror="this.onerror=null; this.src='${svgPlaceholder}';">
            </a>
          </div>
          
          <div class="product-card-body">
            <div class="product-card-brand">${product.brand}</div>
            <h3 class="product-card-title">
              <a href="product.html?id=${product.id}">${product.model}</a>
            </h3>
            
            <div class="product-card-meta">
              <span class="meta-pill">${product.ram} RAM</span>
              <span class="meta-pill">${product.storage}</span>
              ${product.batteryHealth ? `<span class="meta-pill">🔋 ${product.batteryHealth}% BH</span>` : ''}
            </div>
            
            <div class="product-card-price-row">
              <span class="price-current">${priceFmt}</span>
              ${product.oldPrice ? `
                <span class="price-original">${oldPriceFmt}</span>
                <span class="price-discount">Save ₹${product.discount.toLocaleString()}</span>
              ` : ''}
            </div>
            
            <div class="product-card-actions">
              <a href="product.html?id=${product.id}" class="btn btn-secondary btn-sm">Details</a>
              ${isSold ? `
                <button class="btn btn-outline btn-sm" disabled style="opacity: 0.5; cursor: not-allowed;">Sold</button>
              ` : `
                <button class="btn btn-primary btn-sm" onclick="event.preventDefault(); Cart.add('${product.id}')">Buy</button>
              `}
            </div>
          </div>
        </article>
      `;
    }).join('');

    if (typeof UI !== 'undefined') {
      UI.initScrollReveal();
    }
  }
};

// Autostart if DOM element is present
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-grid-container')) {
    Filter.init();
  }
});

window.Filter = Filter;
