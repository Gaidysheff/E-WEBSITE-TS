from django.db import models


class Emails(models.Model):
    subject = models.CharField(max_length=500, verbose_name="Тема")
    message = models.TextField(max_length=500, verbose_name="Сообщение")
    email = models.EmailField(verbose_name="Адрес")
    created_at = models.DateTimeField(
        auto_now_add=True, blank=True, null=True, verbose_name="Создано"
    )
    edited_at = models.DateTimeField(auto_now=True, verbose_name="Редактировано")

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "Сообщение"
        verbose_name_plural = "Сообщения"
        ordering = [
            "created_at",
        ]

    # @property
    # def short_message(self):
    #     if self.message and len(self.message) > 10:
    #         return f"{self.message[:10]}..."
    #     return self.message

    # -----------------------------------------------------------
    # Если поле message может быть None, добавить проверку:

    # @property
    # def short_message(self):
    #     if not self.message:
    #         return "N/A"  # или ' ', или другое значение по умолчанию
    #     if len(self.message) > 20:
    #         return f"{self.message[:20]}..."
    #     return self.message

    @property
    def short_subject(self):
        if not self.subject:
            return "N/A"  # или ' ', или другое значение по умолчанию
        if len(self.subject) > 20:
            return f"{self.subject[:20]}..."
        return self.subject
