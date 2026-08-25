import json
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.db.models import Q
from .models import Product, ProductImage

# Standard public pages
def index(request):
    return render(request, 'app/index.html')

def about(request):
    return render(request, 'app/about.html')

def android(request):
    return render(request, 'app/android.html')

def cart(request):
    return render(request, 'app/cart.html')

def checkout(request):
    return render(request, 'app/checkout.html')

def contact(request):
    return render(request, 'app/contact.html')

def deals(request):
    return render(request, 'app/deals.html')

def iphone(request):
    return render(request, 'app/iphone.html')

def mobiles(request):
    return render(request, 'app/mobiles.html')

def order_success(request):
    return render(request, 'app/order-success.html')

def product(request):
    return render(request, 'app/product.html')

def sold(request):
    return render(request, 'app/sold.html')


# Dynamic JS serving products database
def products_js(request):
    products_qs = Product.objects.all().prefetch_related('images')
    products_list = []
    for p in products_qs:
        images_list = [img.image.url for img in p.images.all()]
        if not images_list:
            images_list = ["/media/products/samsung_s23.jpg"] # fallback image if empty
        
        products_list.append({
            "id": p.slug,
            "brand": p.brand,
            "model": p.model,
            "ram": p.ram,
            "storage": p.storage,
            "color": p.color,
            "price": p.price,
            "oldPrice": p.old_price,
            "discount": p.discount,
            "condition": p.condition,
            "batteryHealth": p.battery_health if p.battery_health is not None else None,
            "availability": p.availability,
            "warranty": p.warranty,
            "box": p.box,
            "charger": p.charger,
            "images": images_list,
            "description": p.description,
            "category": p.category,
        })

    brands_config = [
      { "name": "Apple", "logo": "/media/categories/apple.svg" },
      { "name": "Samsung", "logo": "/media/categories/samsung.svg" },
      { "name": "OnePlus", "logo": "/media/categories/oneplus.svg" },
      { "name": "Motorola", "logo": "/media/categories/motorola.svg" },
      { "name": "Vivo", "logo": "/media/categories/vivo.svg" },
      { "name": "Oppo", "logo": "/media/categories/oppo.svg" },
      { "name": "Realme", "logo": "/media/categories/realme.svg" },
      { "name": "Xiaomi", "logo": "/media/categories/xiaomi.svg" },
      { "name": "Poco", "logo": "/media/categories/poco.svg" },
      { "name": "Nothing", "logo": "/media/categories/nothing.svg" }
    ]

    js_content = f"""
const products = {json.dumps(products_list, indent=2)};
const brandsConfig = {json.dumps(brands_config, indent=2)};

if (typeof module !== 'undefined' && module.exports) {{
  module.exports = {{ products, brandsConfig }};
}} else {{
  window.products = products;
  window.brandsConfig = brandsConfig;
}}
"""
    return HttpResponse(js_content, content_type="application/javascript")


# Custom Staff Decorator
def staff_required(view_func):
    @login_required(login_url='admin_login')
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_staff:
            return redirect('admin_login')
        return view_func(request, *args, **kwargs)
    return _wrapped_view


# Admin Login view
def admin_login_view(request):
    if request.user.is_authenticated and request.user.is_staff:
        return redirect('admin_dashboard')
    
    error = None
    if request.method == 'POST':
        u = request.POST.get('username')
        p = request.POST.get('password')
        user = authenticate(request, username=u, password=p)
        if user is not None:
            if user.is_staff:
                login(request, user)
                return redirect('admin_dashboard')
            else:
                error = "Access Denied: This account does not have staff permissions."
        else:
            error = "Invalid username or password. Please try again."
            
    return render(request, 'app/admin_login.html', {'error': error})


# Admin Logout view
def admin_logout_view(request):
    logout(request)
    return redirect('admin_login')


