from django.contrib import admin, messages
from django.utils.safestring import mark_safe
from .models import Post, Category, Subscriber
from modeltranslation.admin import TranslationAdmin

# class nameSlugAdmin(admin.ModelAdmin):
#     prepopulated_fields = {"slug": ("title", "name")}


@admin.register(Post)
class PostAdmin(TranslationAdmin):
    list_display = [
        "id",
        "title",
        "slug",
        "text",
        # "image",
        "icon_image",
        "category",
        "created_at",
        "status",
    ]
    prepopulated_fields = {"slug": ("title",)}
    list_display_links = [
        "id",
        "title",
    ]
    ordering = [
        "-created_at",
    ]
    list_editable = [
        "category",
        "status",
    ]
    list_per_page = 10
    # actions = ["set_available", "set_out_of_stock"]
    search_fields = [
        "title",
        "text",
    ]
    list_filter = [
        "category",
        "status",
    ]
    readonly_fields = [
        "icon_image",
    ]
    save_on_top = True

    @admin.display(description="Картинка", ordering="title")
    def icon_image(self, item: Post):
        if item.image:
            return mark_safe(f"<img src='{item.image.url}' height=50>")
        return "Без фото"


@admin.register(Category)
class CategoryAdmin(TranslationAdmin):
    list_display = [
        "id",
        "name",
        "slug",
    ]
    prepopulated_fields = {"slug": ("name",)}
    list_display_links = [
        "id",
        "name",
    ]


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = [
        # "user",
        "get_username",
        "email",
        "lang",
        "is_verified",
        "token",
        "created_at",
        "unsubscribed_at",
        "is_active",
        "duration",
    ]
    readonly_fields = [
        "user",
        "get_username",
        "email",
        "lang",
        "is_verified",
        "token",
        "created_at",
        "unsubscribed_at",
        "is_active",
        "duration",
    ]

    # 2. Описываем метод вытаскивания данных
    @admin.display(description="Пользователь", ordering="user__username")
    def get_username(self, obj):
        # Проверяем, привязан ли юзер (чтобы не упасть в AttributeError, если это гость)
        if obj.user:
            return obj.user.username
        return "Гость"  # То, что выведется вместо прочерка
