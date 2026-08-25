// Mahakal Telecom Mankapur - User Interface Module
// Handles toast messages, wishlist storage, mobile drawers, and scroll animations

const WISHLIST_STORAGE_KEY = 'mahakal_telecom_wishlist';

const UI = {
  // Toast notifications manager
  showToast(message, type = 'success') {
    let container = document.getElementById('toast-notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-notification-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const toastClass = type === 'success' ? 'toast toast-success' : 'toast toast-error';
    toast.className = toastClass;
    
    // Icon selection
    const icon = type === 'success' ? '✓' : '⚠';
    
    toast.innerHTML = `
      <span style="font-weight: 700; font-family: var(--font-title);">${icon}</span>
      <span style="font-size: 0.85rem; font-weight: 500;">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger transition Reflow
    setTimeout(() => {
      toast.classList.add('active');
    }, 10);

    // Auto remove toast
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  },

  // Toggle wishlist items in storage
  toggleWishlist(productId, btnElement) {
    let wishlist = [];
    try {
      const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
      wishlist = data ? JSON.parse(data) : [];
    } catch(e) {
      console.error(e);
    }

    const index = wishlist.indexOf(productId);
    let added = false;
    
    if (index > -1) {
      wishlist.splice(index, 1);
      if (btnElement) btnElement.classList.remove('active');
      this.showToast("Removed from wishlist.");
    } else {
      wishlist.push(productId);
      if (btnElement) btnElement.classList.add('active');
      this.showToast("Added to wishlist!");
      added = true;
    }

    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    
    // Dispatch custom event for sync
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { productId, added } }));
  },

  // Sync wishlist button visual states on load
  syncWishlistButtons() {
    let wishlist = [];
    try {
      const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
      wishlist = data ? JSON.parse(data) : [];
    } catch(e) {
      return;
    }

    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      // Find parent card / article to get product ID
      const card = btn.closest('.product-card') || btn.closest('[data-id]');
      if (card) {
        const id = card.getAttribute('data-id');
        if (wishlist.includes(id)) {
          btn.classList.add('active');
        }
      }
    });
  },

  // Sticky navbar logic
  initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scroll');
      } else {
        header.classList.remove('scroll');
      }
    });
  },

  // Drawers setup (Hamburger + Mobile Filter Drawer)
  initDrawers() {
    const body = document.body;
    
    // Overlay backdrop
    let overlay = document.querySelector('.global-backdrop-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'overlay global-backdrop-overlay';
      body.appendChild(overlay);
    }

    // Hamburger Mobile Menu Drawer Toggling
    const mobileMenuTrigger = document.querySelector('.mobile-menu-trigger');
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    const openMenu = () => {
      mobileMenuDrawer.classList.add('active');
      overlay.classList.add('active');
      body.style.overflow = 'hidden';
    };

    // Publicly accessible close method
    UI.closeAllDrawers = () => {
      if (mobileMenuDrawer) mobileMenuDrawer.classList.remove('active');
      const filterDrawer = document.getElementById('mobile-filter-drawer');
      if (filterDrawer) filterDrawer.classList.remove('active');
      const sortDrawer = document.getElementById('mobile-sort-drawer');
      if (sortDrawer) sortDrawer.classList.remove('active');
      overlay.classList.remove('active');
      body.style.overflow = '';
      
      const searchOverlay = document.getElementById('search-overlay-modal');
      if (searchOverlay) searchOverlay.classList.remove('active');
    };

    if (mobileMenuTrigger) mobileMenuTrigger.addEventListener('click', openMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', UI.closeAllDrawers);

    // Mobile Filter Drawer Toggling
    const mobileFilterTrigger = document.getElementById('mobile-filter-trigger');
    const mobileFilterDrawer = document.getElementById('mobile-filter-drawer');
    const mobileFilterClose = document.getElementById('mobile-filter-close');

    if (mobileFilterTrigger && mobileFilterDrawer) {
      mobileFilterTrigger.addEventListener('click', () => {
        mobileFilterDrawer.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden';
      });
    }

    if (mobileFilterClose) {
      mobileFilterClose.addEventListener('click', UI.closeAllDrawers);
    }

    // Mobile Sort Drawer Toggling
    const mobileSortTrigger = document.getElementById('mobile-sort-trigger');
    const mobileSortDrawer = document.getElementById('mobile-sort-drawer');
    const mobileSortClose = document.getElementById('mobile-sort-close');

    if (mobileSortTrigger && mobileSortDrawer) {
      mobileSortTrigger.addEventListener('click', () => {
        mobileSortDrawer.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden';
      });
    }

    if (mobileSortClose) {
      mobileSortClose.addEventListener('click', UI.closeAllDrawers);
    }

    // Backdrop click close trigger
    overlay.addEventListener('click', UI.closeAllDrawers);
  },

  // Scroll reveal loading transitions
  initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-on-scroll:not(.revealed)');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    });

    reveals.forEach(el => observer.observe(el));
  },

  // Back to top floating widget
  initBackToTop() {
    const btn = document.getElementById('back-to-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.add('active');
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
      } else {
        btn.classList.remove('active');
        btn.style.opacity = '0';
        btn.style.pointerEvents = 'none';
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  UI.initStickyHeader();
  UI.initDrawers();
  UI.initScrollReveal();
  UI.initBackToTop();
  
  // Custom delayed button synchronization
  setTimeout(() => {
    UI.syncWishlistButtons();
  }, 100);
});

// Bind to window context
window.UI = UI;
window.showToast = (msg, type) => UI.showToast(msg, type);