# Admin Dashboard
@staff_required
def admin_dashboard(request):
    query = request.GET.get('q', '')
    selected_category = request.GET.get('category', '')
    selected_availability = request.GET.get('availability', '')

    products_qs = Product.objects.all().prefetch_related('images').order_by('-id')

    if query:
        products_qs = products_qs.filter(
            Q(brand__icontains=query) |
            Q(model__icontains=query) |
            Q(color__icontains=query) |
            Q(slug__icontains=query)
        )
    if selected_category:
        products_qs = products_qs.filter(category=selected_category)
    if selected_availability:
        products_qs = products_qs.filter(availability=selected_availability)

    # Categories list for filters
    categories = ['iPhone', 'Samsung', 'OnePlus', 'Motorola', 'Vivo', 'Xiaomi', 'Nothing', 'Realme', 'Oppo', 'Poco']

    # Statistics
    all_products = Product.objects.all()
    total_count = all_products.count()
    available_count = all_products.filter(availability='available').count()
    sold_count = all_products.filter(availability='sold').count()

    context = {
        'products': products_qs,
        'query': query,
        'selected_category': selected_category,
        'selected_availability': selected_availability,
        'categories': categories,
        'total_count': total_count,
        'available_count': available_count,
        'sold_count': sold_count,
    }
    return render(request, 'app/admin_dashboard.html', context)


# Admin Toggle Availability
@staff_required
def admin_toggle_availability(request, slug):
    if request.method == 'POST':
        product = get_object_or_404(Product, slug=slug)
        if product.availability == 'available':
            product.availability = 'sold'
        else:
            product.availability = 'available'
        product.save()
    return redirect('admin_dashboard')


# Admin Product Create
@staff_required
def admin_product_create(request):
    categories = ['iPhone', 'Samsung', 'OnePlus', 'Motorola', 'Vivo', 'Xiaomi', 'Nothing', 'Realme', 'Oppo', 'Poco']
    if request.method == 'POST':
        slug = request.POST.get('slug')
        if Product.objects.filter(slug=slug).exists():
            return HttpResponse("Error: Product with this unique ID/Slug already exists.", status=400)
            
        p = Product.objects.create(
            slug=slug,
            brand=request.POST.get('brand'),
            model=request.POST.get('model'),
            ram=request.POST.get('ram'),
            storage=request.POST.get('storage'),
            color=request.POST.get('color'),
            price=request.POST.get('price'),
            old_price=request.POST.get('old_price'),
            discount=request.POST.get('discount'),
            condition=request.POST.get('condition'),
            battery_health=int(request.POST.get('battery_health')) if request.POST.get('battery_health') else None,
            availability=request.POST.get('availability'),
            warranty=request.POST.get('warranty'),
            box=request.POST.get('box') == 'true',
            charger=request.POST.get('charger') == 'true',
            description=request.POST.get('description'),
            category=request.POST.get('category')
        )
        
        images = request.FILES.getlist('uploaded_images')
        for img in images:
            ProductImage.objects.create(product=p, image=img)
            
        return redirect('admin_dashboard')
        
    return render(request, 'app/admin_product_form.html', {
        'categories': categories,
        'is_edit': False
    })


# Admin Product Update
@staff_required
def admin_product_update(request, slug):
    p = get_object_or_404(Product, slug=slug)
    categories = ['iPhone', 'Samsung', 'OnePlus', 'Motorola', 'Vivo', 'Xiaomi', 'Nothing', 'Realme', 'Oppo', 'Poco']
    
    if request.method == 'POST':
        p.brand = request.POST.get('brand')
        p.model = request.POST.get('model')
        p.ram = request.POST.get('ram')
        p.storage = request.POST.get('storage')
        p.color = request.POST.get('color')
        p.price = request.POST.get('price')
        p.old_price = request.POST.get('old_price')
        p.discount = request.POST.get('discount')
        p.condition = request.POST.get('condition')
        p.battery_health = int(request.POST.get('battery_health')) if request.POST.get('battery_health') else None
        p.availability = request.POST.get('availability')
        p.warranty = request.POST.get('warranty')
        p.box = request.POST.get('box') == 'true'
        p.charger = request.POST.get('charger') == 'true'
        p.description = request.POST.get('description')
        p.category = request.POST.get('category')
        p.save()
        
        delete_image_ids = request.POST.getlist('delete_images')
        if delete_image_ids:
            ProductImage.objects.filter(id__in=delete_image_ids, product=p).delete()
            
        images = request.FILES.getlist('uploaded_images')
        for img in images:
            ProductImage.objects.create(product=p, image=img)
            
        return redirect('admin_dashboard')
        
    return render(request, 'app/admin_product_form.html', {
        'product': p,
        'categories': categories,
        'is_edit': True
    })


# Admin Product Delete
@staff_required
def admin_product_delete(request, slug):
    p = get_object_or_404(Product, slug=slug)
    if request.method == 'POST':
        p.delete()
        return redirect('admin_dashboard')
    return render(request, 'app/admin_confirm_delete.html', {'product': p})


