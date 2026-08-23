from django.shortcuts import render

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


