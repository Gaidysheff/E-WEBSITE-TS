from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import *
from modeltranslation.admin import TranslationAdmin


@admin.register(CustomUser)
class CustomUserAdmin(TranslationAdmin):
    # class CustomUserAdmin(admin.ModelAdmin):
    list_display = [
        "email",
        "username",
        "phone",
        "icon_image",
        "first_name",
        "last_name",
        "birthday",
    ]
    readonly_fields = [
        "email",
        "username",
        "phone",
        "icon_image",
        "first_name",
        "last_name",
        "birthday",
        "password",
        "date_joined",
        "last_login",
    ]
    fieldsets = [
        (
            None,
            {
                "fields": (
                    "email",
                    "username",
                    "phone",
                    "icon_image",
                    "first_name",
                    "last_name",
                    "birthday",
                )
            },
        ),
        (
            None,
            {
                "fields": (
                    "password",
                    "date_joined",
                    "last_login",
                )
            },
        ),
        (
            None,
            {
                "fields": (
                    "is_superuser",
                    "is_staff",
                    "is_active",
                )
            },
        ),
        # (
        #     None,
        #     {
        #         "fields": (
        #             "groups",
        #             "user_permissions",
        #         )
        #     },
        # ),
    ]

    @admin.display(description="Иконка", ordering="email")
    def icon_image(self, item: CustomUser):
        if item.image:
            return mark_safe(f"<img src='{item.image.url}' height=25>")
        return "Без фото"
