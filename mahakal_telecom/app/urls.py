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
    
    # Dynamic JS
    path('js/products.js', views.products_js, name='products_js'),
    
    # Admin Panel
    path('admin-panel/login/', views.admin_login_view, name='admin_login'),
    path('admin-panel/logout/', views.admin_logout_view, name='admin_logout'),
    path('admin-panel/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-panel/add/', views.admin_product_create, name='admin_product_create'),
    path('admin-panel/edit/<slug:slug>/', views.admin_product_update, name='admin_product_update'),
    path('admin-panel/delete/<slug:slug>/', views.admin_product_delete, name='admin_product_delete'),
    path('admin-panel/toggle/<slug:slug>/', views.admin_toggle_availability, name='admin_toggle_availability'),
]
