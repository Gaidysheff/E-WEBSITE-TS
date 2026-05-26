from django.contrib import admin, messages
from django.utils.safestring import mark_safe
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
    DeliveryOption,
    Brand,
    Color,
    PricePresets,
)


class nameSlugAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "slug",
                    "brand",
                    "category",
                    "price",
                )
            },
        ),
        (
            "ИЗОБРАЖЕНИЕ",
            {
                "fields": (
                    "image",
                    "icon_image",
                )
            },
        ),
        (
            "СВОЙСТВА",
            {
                "fields": (
                    "shape",
                    "color",
                    "gender",
                )
            },
        ),
        (
            "ПРОЧЕЕ",
            {
                "fields": (
                    "is_available",
                    "featured",
                    "carousel",
                )
            },
        ),
    )
    list_display = [
        "id",
        "name",
        "icon_image",
        # "image",
        "brand",
        "price",
        "featured",
        "carousel",
        "category",
        "shape",
        "color",
        "gender",
        "is_available",
        "brief_info",
    ]
    prepopulated_fields = {"slug": ("name",)}
    list_display_links = [
        "id",
        "name",
    ]
    ordering = [
        "-id",
    ]
    list_editable = [
        "is_available",
        "price",
    ]
    list_per_page = 20
    actions = ["set_available", "set_out_of_stock"]
    search_fields = [
        "name",
        "brand__name",
    ]
    list_filter = [
        "brand",
        "category",
        "is_available",
    ]
    readonly_fields = [
        "icon_image",
    ]
    save_on_top = True

    @admin.display(description="Инфо о товаре", ordering="description")
    def brief_info(self, product: Product):
        return f"Описание содержит {len(product.description)} символов"

    @admin.action(description='Изменить статус на "в наличии"')
    def set_available(self, request, queryset):
        count = queryset.update(is_available=Product.Status.AVAILABLE)
        self.message_user(request, f"Изменено {count} записей.")

    @admin.action(description='Изменить статус на "нет в наличии"')
    def set_out_of_stock(self, request, queryset):
        count = queryset.update(is_available=Product.Status.OUT)
        self.message_user(request, f"Изменено {count} записей.", messages.WARNING)

    @admin.display(description="Фото", ordering="name")
    def icon_image(self, item: Product):
        if item.image:
            return mark_safe(f"<img src='{item.image.url}' height=50>")
        return "Без фото"


# admin.site.register(Product, ProductAdmin)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "image"]
    prepopulated_fields = {"slug": ("name",)}


# admin.site.register(Category, CategoryAdmin)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["id", "product", "rating", "review", "created", "updated"]


# admin.site.register(Review, ReviewAdmin)


@admin.register(ProductRating)
class ProductRatingAdmin(admin.ModelAdmin):
    list_display = ("product", "average_rating", "total_reviews")


# admin.site.register(ProductRating, ProductRatingAdmin)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "cart_code",
        "user",
    )


# admin.site.register(Cart, CartAdmin)


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("id", "cart", "product", "quantity")


# admin.site.register(CartItem, CartItemAdmin)


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ("user", "product")


# admin.site.register(Wishlist, WishlistAdmin)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "checkout_id",
        # "stripe_checkout_id",
        "amount",
        "currency",
        "customer_email",
        "status",
        "created_at",
    )


# admin.site.register(Order, OrderAdmin)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "product",
        "quantity",
    )


# admin.site.register(OrderItem, OrderItemAdmin)


@admin.register(CustomerAddress)
class CustomerAddressAdmin(admin.ModelAdmin):
    list_display = (
        "customer",
        "street",
        "state",
        "city",
        "phone",
    )


# admin.site.register(CustomerAddress, CustomerAddressAdmin)


@admin.register(DeliveryOption)
class DeliveryOptionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "description",
        "icon",
        "price",
        "is_active",
        "is_pickup",
        "order",
    )


# admin.site.register(DeliveryOption, DeliveryOptionAdmin)


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    fields = [
        "name",
        "slug",
    ]
    list_display = [
        "id",
        "name",
        "slug",
    ]
    list_display_links = [
        "id",
        "name",
    ]


@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    fields = [
        "name",
        "color_code",
    ]
    list_display = [
        "id",
        "name",
        "color_code",
    ]
    list_display_links = [
        "id",
        "name",
        "color_code",
    ]


@admin.register(PricePresets)
class PricePresetsAdmin(admin.ModelAdmin):
    fields = [
        "label",
        "min_price",
        "max_price",
        "order",
    ]
    list_display = [
        "id",
        "label",
        "min_price",
        "max_price",
        "order",
    ]
    list_display_links = [
        "label",
    ]
