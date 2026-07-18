from rest_framework import serializers
from .models import CartItem, Product, Category, Cart, Order, OrderItem
from django.contrib.auth.models import User

# ------- Category & Product Serializers -------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    Category = CategorySerializer(read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'Category', 'name', 'description', 'price', 'discount', 'stock', 'rating', 'brand', 'image', 'created_at']

# ------- Cart Serializers -------
class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    product_price = serializers.DecimalField(
        source='product.price',
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    product_discount = serializers.IntegerField(source='product.discount', read_only=True)
    product_stock = serializers.IntegerField(source='product.stock', read_only=True)
    product_rating = serializers.DecimalField(
        source='product.rating',
        max_digits=3,
        decimal_places=1,
        read_only=True
    )
    product_brand = serializers.CharField(source='product.brand', read_only=True)
    product_category = serializers.CharField(source='product.Category.name', read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_name', 'product_image', 'product_price', 'product_discount', 'product_stock', 'product_rating', 'product_brand', 'product_category', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'items', 'total']

    def get_total(self, obj):
        return float(obj.total)

# ------- User Serializers -------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password2']
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")
        return data
    def create(self, validated_data):
        username = validated_data['username']
        email = validated_data.get('email', '')
        password = validated_data['password']
        user = User.objects.create_user(username=username, email=email, password=password)
        return user

# ------- Order Serializers -------
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'created_at', 'total_amount', 'payment_status', 'order_status', 'shipping_address', 'items']

class OrderAdminSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'user', 'username', 'customer_name', 'customer_email', 'customer_phone', 'created_at', 'total_amount', 'payment_status', 'order_status', 'shipping_address', 'items']
