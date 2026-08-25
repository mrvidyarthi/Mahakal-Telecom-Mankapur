import os
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from app.models import Product, ProductImage

PRODUCTS_DATA = [
  {
    "id": "iphone-13-blue-128",
    "brand": "Apple",
    "model": "iPhone 13",
    "ram": "4GB",
    "storage": "128GB",
    "color": "Blue",
    "price": 29999,
    "oldPrice": 34999,
    "discount": 5000,
    "condition": "Excellent",
    "batteryHealth": 89,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/iphone13.jpg"
    ],
    "description": "Superb condition pre-owned iPhone 13. Face ID, TrueTone, and all sensors working 100%. Very minor hairline scratch on the side frame, back panel and display are completely scratch-free. Includes original brand box and compatible fast charger.",
    "category": "iPhone"
  },
  {
    "id": "samsung-s23-black-128",
    "brand": "Samsung",
    "model": "Galaxy S23 5G",
    "ram": "8GB",
    "storage": "128GB",
    "color": "Phantom Black",
    "price": 31999,
    "oldPrice": 38999,
    "discount": 7000,
    "condition": "Excellent",
    "batteryHealth": 92,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/samsung_s23.jpg"
    ],
    "description": "Premium flagship device with Snapdragon 8 Gen 2. Excellent cosmetics, looking almost brand new. 120Hz Dynamic AMOLED display works flawlessly. Camera quality is top-tier. Comes with retail box and Type-C cable.",
    "category": "Samsung"
  },
  {
    "id": "oneplus-11r-silver-128",
    "brand": "OnePlus",
    "model": "11R 5G",
    "ram": "8GB",
    "storage": "128GB",
    "color": "Galactic Silver",
    "price": 22999,
    "oldPrice": 26999,
    "discount": 4000,
    "condition": "Good",
    "batteryHealth": 88,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/oneplus_11r.jpg"
    ],
    "description": "Smooth performance with Snapdragon 8+ Gen 1. Displays minor signs of daily usage on sides, but screen is pristine. Fast charging supported, charger included in box. Clean unit.",
    "category": "OnePlus"
  },
  {
    "id": "moto-edge50-fusion-blue-128",
    "brand": "Motorola",
    "model": "Edge 50 Fusion",
    "ram": "8GB",
    "storage": "128GB",
    "color": "Marshmallow Blue",
    "price": 14499,
    "oldPrice": 17999,
    "discount": 3500,
    "condition": "Excellent",
    "batteryHealth": 95,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/moto_edge.jpg"
    ],
    "description": "Stunning vegan leather back variant. Looks extremely premium with curved pOLED display. Barely used, immaculate condition. Complete box kit available.",
    "category": "Motorola"
  },
  {
    "id": "vivo-v27-blue-128",
    "brand": "Vivo",
    "model": "V27 5G",
    "ram": "8GB",
    "storage": "128GB",
    "color": "Magic Blue",
    "price": 17999,
    "oldPrice": 21999,
    "discount": 4000,
    "condition": "Good",
    "batteryHealth": 87,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": False,
    "charger": True,
    "images": [
      "/media/products/vivo_v27.jpg"
    ],
    "description": "Color changing glass back. Device is in clean condition with normal usage scuffs near the charging port. Aura light and cameras working perfectly. Supplied with charger.",
    "category": "Vivo"
  },
  {
    "id": "redmi-note12pro-black-128",
    "brand": "Xiaomi",
    "model": "Redmi Note 12 Pro 5G",
    "ram": "8GB",
    "storage": "128GB",
    "color": "Onyx Black",
    "price": 13999,
    "oldPrice": 16999,
    "discount": 3000,
    "condition": "Good",
    "batteryHealth": 89,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": False,
    "images": [
      "/media/products/moto_edge.jpg"
    ],
    "description": "Great budget performance with Dimensity 1080. AMOLED display is smooth and responsive. Minor scratches on back glass. Comes with retail box.",
    "category": "Xiaomi"
  },
  {
    "id": "iphone-12-white-128",
    "brand": "Apple",
    "model": "iPhone 12",
    "ram": "4GB",
    "storage": "128GB",
    "color": "White",
    "price": 21999,
    "oldPrice": 26999,
    "discount": 5000,
    "condition": "Excellent",
    "batteryHealth": 84,
    "availability": "sold",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/iphone12.jpg"
    ],
    "description": "Very clean iPhone 12. Screen replaced with high-quality original certified panel (Face ID active). Fully functional. Sold to Mankapur customer.",
    "category": "iPhone"
  },
  {
    "id": "oneplus-nord2-gray-128",
    "brand": "OnePlus",
    "model": "Nord 2 5G",
    "ram": "8GB",
    "storage": "128GB",
    "color": "Gray Sierra",
    "price": 12999,
    "oldPrice": 15999,
    "discount": 3000,
    "condition": "Good",
    "batteryHealth": 85,
    "availability": "sold",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/oneplus_11r.jpg"
    ],
    "description": "Popular midranger. Dual SIM, excellent performance. Minor pocket wear signs. Sold locally in Gonda.",
    "category": "OnePlus"
  },
  {
    "id": "samsung-s21fe-lavender-128",
    "brand": "Samsung",
    "model": "Galaxy S21 FE 5G",
    "ram": "8GB",
    "storage": "128GB",
    "color": "Lavender",
    "price": 15999,
    "oldPrice": 19999,
    "discount": 4000,
    "condition": "Good",
    "batteryHealth": 86,
    "availability": "sold",
    "warranty": "7 Days Checking Warranty",
    "box": False,
    "charger": True,
    "images": [
      "/media/products/samsung_s23.jpg"
    ],
    "description": "Exynos 2100 variant, lavender edition. Excellent cameras and crisp AMOLED display. Device had mild edge scuffs. Sold out.",
    "category": "Samsung"
  },
  {
    "id": "iphone-14pro-gold-128",
    "brand": "Apple",
    "model": "iPhone 14 Pro",
    "ram": "6GB",
    "storage": "128GB",
    "color": "Gold",
    "price": 54999,
    "oldPrice": 62999,
    "discount": 8000,
    "condition": "Excellent",
    "batteryHealth": 90,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/iphone14pro.jpg"
    ],
    "description": "Stunning gold color iPhone 14 Pro. Dynamic Island and screen are spotless. Includes premium cases, box and fast charging cable. Under checking warranty.",
    "category": "iPhone"
  },
  {
    "id": "nothing-phone2-grey-256",
    "brand": "Nothing",
    "model": "Phone (2)",
    "ram": "12GB",
    "storage": "256GB",
    "color": "Dark Grey",
    "price": 25999,
    "oldPrice": 29999,
    "discount": 4000,
    "condition": "Excellent",
    "batteryHealth": 93,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/nothing_phone2.jpg"
    ],
    "description": "Unique Glyph interface phone. Top-tier specs (12GB/256GB). Absolutely scratch-less screen. Includes transparent protective cover, box, and original charging cable.",
    "category": "Nothing"
  },
  {
    "id": "samsung-ultra22-burgundy-256",
    "brand": "Samsung",
    "model": "Galaxy S22 Ultra 5G",
    "ram": "12GB",
    "storage": "256GB",
    "color": "Burgundy",
    "price": 39999,
    "oldPrice": 46999,
    "discount": 7000,
    "condition": "Excellent",
    "batteryHealth": 88,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/samsung_s23.jpg"
    ],
    "description": "S-Pen working seamlessly. Exceptional zoom camera. The body has extremely light frame spots, but overall feels highly premium. Battery and screen checked and 100% fine.",
    "category": "Samsung"
  },
  {
    "id": "realme-11pro-gold-128",
    "brand": "Realme",
    "model": "Realme 11 Pro+",
    "ram": "12GB",
    "storage": "256GB",
    "color": "Sunrise Beige",
    "price": 16999,
    "oldPrice": 19999,
    "discount": 3000,
    "condition": "Good",
    "batteryHealth": 91,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/moto_edge.jpg"
    ],
    "description": "Designed by Matteo Menotto, with gorgeous faux leather finish and gold sewing details. 200MP camera works beautifully. Minor leather rubbing at the bottom, overall clean.",
    "category": "Realme"
  },
  {
    "id": "oppo-reno10-blue-256",
    "brand": "Oppo",
    "model": "Reno10 Pro 5G",
    "ram": "12GB",
    "storage": "256GB",
    "color": "Glossy Purple",
    "price": 21999,
    "oldPrice": 25999,
    "discount": 4000,
    "condition": "Excellent",
    "batteryHealth": 90,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/vivo_v27.jpg"
    ],
    "description": "Curved display and professional portrait camera. No dent, no scratches on the frame. Looks new. Original box kit included.",
    "category": "Oppo"
  },
  {
    "id": "poco-x5pro-yellow-128",
    "brand": "Poco",
    "model": "Poco X5 Pro 5G",
    "ram": "8GB",
    "storage": "128GB",
    "color": "Poco Yellow",
    "price": 12499,
    "oldPrice": 15499,
    "discount": 3000,
    "condition": "Good",
    "batteryHealth": 88,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": False,
    "images": [
      "/media/products/oneplus_11r.jpg"
    ],
    "description": "Excellent processing for gaming. Custom signature Poco Yellow body is in good cosmetic condition. Very minor usage wear on buttons.",
    "category": "Poco"
  },
  {
    "id": "vivo-y75-black-128",
    "brand": "Vivo",
    "model": "Y75 5G",
    "ram": "8GB",
    "storage": "128GB",
    "color": "Glowing Galaxy",
    "price": 9999,
    "oldPrice": 11999,
    "discount": 2000,
    "condition": "Fair",
    "batteryHealth": 83,
    "availability": "sold",
    "warranty": "7 Days Checking Warranty",
    "box": False,
    "charger": True,
    "images": [
      "/media/products/vivo_v27.jpg"
    ],
    "description": "Fair condition budget Vivo phone. Has visible wear on back panel and side bezel, but internally fully functional. Sold as a value option.",
    "category": "Vivo"
  },
  {
    "id": "oppo-reno8-shimmer-128",
    "brand": "Oppo",
    "model": "Reno 8 5G",
    "ram": "8GB",
    "storage": "128GB",
    "color": "Shimmer Gold",
    "price": 13999,
    "oldPrice": 16999,
    "discount": 3000,
    "condition": "Good",
    "batteryHealth": 86,
    "availability": "sold",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/moto_edge.jpg"
    ],
    "description": "Sleek portrait phone. Minor lint marks on frame. Replaced battery with certified OEM part. Fully operational and sold.",
    "category": "Oppo"
  },
  {
    "id": "iphone-15-black-128",
    "brand": "Apple",
    "model": "iPhone 15",
    "ram": "6GB",
    "storage": "128GB",
    "color": "Black",
    "price": 49999,
    "oldPrice": 56999,
    "discount": 7000,
    "condition": "Excellent",
    "batteryHealth": 98,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/iphone15.jpg"
    ],
    "description": "Stunning condition iPhone 15. USB-C port, Dynamic Island, and 48MP main camera. 98% battery health. Comes with original packaging box and charger cable.",
    "category": "iPhone"
  },
  {
    "id": "oneplus-10pro-green-256",
    "brand": "OnePlus",
    "model": "10 Pro 5G",
    "ram": "12GB",
    "storage": "256GB",
    "color": "Emerald Forest",
    "price": 24999,
    "oldPrice": 29999,
    "discount": 5000,
    "condition": "Good",
    "batteryHealth": 89,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/oneplus_11r.jpg"
    ],
    "description": "Haselblad camera flagship from OnePlus. Highly premium green back finish. Features 12GB of RAM for supreme speed. Minor wear on corner bumpers.",
    "category": "OnePlus"
  },
  {
    "id": "samsung-s22-white-128",
    "brand": "Samsung",
    "model": "Galaxy S22 5G",
    "ram": "8GB",
    "storage": "128GB",
    "color": "Phantom White",
    "price": 23999,
    "oldPrice": 27999,
    "discount": 4000,
    "condition": "Excellent",
    "batteryHealth": 90,
    "availability": "available",
    "warranty": "7 Days Checking Warranty",
    "box": True,
    "charger": True,
    "images": [
      "/media/products/samsung_s23.jpg"
    ],
    "description": "Compact flagship experience. Flawless cosmetic shape. No scuffs, no glass issues. Supplied with original box and cable.",
    "category": "Samsung"
  }
]

