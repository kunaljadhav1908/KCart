from decimal import Decimal

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Cart, CartItem, Category, Product


class CartApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="cartuser", password="testpass123")
        self.other = User.objects.create_user(username="other", password="testpass123")
        self.category = Category.objects.create(name="Gadgets", description="gadgets")
        self.product = Product.objects.create(
            Category=self.category,
            name="Test Phone",
            description="A test product",
            price=Decimal("99.99"),
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_add_to_cart_and_get_cart(self):
        response = self.client.post(
            "/api/cart/add/",
            {"product_id": self.product.id, "quantity": 2},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("cart", response.data)
        self.assertEqual(len(response.data["cart"]["items"]), 1)
        self.assertEqual(response.data["cart"]["items"][0]["quantity"], 2)
        self.assertAlmostEqual(float(response.data["cart"]["total"]), 199.98, places=2)

        cart_response = self.client.get("/api/cart/")
        self.assertEqual(cart_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(cart_response.data["items"]), 1)
        self.assertIsInstance(cart_response.data["total"], (int, float))

    def test_update_and_remove_cart_item(self):
        cart = Cart.objects.create(user=self.user)
        item = CartItem.objects.create(cart=cart, product=self.product, quantity=1)

        update_response = self.client.post(
            "/api/cart/update/",
            {"item_id": item.id, "quantity": 3},
            format="json",
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["items"][0]["quantity"], 3)

        remove_response = self.client.post(
            "/api/cart/remove/",
            {"item_id": item.id},
            format="json",
        )
        self.assertEqual(remove_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(remove_response.data["items"]), 0)
        self.assertEqual(float(remove_response.data["total"]), 0.0)

    def test_cannot_update_other_users_cart_item(self):
        other_cart = Cart.objects.create(user=self.other)
        item = CartItem.objects.create(cart=other_cart, product=self.product, quantity=1)

        response = self.client.post(
            "/api/cart/update/",
            {"item_id": item.id, "quantity": 5},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
