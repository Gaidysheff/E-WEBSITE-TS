from django.contrib import admin, messages
from django.utils.safestring import mark_safe
from .models import Post, Category, Subscriber
from modeltranslation.admin import TranslationAdmin
from django.utils.safestring import mark_safe
from django.urls import reverse
import json
from django.db.models import Count, Avg, F
from django.db.models.functions import TruncMonth

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
        "email",
        "get_username",
        "lang",
        "is_verified",
        "token",
        "created_at",
        "unsubscribed_at",
        "is_active",
        "duration",
    ]
    readonly_fields = [
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

    # Полностью убираем оригинальное поле 'user' (селектор) из карточки редактирования

    exclude = [
        "user",
    ]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Жёстко подгружаем связанных пользователей одним SQL JOIN
        return qs.select_related("user")

    # 2. Описываем метод вытаскивания данных
    @admin.display(description="Пользователь", ordering="user__username")
    def get_username(self, obj):
        # Проверяем, привязан ли юзер (чтобы не упасть в AttributeError, если это гость)
        if obj.user:
            # return obj.user.username

            # Генерируем внутреннюю ссылку на редактирование
            # этого конкретного пользователя в админке

            url = reverse("admin:users_customuser_change", args=[obj.user.id])

            return mark_safe(f'<a href="{url}">{obj.user.username}</a>')
        return "Гость"  # То, что выведется вместо прочерка

    #   =========================== Аналитика ===========================

    # Указываем Django использовать наш кастомный шаблон аналитики
    change_list_template = "admin/app_news/subscriber/analytics_change_list.html"

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}

        # 1. Считаем динамику подписок по месяцам
        monthly_data = (
            Subscriber.objects.annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")[
                :6
            ]  # Сортируем от старых к новым по месяцу и берем 6 штук
        )
        # Разворачиваем хронологически (от старых к новым)
        monthly_data = list(reversed(monthly_data))

        months = [
            item["month"].strftime("%b %Y") for item in monthly_data if item["month"]
        ]
        joined_counts = [item["count"] for item in monthly_data if item["month"]]

        # 2. Считаем средний жизненный срок для ОТПИСАВШИХСЯ пользователей
        # Нам нужно вычесть из даты отписки дату создания и взять среднее
        avg_lifetime = (
            Subscriber.objects.filter(is_active=False)
            .annotate(lifetime=F("unsubscribed_at") - F("created_at"))
            .aggregate(average_time=Avg("lifetime"))
        )

        # Переводим timedelta в читаемые дни для графика
        avg_days = 0
        if avg_lifetime["average_time"]:
            avg_days = round(avg_lifetime["average_time"].days)

        # 3. Собираем всё в единый JSON-пакет
        analytics_payload = {
            "months": months,
            "joined": joined_counts,
            "avg_lifetime_days": avg_days,
        }

        # Передаем в контекст шаблона под именем, которое ждет JS
        # ВАЖНО: Передаем СЛОВАРЬ (dict), а не строку!
        extra_context["analytics_json"] = analytics_payload

        # Вызываем стандартный метод обработки страницы, но уже с нашей порцией данных
        return super().changelist_view(request, extra_context=extra_context)