class Command(BaseCommand):
    help = 'Migrate hardcoded JS product data to dynamic DB records and set up superuser account'

    def handle(self, *args, **options):
        # 1. Create superuser
        self.stdout.write(self.style.WARNING("Checking admin user..."))
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword')
            self.stdout.write(self.style.SUCCESS("Programmatically created staff superuser account 'admin' with password 'adminpassword'"))
        else:
            self.stdout.write("Staff user 'admin' already exists.")

        # 2. Migrate products
        self.stdout.write(self.style.WARNING("Migrating catalog products..."))
        # Clear existing to avoid duplicate key errors
        Product.objects.all().delete()
        
        for item in PRODUCTS_DATA:
            p = Product.objects.create(
                slug=item["id"],
                brand=item["brand"],
                model=item["model"],
                ram=item["ram"],
                storage=item["storage"],
                color=item["color"],
                price=item["price"],
                old_price=item["oldPrice"],
                discount=item["discount"],
                condition=item["condition"],
                battery_health=item["batteryHealth"],
                availability=item["availability"],
                warranty=item["warranty"],
                box=item["box"],
                charger=item["charger"],
                description=item["description"],
                category=item["category"]
            )
            
            for img in item["images"]:
                # strip out /media/ if present
                clean_img_path = img.replace("/media/", "")
                ProductImage.objects.create(
                    product=p,
                    image=clean_img_path
                )
            
            self.stdout.write(self.style.SUCCESS(f"Imported product: {p}"))
            
        self.stdout.write(self.style.SUCCESS("All products successfully seeded in the database!"))
