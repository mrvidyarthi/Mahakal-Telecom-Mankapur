from django.contrib import admin
from .models import Product, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('brand', 'model', 'category', 'price', 'availability')
    list_filter = ('brand', 'category', 'availability')
    search_fields = ('brand', 'model', 'slug')
    inlines = [ProductImageInline]

admin.site.register(ProductImage)
