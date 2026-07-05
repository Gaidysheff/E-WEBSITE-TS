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
    CurrencyRate,
)
from modeltranslation.admin import TranslationAdmin


class nameSlugAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(TranslationAdmin):
    # class ProductAdmin(admin.ModelAdmin):
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
                    "description",
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


@admin.register(Category)
class CategoryAdmin(TranslationAdmin):
    # class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "slug",
        "icon_image",
    ]
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = [
        "icon_image",
    ]

    @admin.display(description="Иконка", ordering="name")
    def icon_image(self, item: Category):
        if item.image:
            return mark_safe(f"<img src='{item.image.url}' height=25>")
        return "Без фото"


@admin.register(Review)
class ReviewAdmin(TranslationAdmin):
    # class ReviewAdmin(admin.ModelAdmin):
    list_display = [
        "product",
        "rating",
        "user",
        "review",
        "created",
        "updated",
    ]
    list_display_links = [
        "product",
        "user",
        "review",
    ]
    readonly_fields = [
        "product",
        "user",
        "rating",
        "review",
        "created",
        "updated",
    ]
    list_filter = [
        "product",
        "user",
    ]


@admin.register(ProductRating)
class ProductRatingAdmin(admin.ModelAdmin):
    list_display = [
        "product",
        "average_rating",
        "total_reviews",
    ]
    readonly_fields = [
        "product",
        "average_rating",
        "total_reviews",
    ]


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "cart_code",
        "user",
    ]
    readonly_fields = [
        "id",
        "cart_code",
        "user",
    ]
    list_display_links = [
        "id",
        "cart_code",
    ]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "cart",
        "product",
        "quantity",
    ]
    readonly_fields = [
        "id",
        "cart",
        "product",
        "quantity",
    ]
    list_display_links = [
        "id",
        "cart",
    ]


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "product",
        "created",
    ]
    readonly_fields = [
        "user",
        "product",
        "created",
    ]
    list_filter = [
        "user",
        "product",
    ]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "checkout_id",
        # "stripe_checkout_id",
        "amount",
        "currency",
        "customer_email",
        "status",
        "created_at",
    ]
    readonly_fields = [
        "checkout_id",
        "amount",
        "currency",
        "customer_email",
        "status",
        "created_at",
    ]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = [
        "order",
        "product",
        "quantity",
    ]
    readonly_fields = [
        "order",
        "product",
        "quantity",
    ]


@admin.register(CustomerAddress)
class CustomerAddressAdmin(admin.ModelAdmin):
    list_display = [
        "street",
        "house",
        "apartment",
        "city",
        "zip",
        "region",
        "state",
    ]
    readonly_fields = [
        "street",
        "house",
        "apartment",
        "city",
        "zip",
        "region",
        "state",
    ]
    list_filter = [
        "city",
    ]


@admin.register(DeliveryOption)
class DeliveryOptionAdmin(TranslationAdmin):
    # class DeliveryOptionAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "icon_image",
        # "icon",
        "description",
        "price",
        "is_active",
        "is_pickup",
        "order",
    ]
    list_editable = [
        "order",
    ]
    readonly_fields = [
        "icon_image",
    ]
    fieldsets = [
        (
            None,
            {
                "fields": (
                    "name",
                    "description",
                    "price",
                    "is_active",
                    "is_pickup",
                    "order",
                )
            },
        ),
        (
            None,
            {
                "fields": (
                    "icon",
                    "icon_image",
                )
            },
        ),
    ]

    @admin.display(description="Иконка", ordering="name")
    def icon_image(self, item: DeliveryOption):
        if item.icon:
            return mark_safe(f"<img src='{item.icon.url}' height=25>")
        return "Без фото"


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}
    list_display = [
        "name",
        "slug",
    ]
    list_display_links = [
        "name",
    ]


@admin.register(Color)
class ColorAdmin(TranslationAdmin):
    # class ColorAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "color_code",
    ]
    list_display_links = [
        "name",
        "color_code",
    ]


@admin.register(PricePresets)
class PricePresetsAdmin(admin.ModelAdmin):
    list_display = [
        "label",
        "min_price",
        "max_price",
        "order",
    ]
    list_display_links = [
        "label",
    ]
    list_editable = [
        "order",
    ]


@admin.register(CurrencyRate)
class CurrencyRateAdmin(admin.ModelAdmin):
    list_display = [
        "code",
        "rate",
        "updated_at",
    ]
    list_display_links = [
        "code",
        "rate",
        "updated_at",
    ]
    readonly_fields = [
        "code",
        "rate",
        "updated_at",
    ]
