// Mahakal Telecom Mankapur - Cart Module
// Handles client-side cart items in localStorage

const CART_STORAGE_KEY = 'mahakal_telecom_cart';

const Cart = {
  // Retrieve cart from localStorage
  get() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to parse cart data", e);
      return [];
    }
  },

  // Save cart to localStorage
  save(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      this.updateBadges();
      // Dispatch a custom event to notify other scripts of cart changes
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    } catch (e) {
      console.error("Failed to save cart data", e);
    }
  },

  // Add an item to cart
  add(productId, quantity = 1, forceUpdate = false) {
    // Find product details
    const product = typeof products !== 'undefined' ? products.find(p => p.id === productId) : null;
    if (!product) {
      console.error(`Product ${productId} not found in database.`);
      return false;
    }

    if (product.availability === 'sold') {
      if (typeof UI !== 'undefined') {
        UI.showToast("This device has already been sold!", "error");
      }
      return false;
    }

    let cart = this.get();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      if (forceUpdate) {
        cart[existingIndex].quantity = quantity;
      } else {
        // Limit quantity to 3 per customer for refurbished unique items
        if (cart[existingIndex].quantity >= 3) {
          if (typeof UI !== 'undefined') {
            UI.showToast("Limit of 3 units per pre-owned device reached.", "error");
          }
          return false;
        }
        cart[existingIndex].quantity += quantity;
      }
    } else {
      cart.push({
        id: product.id,
        brand: product.brand,
        model: product.model,
        price: product.price,
        originalPrice: product.oldPrice,
        image: product.images[0] || '',
        ram: product.ram,
        storage: product.storage,
        condition: product.condition,
        color: product.color,
        quantity: quantity
      });
    }

    this.save(cart);
    
    if (typeof UI !== 'undefined') {
      UI.showToast(`${product.model} added to cart!`);
    }
    return true;
  },

  // Remove an item from cart
  remove(productId) {
    let cart = this.get();
    const filteredCart = cart.filter(item => item.id !== productId);
    this.save(filteredCart);
    if (typeof UI !== 'undefined') {
      UI.showToast("Item removed from cart.");
    }
  },

  // Update item quantity
  updateQty(productId, qty) {
    if (qty <= 0) {
      this.remove(productId);
      return;
    }
    
    if (qty > 3) {
      if (typeof UI !== 'undefined') {
        UI.showToast("Limit of 3 units per customer for refurbished devices.", "error");
      }
      qty = 3;
    }

    this.add(productId, qty, true);
  },

  // Clear entire cart
  clear() {
    this.save([]);
  },

  // Get total item count in cart
  getCount() {
    return this.get().reduce((total, item) => total + item.quantity, 0);
  },

  // Calculate pricing subtotal
  getSubtotal() {
    return this.get().reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  // Calculate savings
  getSavings() {
    return this.get().reduce((total, item) => {
      const orig = item.originalPrice || item.price;
      return total + ((orig - item.price) * item.quantity);
    }, 0);
  },

  // Update badge counters on all header elements
  updateBadges() {
    const count = this.getCount();
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
      badge.textContent = count;
      if (count === 0) {
        badge.style.display = 'none';
      } else {
        badge.style.display = 'flex';
      }
    });
  }
};

// Auto-run badge check on load
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadges();
});

// Bind to window context
window.Cart = Cart;
