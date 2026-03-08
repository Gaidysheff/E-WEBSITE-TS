from django.contrib import admin
from .models import (
    Cart,
    CartItem,
    Category,
    Order,
    OrderItem,
    Product,
    ProductRating,
    Review,
    Wishlist,
    CustomerAddress,
)


class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "price",
        "featured",
        "carousel",
    ]
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(Product, ProductAdmin)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "image"]
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(Category, CategoryAdmin)


class ReviewAdmin(admin.ModelAdmin):
    list_display = ["id", "product", "rating", "review", "created", "updated"]


admin.site.register(Review, ReviewAdmin)


class ProductRatingAdmin(admin.ModelAdmin):
    list_display = ("product", "average_rating", "total_reviews")


admin.site.register(ProductRating, ProductRatingAdmin)


class CartAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "cart_code",
        "user",
    )


admin.site.register(Cart, CartAdmin)


class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "cart", "product", "quantity")


admin.site.register(CartItem, CartItemAdmin)


class WishlistAdmin(admin.ModelAdmin):
    list_display = ("user", "product")


admin.site.register(Wishlist, WishlistAdmin)


class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "stripe_checkout_id",
        "amount",
        "currency",
        "customer_email",
        "status",
        "created_at",
    )


admin.site.register(Order, OrderAdmin)


class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "product",
        "quantity",
    )


admin.site.register(OrderItem, OrderItemAdmin)


class CustomerAddressAdmin(admin.ModelAdmin):
    list_display = (
        "customer",
        "street",
        "state",
        "city",
        "phone",
    )


admin.site.register(CustomerAddress, CustomerAddressAdmin)
