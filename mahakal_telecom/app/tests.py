from django.test import TestCase
from django.urls import reverse
from app.models import Product

class CatalogTestCase(TestCase):
    def setUp(self):
        # Create a sample product
        self.product = Product.objects.create(
            slug="test-phone-1",
            brand="TestBrand",
            model="TestModel",
            ram="8GB",
            storage="256GB",
            color="Red",
            price=20000,
            old_price=25000,
            discount=5000,
            condition="Excellent",
            availability="available",
            warranty="7 Days Warranty",
            description="Test Description",
            category="iPhone"
        )

    def test_products_js_endpoint(self):
        url = reverse('products_js')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/javascript')
        self.assertContains(response, 'const products =')
        self.assertContains(response, 'test-phone-1')

    def test_admin_dashboard_redirects_unauthenticated(self):
        url = reverse('admin_dashboard')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.url.startswith(reverse('admin_login')))
