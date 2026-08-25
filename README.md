# Mahakal Telecom Mankapur - Premium Pre-Owned SmartPhones Store

A premium, state-of-the-art e-commerce website designed for **Mahakal Telecom Mankapur** (Gonda, Uttar Pradesh). Built with Django, this dark-themed storefront is fully optimized for speed, luxury aesthetics, and mobile responsiveness.

---

## ⚡ Key Website Features

1. **Luxury Gold Aesthetics**: Dark themes matched with gold metallic gradients, glassmorphism cards, and smooth hover effects.
2. **Direct Shop Hero Fold**: Pushes all catalog items and Brand Categories (like Flipkart's categories list) directly above-the-fold on mobile for an immediate shopping experience.
3. **2-Column Mobile Catalog**: Beautiful double-column layout on phones. Showcases phone details (RAM, Storage, Battery Health, and current/original prices) and stacked quick actions without layout clipping.
4. **Combined Filter & Sort Drawer**: Consolidates sorting and filtering controls into a single drawer on mobile screens.
5. **Interactive Route bluemap**: Includes a custom SVG vector map of Mankapur Gonda Railway Station coordinates.
6. **WhatsApp Integration**: Sends structured purchase queries (with product name, details, and price) directly to the store manager.

---

## ⚙️ Running Locally

Follow these steps to run the website on your local development machine:

### 1. Install Dependencies
Make sure you have Python installed, then install the required packages:
```bash
pip install -r requirements.txt
```

### 2. Run Database Migrations
Create the local database schema:
```bash
python mahakal_telecom/manage.py migrate
```

### 3. Start Development Server
Run the local server:
```bash
python mahakal_telecom/manage.py runserver
```
Visit the website at `http://127.0.0.1:8000/`.

---

## 🚀 Deploying to Render.com

This project is fully configured and ready for deployment on **Render**:

### Render Web Service Settings

* **Runtime**: `Python`
* **Build Command**: `./build.sh` (This shell script automatically installs dependencies, runs database migrations, and collects static files).
* **Start Command**: `gunicorn --chdir mahakal_telecom mahakal_telecom.wsgi` (Uses Gunicorn to run the WSGI application).

### Environment Variables on Render
Add the following key-value pairs in the **Environment** settings tab on Render:
* `SECRET_KEY`: *[Your custom random security key]*
* `DEBUG`: `False`
* `ALLOWED_HOSTS`: `your-render-subdomain.onrender.com` (Or `*` to allow all domains)
