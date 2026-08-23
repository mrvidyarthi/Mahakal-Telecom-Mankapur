from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('index.html', views.index, name='index_html'),
    path('about.html', views.about, name='about'),
    path('android.html', views.android, name='android'),
    path('cart.html', views.cart, name='cart'),
    path('checkout.html', views.checkout, name='checkout'),
    path('contact.html', views.contact, name='contact'),
    path('deals.html', views.deals, name='deals'),
    path('iphone.html', views.iphone, name='iphone'),
    path('mobiles.html', views.mobiles, name='mobiles'),
    path('order-success.html', views.order_success, name='order_success'),
    path('product.html', views.product, name='product'),
    path('sold.html', views.sold, name='sold'),
]
