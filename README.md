# Mahakal Telecom Mankapur - Premium Pre-Owned SmartPhones Shop

A state-of-the-art, responsive, dark-themed pre-owned smartphone catalog frontend build. Engineered as a highly premium, modern 2026 e-commerce interface for **Mahakal Telecom Mankapur** (Gonda, Uttar Pradesh, India).

---

## 📁 File Structure

```
mahakal-telecom/
├── index.html           # Homepage (Hero, Brand list, New Arrivals, Sold Proofs, Directions)
├── mobiles.html         # Browse Catalog (Sidebar filters, mobile drawers, instant sorts)
├── product.html         # Dynamic specifications details template (carousels, specs grid)
├── iphone.html          # Prefiltered list page for Apple iPhones
├── android.html         # Prefiltered list page for Android smartphones
├── deals.html           # Daily active cuts & special discounts
├── sold.html            # Recently sold out products catalog
├── about.html           # Brand narrative, core transparency details
├── contact.html         # Call/WhatsApp links, business hours & offline route map
├── cart.html            # Shopping cart overview (localStorage quantities calculation)
├── checkout.html        # Customer billing address inputs & COD checkout demo
├── order-success.html   # MT invoice details & order tracking status timeline
│
├── css/
│   ├── style.css        # Core resets, imports, scrollbars, global variables (palette)
│   ├── components.css   # Buttons, cards, headers, navigation drawers, WhatsApp floats, toast alerts
│   ├── animations.css   # Transition indicators, skeleton shimmers, scroll reveals, pulse glow
│   └── responsive.css   # Viewport breakpoints, mobile 2-column grids, horizontal scrolls
│
├── js/
│   ├── products.js      # Mock Smartphone database (20 items catalog)
│   ├── cart.js          # Cart item managers (localStorage add/remove/limits)
│   ├── search.js        # Autocomplete search logic
│   ├── filter.js        # Catalog checklist calculations & dynamic phone SVG drawer
│   ├── ui.js            # Header sticky scrolling, drawer overlays, toast popups, scroll reveal
│   └── main.js          # Dynamic templates routing, cart grids injector, whatsapp builders
│
└── README.md            # Setup guidelines & configuration manual
```

---

## ⚙️ Configuration & Customization Guide

### 1. Setting the WhatsApp Number & Text Templates
Open [`js/main.js`](file:///c:/Users/KUNAL%20KASAUDHAN/Desktop/mahakal/js/main.js) and locate the `openWhatsAppChat(productId)` method:
```javascript
openWhatsAppChat(productId = null) {
  const phoneNumber = "919565391070"; // Replace with store owner's real WhatsApp number (include country code)
  ...
}
```
You can modify this number to your real business line. The template dynamically compiles product models, prices, RAM/Storage, and condition filters to send pre-formatted purchase queries.

### 2. Customizing the Color System (Accent Gold)
To change the primary accent colors (e.g., brand gold), edit the CSS variables inside [`css/style.css`](file:///c:/Users/KUNAL%20KASAUDHAN/Desktop/mahakal/css/style.css):
```css
:root {
  --bg-primary: #09090b;       /* Primary backdrop */
  --accent-gold: #d4af37;      /* Change this hex value for gold accents */
  --accent-gold-hover: #e5c158;/* Hover state gold */
}
```

### 3. Swapping SVG Placeholders with Real Photos
By default, if an image fails to load or isn't supplied, the catalog dynamically generates a high-end visual SVG phone mockup matching the phone's color chassis.
To use real photos:
1. Save product images inside `media/products/` (e.g., `iphone13.png`).
2. Update the `images: [...]` array path inside [`js/products.js`](file:///c:/Users/KUNAL%20KASAUDHAN/Desktop/mahakal/js/products.js) to point to the saved path.

---

## ⚡ Key Highlights
* **Luxury theme aesthetics**: Zinc dark palettes with polished gold tones, responsive micro-interactions, and custom icon buttons.
* **Offline Map representation**: Native SVG blueprint layout of Mankapur (Gonda Road & Railway station coordinates) renders cleanly offline without heavy maps API.
* **Mobile-optimized**: Collapsible filtering drawer overlays, floating WhatsApp CTAs with pulsing indicators, and quick 2-column layouts for mobile thumb navigation.
* **Backend Ready**: Modulized JS separates product datasets from render layouts, making it trivial to integrate Django REST API, PostgreSQL databases, Razorpay gateways, or Shiprocket shipping later.
