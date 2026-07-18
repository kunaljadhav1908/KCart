from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth.models import User
# from .serializers import RegisterSerializer, UserSerializer
from rest_framework import viewsets
from .serializers import UserRegistrationSerializer, UserSerializer
from rest_framework import status
from .models import Product, Category, CartItem, Cart, Order, OrderItem
from .serializers import ProductSerializer, CategorySerializer, CartSerializer, CartItemSerializer, OrderSerializer, OrderAdminSerializer


@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    if not product_id:
        return Response({'error': 'product_id is required'}, status=400)
    try:
        quantity = int(request.data.get('quantity', 1))
    except (TypeError, ValueError):
        return Response({'error': 'Invalid quantity'}, status=400)
    if quantity < 1:
        return Response({'error': 'Quantity must be at least 1'}, status=400)
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)
    cart, _ = Cart.objects.get_or_create(user=request.user)
    item, created = CartItem.objects.get_or_create(
        cart=cart, product=product, defaults={'quantity': quantity}
    )
    if not created:
        item.quantity += quantity
        item.save()
    return Response({'message': 'Product added to cart', 'cart': CartSerializer(cart).data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')

    if not item_id or quantity is None:
        return Response({'error': 'Item ID and quantity are required'}, status=400)
    try:
        quantity = int(quantity)
    except (TypeError, ValueError):
        return Response({'error': 'Invalid quantity'}, status=400)
    try:
        item = CartItem.objects.get(id=item_id, cart__user=request.user)
        if quantity < 1:
            item.delete()
            cart = Cart.objects.get(user=request.user)
            return Response(CartSerializer(cart).data)
        item.quantity = quantity
        item.save()
        return Response(CartSerializer(item.cart).data)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    item_id = request.data.get('item_id')
    if not item_id:
        return Response({'error': 'item_id is required'}, status=400)
    deleted, _ = CartItem.objects.filter(id=item_id, cart__user=request.user).delete()
    if not deleted:
        return Response({'error': 'Cart item not found'}, status=404)
    cart, _ = Cart.objects.get_or_create(user=request.user)
    return Response(CartSerializer(cart).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = request.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        email = data.get('email', request.user.email)
        payment_method = data.get('payment_method','Cash on Delivery')

        # Validate name
        if not name or len(name.strip()) < 2:
            return Response({'error': 'Please provide a valid name'}, status=400)

        # Validate address
        if not address or len(address.strip()) < 5:
            return Response({'error': 'Please provide a valid address'}, status=400)

        # Validate phone number
        if not phone or not phone.isdigit() or len(phone) != 10:
            return Response({'error': 'Invalid phone number (must be 10 digits)'}, status=400)

        # Get the user's cart
        cart , created = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=400)
        
        total_price = sum(item.product.price * item.quantity for item in cart.items.all())

        order = Order.objects.create(
            user = request.user, 
            total_amount=total_price,
            shipping_address=address,
            customer_name=name,
            customer_email=email,
            customer_phone=phone,
            payment_status='completed' if payment_method == 'Cash on Delivery' else 'pending'
        ) 
        
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

        # Clear the cart after creating the order
        cart.items.all().delete()
        return Response({'message': 'Order created successfully', 'order_id': order.id}, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=500)



    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    """Get orders for the logged-in user"""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_orders(request):
    """Get all orders (admin only)"""
    orders = Order.objects.all().order_by('-created_at')
    serializer = OrderAdminSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def update_order_status(request, order_id):
    """Update order status (admin only)"""
    try:
        order = Order.objects.get(id=order_id)
        status = request.data.get('status')
        if status not in ['pending', 'processing', 'shipped', 'delivered', 'cancelled']:
            return Response({'error': 'Invalid status'}, status=400)
        order.order_status = status
        order.save()
        return Response({'message': 'Order status updated', 'order': OrderAdminSerializer(order).data})
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
