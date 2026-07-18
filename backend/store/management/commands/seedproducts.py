from django.core.management.base import BaseCommand
from store.models import Product, Category
import random

class Command(BaseCommand):
    help = 'Seed the database with realistic products'

    def handle(self, *args, **options):
        # Clear existing products (optional)
        # Product.objects.all().delete()
        # Category.objects.all().delete()
        
        # Define categories
        category_data = {
            'Electronics': 'Laptops, phones, tablets, and accessories',
            'Fashion': 'Clothing, accessories, and apparel',
            'Shoes': 'Sneakers, boots, heels, and sandals',
            'Watches': 'Smartwatches and traditional timepieces',
            'Grocery': 'Food, beverages, and household items',
            'Beauty': 'Skincare, cosmetics, and personal care',
            'Home & Kitchen': 'Furniture, decor, and kitchenware',
            'Furniture': 'Chairs, tables, beds, and storage',
            'Sports': 'Equipment, apparel, and accessories',
            'Books': 'Fiction, non-fiction, and educational books'
        }
        
        categories = {}
        for name, description in category_data.items():
            cat, _ = Category.objects.get_or_create(
                name=name,
                defaults={'description': name.lower().replace(' ', '-')}
            )
            categories[name] = cat
        
        # Define realistic products
        products_data = [
            # Electronics
            ('MacBook Pro 14"', 'High-performance laptop for professionals', 'Electronics', 1999.99, 10, 4.8, 'Apple', 5),
            ('Dell XPS 13', 'Compact ultrabook with stunning display', 'Electronics', 999.99, 15, 4.6, 'Dell', 8),
            ('iPhone 15 Pro', 'Latest iPhone with advanced camera', 'Electronics', 1199.99, 20, 4.9, 'Apple', 12),
            ('Samsung Galaxy S24', 'Flagship Android smartphone', 'Electronics', 999.99, 25, 4.7, 'Samsung', 15),
            ('iPad Air', 'Versatile tablet for work and creativity', 'Electronics', 599.99, 18, 4.5, 'Apple', 10),
            ('Sony WH-1000XM5', 'Premium noise-cancelling headphones', 'Electronics', 399.99, 30, 4.8, 'Sony', 20),
            ('Samsung QLED 55"', 'Ultra HD smart TV', 'Electronics', 1499.99, 8, 4.6, 'Samsung', 18),
            ('DJI Mini 3 Pro', 'Compact drone for photography', 'Electronics', 749.99, 12, 4.7, 'DJI', 25),
            ('Apple Watch Series 9', 'Advanced fitness and health tracking', 'Electronics', 399.99, 22, 4.5, 'Apple', 30),
            ('Google Pixel 8', 'AI-powered smartphone', 'Electronics', 799.99, 20, 4.6, 'Google', 16),
            
            # Fashion
            ('Designer Leather Jacket', 'Premium black leather jacket', 'Fashion', 299.99, 12, 4.7, 'Armani', 8),
            ('Casual Cotton T-Shirt', 'Comfortable everyday t-shirt', 'Fashion', 29.99, 100, 4.3, 'H&M', 2),
            ('Business Formal Blazer', 'Professional blazer for the office', 'Fashion', 149.99, 25, 4.4, 'Zara', 5),
            ('Vintage Denim Jeans', 'Classic blue jeans with style', 'Fashion', 79.99, 50, 4.5, 'Levi', 10),
            ('Silk Evening Gown', 'Elegant floor-length dress', 'Fashion', 249.99, 8, 4.8, 'Calvin Klein', 15),
            ('Wool Sweater', 'Cozy winter sweater', 'Fashion', 59.99, 40, 4.6, 'Gap', 12),
            ('Linen Summer Dress', 'Light and breezy summer wear', 'Fashion', 69.99, 35, 4.4, 'Uniqlo', 8),
            ('Smart Casual Shirt', 'Versatile shirt for any occasion', 'Fashion', 49.99, 60, 4.5, 'Banana Republic', 6),
            
            # Shoes
            ('Nike Air Max 90', 'Classic running sneakers', 'Shoes', 129.99, 45, 4.7, 'Nike', 8),
            ('Adidas Ultraboost', 'Premium running shoes', 'Shoes', 179.99, 38, 4.6, 'Adidas', 12),
            ('Red Leather Heels', 'Elegant high heels', 'Shoes', 119.99, 20, 4.5, 'Jimmy Choo', 18),
            ('Combat Boots', 'Rugged military-style boots', 'Shoes', 159.99, 25, 4.4, 'Dr. Martens', 10),
            ('Casual Loafers', 'Comfortable slip-on shoes', 'Shoes', 89.99, 55, 4.3, 'Cole Haan', 5),
            ('Beach Sandals', 'Lightweight summer sandals', 'Shoes', 39.99, 80, 4.2, 'Birkenstock', 3),
            ('Running Trail Shoes', 'Off-road running shoes', 'Shoes', 139.99, 30, 4.6, 'Salomon', 15),
            ('Formal Oxford Shoes', 'Professional dress shoes', 'Shoes', 159.99, 20, 4.5, 'Allen Edmonds', 12),
            
            # Watches
            ('Rolex Submariner', 'Luxury dive watch', 'Watches', 9999.99, 2, 4.9, 'Rolex', 50),
            ('Apple Watch Ultra', 'Rugged smartwatch', 'Watches', 799.99, 15, 4.7, 'Apple', 20),
            ('Omega Seamaster', 'Classic diving watch', 'Watches', 5999.99, 3, 4.8, 'Omega', 40),
            ('Seiko Prospex', 'Reliable dive watch', 'Watches', 299.99, 25, 4.6, 'Seiko', 15),
            ('Fitbit Charge 6', 'Fitness tracking watch', 'Watches', 159.99, 50, 4.5, 'Fitbit', 8),
            ('Garmin Fenix 7', 'Advanced sports watch', 'Watches', 699.99, 12, 4.7, 'Garmin', 25),
            
            # Grocery
            ('Organic Coffee Beans', '1kg premium coffee', 'Grocery', 24.99, 100, 4.6, 'Lavazza', 3),
            ('Whole Wheat Bread Mix', 'Homemade bread mix', 'Grocery', 8.99, 150, 4.3, 'Bob Red Mill', 2),
            ('Extra Virgin Olive Oil', '500ml premium oil', 'Grocery', 19.99, 80, 4.7, 'Bertolli', 5),
            ('Organic Honey', '500g pure honey', 'Grocery', 14.99, 120, 4.8, 'Manuka', 6),
            ('Dark Chocolate Bars', '85% cacao', 'Grocery', 12.99, 200, 4.5, 'Lindt', 2),
            
            # Beauty
            ('Face Moisturizer', 'Hydrating daily cream', 'Beauty', 49.99, 60, 4.6, 'Clinique', 8),
            ('Anti-Aging Serum', 'Premium skin serum', 'Beauty', 79.99, 40, 4.7, 'Estée Lauder', 12),
            ('Lipstick Palette', '12-color lipstick set', 'Beauty', 39.99, 70, 4.4, 'MAC', 5),
            ('Hair Shampoo & Conditioner', 'Nourishing hair care', 'Beauty', 29.99, 100, 4.5, 'L\'Oréal', 3),
            ('Face Mask Set', 'Skincare masks (5-pack)', 'Beauty', 34.99, 85, 4.3, 'Sheet Mask Co', 4),
            
            # Home & Kitchen
            ('Stainless Steel Cookware Set', '12-piece cookware', 'Home & Kitchen', 199.99, 20, 4.7, 'Calphalon', 15),
            ('Coffee Maker', 'Programmable coffee machine', 'Home & Kitchen', 89.99, 45, 4.5, 'Cuisinart', 8),
            ('Air Fryer', 'Healthy cooking appliance', 'Home & Kitchen', 129.99, 35, 4.6, 'Instant Pot', 12),
            ('Microfiber Towel Set', '6-piece towel set', 'Home & Kitchen', 34.99, 150, 4.4, 'Threshold', 2),
            ('Knife Block Set', '7-piece knife set', 'Home & Kitchen', 79.99, 30, 4.5, 'Wüsthof', 10),
            ('Bamboo Cutting Boards', 'Set of 3', 'Home & Kitchen', 24.99, 100, 4.3, 'Bamboo', 3),
            
            # Furniture
            ('Leather Sectional Sofa', 'L-shaped sofa', 'Furniture', 1299.99, 8, 4.6, 'Ashley', 25),
            ('Adjustable Office Chair', 'Ergonomic chair', 'Furniture', 299.99, 25, 4.5, 'Herman Miller', 15),
            ('Solid Wood Dining Table', 'Seats 6-8 people', 'Furniture', 599.99, 12, 4.7, 'Wayfair', 20),
            ('Platform Bed Frame', 'Queen size bed', 'Furniture', 399.99, 15, 4.4, 'West Elm', 18),
            ('Bookshelf Cabinet', 'Oak wood bookshelf', 'Furniture', 199.99, 20, 4.5, 'IKEA', 8),
            
            # Sports
            ('Professional Yoga Mat', 'Non-slip yoga mat', 'Sports', 49.99, 70, 4.6, 'Liforme', 5),
            ('Dumbell Set', '20kg dumbell set', 'Sports', 129.99, 25, 4.7, 'PowerBlocks', 12),
            ('Resistance Bands', 'Set of 5 bands', 'Sports', 19.99, 120, 4.4, 'TheraBand', 3),
            ('Gym Bag', 'Professional gym bag', 'Sports', 79.99, 50, 4.5, 'Nike', 8),
            ('Water Bottle', '1L stainless steel', 'Sports', 24.99, 150, 4.3, 'Hydro Flask', 2),
            ('Running Belt', 'Lightweight belt', 'Sports', 29.99, 100, 4.2, 'SPI Belt', 2),
            
            # Books
            ('Atomic Habits', 'Build Better Habits by James Clear', 'Books', 19.99, 200, 4.8, 'Penguin', 1),
            ('The Great Gatsby', 'Classic literature', 'Books', 12.99, 150, 4.7, 'Scribner', 1),
            ('Python Programming', 'Learn Python coding', 'Books', 49.99, 80, 4.6, 'Penguin', 2),
            ('Sapiens', 'History of humankind', 'Books', 22.99, 120, 4.7, 'HarperCollins', 1),
            ('The Lean Startup', 'Innovation guide', 'Books', 26.99, 90, 4.5, 'Crown', 1),
        ]
        
        # Create products
        created_count = 0
        for name, description, category_name, price, stock, rating, brand, discount in products_data:
            category = categories[category_name]
            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'Category': category,
                    'description': description,
                    'price': price,
                    'stock': stock,
                    'rating': rating,
                    'brand': brand,
                    'discount': discount,
                }
            )
            if created:
                created_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {created_count} new products'))

