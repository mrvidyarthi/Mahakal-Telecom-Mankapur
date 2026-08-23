// Mahakal Telecom Mankapur - Main Orchestrator
// Integrates page dynamics, catalogs, cart pages, detail views, and checkouts

const Main = {
  init() {
    this.routePageLogic();
    this.setupWhatsAppRedirects();
  },

  // Routes logical actions based on active HTML page
  routePageLogic() {
    const path = window.location.pathname;

    if (path.includes('product.html')) {
      this.initProductDetailPage();
    } else if (path.includes('cart.html')) {
      this.initCartPage();
    } else if (path.includes('checkout.html')) {
      this.initCheckoutPage();
    } else if (path.includes('order-success.html')) {
      this.initOrderSuccessPage();
    } else if (
      path.includes('index.html') || 
      path === '/' || 
      path.endsWith('mahakal/') || 
      path.endsWith('mahakal')
    ) {
      this.initHomePage();
    } else if (
      path.includes('iphone.html') || 
      path.includes('android.html') || 
      path.includes('deals.html') || 
      path.includes('sold.html')
    ) {
      this.initSpecialtyPages(path);
    }
  },

  // ==========================================================================
  // HOMEPAGE
  // ==========================================================================
  initHomePage() {
    if (typeof products === 'undefined') return;

    // Render New Arrivals (Limit 6, Available status)
    const arrivalsGrid = document.getElementById('new-arrivals-grid');
    if (arrivalsGrid) {
      const arrivals = products
        .filter(p => p.availability === 'available')
        .slice(0, 6);
      this.renderProductGrid(arrivals, arrivalsGrid);
    }

    // Render Recently Sold (Limit 4, Sold status)
    const soldGrid = document.getElementById('recently-sold-grid');
    if (soldGrid) {
      const sold = products
        .filter(p => p.availability === 'sold')
        .slice(0, 4);
      this.renderProductGrid(sold, soldGrid);
    }
  },

  // Helper to render static sub-grids on Home/Category pages
  renderProductGrid(items, container) {
    container.innerHTML = items.map(product => {
      const isSold = product.availability === 'sold';
      const badgeClass = `badge-condition badge-${product.condition.toLowerCase()}`;
      const priceFmt = `₹${product.price.toLocaleString()}`;
      const oldPriceFmt = product.oldPrice ? `₹${product.oldPrice.toLocaleString()}` : '';
      
      // Get dynamic placeholder
      const svgPlaceholder = typeof Filter !== 'undefined' ? 
        Filter.getPhonePlaceholderSVG(product.brand, product.model, product.color) : '';
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
                <button class="btn btn-outline btn-sm" disabled style="opacity:0.5; cursor:not-allowed;">Sold</button>
              ` : `
                <button class="btn btn-primary btn-sm" onclick="event.preventDefault(); Cart.add('${product.id}')">Buy</button>
              `}
            </div>
          </div>
        </article>
      `;
    }).join('');

    if (typeof UI !== 'undefined') {
      UI.syncWishlistButtons();
      UI.initScrollReveal();
    }
  },

  // ==========================================================================
  // BRAND ENTRYPOINTS (iphone.html, android.html, deals.html, sold.html)
  // ==========================================================================
  initSpecialtyPages(path) {
    if (typeof products === 'undefined') return;

    let filtered = [...products];
    let pageTitleText = "Mobiles";
    let pageSubtitleText = "Premium Pre-Owned SmartPhones";

    if (path.includes('iphone.html')) {
      filtered = filtered.filter(p => p.brand === 'Apple');
      pageTitleText = "Premium iPhones";
      pageSubtitleText = "Sleek and secure Apple iPhones in excellent condition.";
    } else if (path.includes('android.html')) {
      filtered = filtered.filter(p => p.brand !== 'Apple');
      pageTitleText = "Android SmartPhones";
      pageSubtitleText = "Top brands like Samsung, OnePlus, Motorola, and Xiaomi.";
    } else if (path.includes('deals.html')) {
      // Show products sorted by high discount or active discount
      filtered = filtered.filter(p => p.discount > 0 && p.availability === 'available');
      filtered.sort((a,b) => b.discount - a.discount);
      pageTitleText = "Best Deals Today";
      pageSubtitleText = "Handpicked premium devices at unmatched discount prices.";
    } else if (path.includes('sold.html')) {
      filtered = filtered.filter(p => p.availability === 'sold');
      pageTitleText = "Recently Sold Out";
      pageSubtitleText = "Pre-owned smartphones that found their happy owners.";
    }

    // Set page text descriptors if HTML tags exist
    const pageHeaderTitle = document.getElementById('specialty-page-title');
    const pageHeaderDesc = document.getElementById('specialty-page-desc');
    if (pageHeaderTitle) pageHeaderTitle.textContent = pageTitleText;
    if (pageHeaderDesc) pageHeaderDesc.textContent = pageSubtitleText;

    const specialtyGrid = document.getElementById('specialty-grid-container');
    if (specialtyGrid) {
      if (filtered.length === 0) {
        specialtyGrid.innerHTML = `
          <div class="text-center section-padding" style="grid-column: 1 / -1;">
            <p>No devices matching this list currently available.</p>
          </div>
        `;
      } else {
        this.renderProductGrid(filtered, specialtyGrid);
      }
    }
  },

  // ==========================================================================
  // PRODUCT DETAIL PAGE
  // ==========================================================================
  initProductDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const product = typeof products !== 'undefined' ? products.find(p => p.id === id) : null;
    const detailContainer = document.getElementById('product-detail-container');

    if (!detailContainer) return;

    if (!product) {
      detailContainer.innerHTML = `
        <div class="text-center section-padding">
          <h2>Product Not Found</h2>
          <p style="margin: 20px 0;">The pre-owned device you are looking for has been sold or is no longer listed.</p>
          <a href="mobiles.html" class="btn btn-primary">Browse All Mobiles</a>
        </div>
      `;
      return;
    }

    const isAvailable = product.availability === 'available';
    const isSold = !isAvailable;
    
    // Choose dynamic image SVG fallback
    const svgPlaceholder = typeof Filter !== 'undefined' ? 
      Filter.getPhonePlaceholderSVG(product.brand, product.model, product.color) : '';
    const firstImg = product.images && product.images.length > 0 ? product.images[0] : svgPlaceholder;

    // Fill Page Title metadata for SEO context
    document.title = `${product.brand} ${product.model} (${product.storage}) - Pre-Owned | Mahakal Telecom`;

    // Write structure template
    detailContainer.innerHTML = `
      <div class="product-detail-layout">
        
        <!-- Left Side: Interactive Gallery -->
        <div class="product-gallery">
          <div class="main-image-viewport">
            ${isSold ? `<span class="sold-pill" style="position: absolute; top: 20px; left: 20px; z-index: 2;">Sold Out</span>` : ''}
            <img id="detail-main-img" src="${firstImg}" alt="${product.brand} ${product.model}" onerror="this.onerror=null; this.src='${svgPlaceholder}';">
          </div>
          
          <!-- Image thumbnails -->
          ${product.images && product.images.length > 1 ? `
            <div class="gallery-thumbnails">
              ${product.images.map((img, idx) => `
                <button class="thumbnail-btn ${idx === 0 ? 'active' : ''}" onclick="Main.switchMainImage('${img}', this)">
                  <img src="${img}" onerror="this.onerror=null; this.src='${svgPlaceholder}';">
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Right Side: Specs Buy Actions -->
        <div class="product-specs-info">
          <div class="detail-brand-row">
            <span class="product-card-brand">${product.brand}</span>
            <span class="badge-condition badge-${product.condition.toLowerCase()}" style="position: static; font-size: 0.65rem;">${product.condition} Condition</span>
          </div>

          <h1 class="detail-title">${product.model}</h1>
          
          <div class="detail-meta-row">
            <span class="meta-pill">${product.storage}</span>
            <span class="meta-pill">${product.ram} RAM</span>
            <span class="meta-pill">${product.color}</span>
            ${product.batteryHealth ? `<span class="meta-pill">🔋 ${product.batteryHealth}% Battery Health</span>` : ''}
          </div>

          <div class="detail-price-box">
            <div class="detail-price-row">
              <span class="detail-price-current">₹${product.price.toLocaleString()}</span>
              ${product.oldPrice ? `
                <span class="detail-price-original">₹${product.oldPrice.toLocaleString()}</span>
                <span class="price-discount" style="font-size: 0.85rem; padding: 2px 8px;">Save ₹${product.discount.toLocaleString()}</span>
              ` : ''}
            </div>
            <div class="detail-status-row">
              <span class="badge-status ${isAvailable ? 'status-available' : 'status-sold'}">
                ● ${isAvailable ? 'Available In Mankapur Store' : 'Sold Out'}
              </span>
            </div>
          </div>

          <p class="detail-description">
            ${product.description}
          </p>

          <!-- Core specifications highlights -->
          <div class="specs-highlights-grid">
            <div class="specs-highlight-item">
              <span class="specs-highlight-title">Checking Warranty</span>
              <p class="specs-highlight-value">${product.warranty}</p>
            </div>
            <div class="specs-highlight-item">
              <span class="specs-highlight-title">Retail Box Available</span>
              <p class="specs-highlight-value">${product.box ? 'Yes, Included' : 'Device Only'}</p>
            </div>
            <div class="specs-highlight-item">
              <span class="specs-highlight-title">Charger Supplied</span>
              <p class="specs-highlight-value">${product.charger ? 'Yes, Fast Charger' : 'No (Cable Only)'}</p>
            </div>
            <div class="specs-highlight-item">
              <span class="specs-highlight-title">Location</span>
              <p class="specs-highlight-value">Mankapur, Gonda</p>
            </div>
          </div>

          <!-- Checkout & CTA Buttons -->
          <div class="detail-cta-container">
            ${isAvailable ? `
              <div class="detail-actions-row">
                <button class="btn btn-primary btn-lg" style="flex: 1;" onclick="Cart.add('${product.id}'); window.location.href='cart.html';">Buy Now</button>
                <button class="btn btn-secondary btn-lg" style="flex: 1;" onclick="Cart.add('${product.id}')">Add to Cart</button>
              </div>
              <button class="btn btn-whatsapp btn-lg btn-full" onclick="Main.openWhatsAppChat('${product.id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.977h.004c4.368 0 7.926-3.559 7.93-7.93a7.897 7.897 0 0 0-2.33-5.54M7.993 14.566c-1.208 0-2.395-.325-3.433-.94l-.245-.146-2.548.669.68-2.483-.16-.255a6.762 6.762 0 0 1-1.034-3.678c.007-3.729 3.046-6.766 6.78-6.766a6.792 6.792 0 0 1 4.796 1.992 6.792 6.792 0 0 1 1.996 4.793c-.004 3.73-3.042 6.766-6.78 6.766m3.604-4.808c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                Ask About This Phone on WhatsApp
              </button>
            ` : `
              <button class="btn btn-outline btn-lg" disabled style="opacity: 0.5; cursor: not-allowed; width:100%;">Device Sold Out</button>
              <a href="mobiles.html" class="btn btn-secondary btn-lg btn-full">Looking for something similar? Explore Mobiles</a>
            `}
          </div>
        </div>

      </div>

      <!-- Specifications Grid Details Section -->
      <div class="reveal-on-scroll" style="margin-top: 60px;">
        <h2 style="font-size: 1.5rem; border-left: 3px solid var(--accent-gold); padding-left: 12px; margin-bottom: 24px;">Full Specifications Grid</h2>
        <div class="specs-detail-grid">
          
          <div class="specs-row-cell">
            <span style="color: var(--text-muted);">Brand</span>
            <span style="font-weight: 500;">${product.brand}</span>
          </div>
          <div class="specs-row-cell">
            <span style="color: var(--text-muted);">Model</span>
            <span style="font-weight: 500;">${product.model}</span>
          </div>
          <div class="specs-row-cell">
            <span style="color: var(--text-muted);">Internal Storage</span>
            <span style="font-weight: 500;">${product.storage}</span>
          </div>
          <div class="specs-row-cell">
            <span style="color: var(--text-muted);">RAM Memory</span>
            <span style="font-weight: 500;">${product.ram}</span>
          </div>
          <div class="specs-row-cell">
            <span style="color: var(--text-muted);">Color Variant</span>
            <span style="font-weight: 500;">${product.color}</span>
          </div>
          <div class="specs-row-cell">
            <span style="color: var(--text-muted);">Battery Health Status</span>
            <span style="font-weight: 500;">${product.batteryHealth ? `${product.batteryHealth}% (Tested)` : 'Not Applicable'}</span>
          </div>
          <div class="specs-row-cell">
            <span style="color: var(--text-muted);">Condition Classification</span>
            <span style="font-weight: 500; color: var(--accent-gold);">${product.condition}</span>
          </div>
          <div class="specs-row-cell">
            <span style="color: var(--text-muted);">Warranty Cover</span>
            <span style="font-weight: 500;">${product.warranty}</span>
          </div>
          <div class="specs-row-cell">
            <span style="color: var(--text-muted);">Box Packaging</span>
            <span style="font-weight: 500;">${product.box ? 'Original Retail Box' : 'Plain Packaging Box'}</span>
          </div>
          <div class="specs-row-cell">
            <span style="color: var(--text-muted);">Accessories In Box</span>
            <span style="font-weight: 500;">${product.charger ? 'Fast Charger + USB Cable' : 'Compatible USB Cable Only'}</span>
          </div>
          
        </div>
      </div>
    `;

    if (typeof UI !== 'undefined') {
      UI.initScrollReveal();
    }
  },

  // Swaps gallery index main viewports
  switchMainImage(imgUrl, btn) {
    const mainImg = document.getElementById('detail-main-img');
    if (mainImg) {
      mainImg.src = imgUrl;
    }

    // Set active thumb border
    const thumbs = btn.parentElement.querySelectorAll('.thumbnail-btn');
    thumbs.forEach(t => {
      t.style.borderColor = 'var(--border-color)';
      t.classList.remove('active');
    });
    btn.style.borderColor = 'var(--accent-gold)';
    btn.classList.add('active');
  },

  // ==========================================================================
  // SHOPPING CART PAGE
  // ==========================================================================
  initCartPage() {
    const cartList = document.getElementById('cart-items-tbody');
    const emptyState = document.getElementById('cart-empty-state');
    const filledState = document.getElementById('cart-filled-state');

    const cart = typeof Cart !== 'undefined' ? Cart.get() : [];

    if (!cartList) return;

    if (cart.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (filledState) filledState.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (filledState) filledState.style.display = 'grid';

    // Output cart elements row-by-row
    cartList.innerHTML = cart.map(item => {
      const formattedPrice = `₹${item.price.toLocaleString()}`;
      const formattedSubtotal = `₹ ${(item.price * item.quantity).toLocaleString()}`;
      const svgPlaceholder = typeof Filter !== 'undefined' ? 
        Filter.getPhonePlaceholderSVG(item.brand, item.model, item.color) : '';
      const imgSrc = item.image || svgPlaceholder;

      return `
        <tr>
          <td class="product-cell">
            <div class="cart-product-info" style="display: flex; align-items: center; gap: 16px;">
              <img src="${imgSrc}" alt="${item.model}" style="width: 60px; height: 60px; object-fit: contain; background: #0b0b0d; padding: 4px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);" onerror="this.onerror=null; this.src='${svgPlaceholder}';">
              <div>
                <h4 style="font-size: 0.95rem; font-weight: 600;"><a href="product.html?id=${item.id}">${item.model}</a></h4>
                <p style="font-size: 0.75rem; color: var(--text-muted);">${item.storage} • ${item.color} • ${item.condition} Condition</p>
              </div>
            </div>
          </td>
          <td data-label="Price" style="font-weight: 500;">${formattedPrice}</td>
          <td data-label="Quantity">
            <div style="display: inline-flex; align-items: center; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-tertiary); overflow: hidden;">
              <button onclick="Cart.updateQty('${item.id}', ${item.quantity - 1}); Main.initCartPage();" style="padding: 6px 12px; font-weight: 700; color: var(--text-secondary); background: none;">-</button>
              <span style="padding: 0 8px; font-size: 0.85rem; font-weight: 700; min-width: 24px; text-align: center;">${item.quantity}</span>
              <button onclick="Cart.updateQty('${item.id}', ${item.quantity + 1}); Main.initCartPage();" style="padding: 6px 12px; font-weight: 700; color: var(--text-secondary); background: none;">+</button>
            </div>
          </td>
          <td data-label="Subtotal" style="font-weight: 700; color: var(--text-primary);">${formattedSubtotal}</td>
          <td data-label="Action">
            <button onclick="Cart.remove('${item.id}'); Main.initCartPage();" style="color: var(--danger-red); font-size: 0.8rem; font-weight: 500;" class="hover-lift">Remove</button>
          </td>
        </tr>
      `;
    }).join('');

    // Update Totals Summary Card
    const subtotal = Cart.getSubtotal();
    const savings = Cart.getSavings();

    const subtotalEl = document.getElementById('cart-subtotal-val');
    const savingsEl = document.getElementById('cart-savings-val');
    const totalEl = document.getElementById('cart-total-val');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString()}`;
    if (savingsEl) savingsEl.textContent = `-₹${savings.toLocaleString()}`;
    
    // Free delivery setup
    if (totalEl) totalEl.textContent = `₹${subtotal.toLocaleString()}`;
  },

  // ==========================================================================
  // CHECKOUT PAGE
  // ==========================================================================
  initCheckoutPage() {
    const cart = typeof Cart !== 'undefined' ? Cart.get() : [];
    if (cart.length === 0) {
      window.location.href = 'mobiles.html';
      return;
    }

    // Render Order Summary list sidebar
    const list = document.getElementById('checkout-items-summary-list');
    if (list) {
      list.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.03); margin-bottom: 12px;">
          <div>
            <h4 style="font-size: 0.88rem; font-weight: 600;">${item.model} <span style="color: var(--text-muted);">x${item.quantity}</span></h4>
            <p style="font-size: 0.72rem; color: var(--text-muted);">${item.storage} • ${item.condition} Condition</p>
          </div>
          <span style="font-size: 0.9rem; font-weight: 600;">₹${(item.price * item.quantity).toLocaleString()}</span>
        </div>
      `).join('');
    }

    const subtotal = Cart.getSubtotal();
    const subtotalEl = document.getElementById('chk-subtotal-val');
    const totalEl = document.getElementById('chk-total-val');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `₹${subtotal.toLocaleString()}`;

    // Checkout form validation handler
    const form = document.getElementById('checkout-demo-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect customer detail inputs
        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const customerAddress = document.getElementById('customer-address').value;
        const customerCity = document.getElementById('customer-city').value;
        const customerState = document.getElementById('customer-state').value;
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;

        // Generate mock receipt ID
        const orderId = `#MT-DEMO-${Math.floor(1000 + Math.random() * 9000)}`;

        const orderDetails = {
          orderId: orderId,
          customerName: customerName,
          customerPhone: customerPhone,
          customerAddress: `${customerAddress}, ${customerCity}, ${customerState}`,
          paymentMethod: paymentMethod,
          amount: subtotal,
          items: cart
        };

        // Save last order context
        sessionStorage.setItem('mahakal_last_order', JSON.stringify(orderDetails));

        // Clear cart mock database
        Cart.clear();

        // Redirect to success
        window.location.href = 'order-success.html';
      });
    }
  },

  // ==========================================================================
  // ORDER SUCCESS DEMO PAGE
  // ==========================================================================
  initOrderSuccessPage() {
    const orderData = sessionStorage.getItem('mahakal_last_order');
    if (!orderData) {
      // If direct navigation, mock some order data to display template nicely
      const mockOrder = {
        orderId: "#MT-DEMO-1025",
        customerName: "Kunal Kasaudhan",
        customerPhone: "+91 9565391070",
        customerAddress: "Mankapur, Gonda, Uttar Pradesh, 271302",
        paymentMethod: "cod",
        amount: 29999,
        items: [
          {
            model: "iPhone 13",
            storage: "128GB",
            price: 29999,
            quantity: 1,
            condition: "Excellent"
          }
        ]
      };
      sessionStorage.setItem('mahakal_last_order', JSON.stringify(mockOrder));
      this.initOrderSuccessPage();
      return;
    }

    const order = JSON.parse(orderData);

    const orderIdEl = document.getElementById('success-order-id');
    const orderCustomerEl = document.getElementById('success-customer-name');
    const orderAddressEl = document.getElementById('success-delivery-address');
    const orderAmountEl = document.getElementById('success-order-amount');
    const orderItemsEl = document.getElementById('success-items-list');

    if (orderIdEl) orderIdEl.textContent = order.orderId;
    if (orderCustomerEl) orderCustomerEl.textContent = order.customerName;
    if (orderAddressEl) orderAddressEl.textContent = order.customerAddress;
    if (orderAmountEl) orderAmountEl.textContent = `₹${order.amount.toLocaleString()}`;

    if (orderItemsEl && order.items) {
      orderItemsEl.innerHTML = order.items.map(item => `
        <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:8px; color:var(--text-secondary);">
          <span>${item.model} (${item.storage}) x${item.quantity}</span>
          <span style="font-weight:600; color:var(--text-primary);">₹${(item.price * item.quantity).toLocaleString()}</span>
        </div>
      `).join('');
    }
  },

  // ==========================================================================
  // WHATSAPP REDIRECT BUILDER
  // ==========================================================================
  setupWhatsAppRedirects() {
    const chatBtn = document.querySelectorAll('.whatsapp-redirect-btn');
    chatBtn.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openWhatsAppChat();
      });
    });
  },

  openWhatsAppChat(productId = null) {
    const phoneNumber = "919565391070"; // Placeholder number for shop owner
    let text = "Hello Mahakal Telecom! I am interested in visiting your store in Mankapur.";
    
    if (productId && typeof products !== 'undefined') {
      const product = products.find(p => p.id === productId);
      if (product) {
        text = `Hello Mahakal Telecom! I saw the pre-owned *${product.brand} ${product.model}* (${product.storage}, ${product.color}, ${product.condition} Condition, Price: ₹${product.price}) listed on your shop demo. Is it still available for purchase?`;
      }
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Main.init();
});

window.Main = Main;
