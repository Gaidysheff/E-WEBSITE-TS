from django.contrib import admin

from .models import *


@admin.register(Emails)
class EmailsAdmin(admin.ModelAdmin):
    list_display = [
        "short_subject",
        "short_message",
        "email",
        "created_at",
        "edited_at",
    ]
    readonly_fields = [
        "subject",
        "message",
        "email",
        "created_at",
        "edited_at",
    ]
    list_display_links = [
        "short_subject",
        "short_message",
        "email",
    ]
    list_per_page = 20
    list_filter = [
        "email",
        "created_at",
    ]

    def short_subject(self, obj):
        if obj.subject and len(obj.subject) > 20:
            return f"{obj.subject[:20]}..."
        return obj.subject

    short_subject.short_description = "Тема"

    def short_message(self, obj):
        if obj.message and len(obj.message) > 20:
            return f"{obj.message[:20]}..."
        return obj.message

    short_message.short_description = "Сообщение"

    # -----------------------------------------------------------
    # Если поле message может быть None, добавить проверку:

    # def short_subject(self, obj):
    #     if not obj.subject:
    #         return "N/A"  # или ' ', или другое значение по умолчанию
    #     if len(obj.subject) > 20:
    #         return f"{obj.subject[:20]}..."
    #     return obj.subject

    # short_subject.short_description = "Тема"

    # def short_message(self, obj):
    #     if not obj.message:
    #         return "N/A"  # или ' ', или другое значение по умолчанию
    #     if len(obj.message) > 20:
    #         return f"{obj.message[:20]}..."
    #     return obj.message

    # short_message.short_description = "Сообщение"
