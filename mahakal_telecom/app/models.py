from django.db import models

class Product(models.Model):
    slug = models.SlugField(unique=True, max_length=150)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    ram = models.CharField(max_length=50)
    storage = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    price = models.IntegerField()
    old_price = models.IntegerField()
    discount = models.IntegerField()
    condition = models.CharField(max_length=50)  # Excellent, Good, Fair
    battery_health = models.IntegerField(null=True, blank=True)
    availability = models.CharField(
        max_length=20,
        choices=[('available', 'Available'), ('sold', 'Sold')],
        default='available'
    )
    warranty = models.CharField(max_length=100)
    box = models.BooleanField(default=True)
    charger = models.BooleanField(default=True)
    description = models.TextField()
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.brand} {self.model} ({self.ram}/{self.storage})"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')

    def __str__(self):
        return f"Image for {self.product.brand} {self.product.model}"
