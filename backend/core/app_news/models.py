from django.db import models
from .mixins import MyMemoryAutoTranslateMixin
import uuid
from django.conf import settings
import time

# from deep_translator import GoogleTranslator
# from deep_translator import MyMemoryTranslator  # Меняем импорт

# from deep_translator import LingvaTranslator  # Меняем импорт

from django.contrib import admin


class Post(MyMemoryAutoTranslateMixin, models.Model):
    # class Post(models.Model):

    DRAFT = "D"
    PUBLISHED = "P"
    ARCHIVED = "A"
    STATUS_CHOICES = {
        DRAFT: "Черновик",
        PUBLISHED: "Опубликовано",
        ARCHIVED: "в Архиве",
    }

    title = models.CharField(max_length=128, verbose_name="Заголовок поста")
    slug = models.SlugField(
        max_length=255,
        unique=True,
        db_index=True,
        verbose_name="URL",
        help_text="slug назначится автоматически",
    )
    text = models.TextField(
        null=True,
        blank=True,
        verbose_name="Текст поста",
    )
    image = models.ImageField(
        upload_to="news_photos/%Y/%m/%d/", verbose_name="Изображение"
    )
    category = models.ForeignKey(
        "Category", on_delete=models.CASCADE, verbose_name="Категория поста"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    status = models.CharField(
        max_length=1, choices=STATUS_CHOICES, default=DRAFT, verbose_name="Статус"
    )

    def __str__(self):
        return self.title or f"Пост #{self.id}"

    class Meta:
        verbose_name = "Пост"
        verbose_name_plural = "Посты"
        ordering = ["-created_at", "title"]

    def preview(self):
        return "{} ... {}".format(self.text[0:123], str(self.rating))

    # Перечисляем все поля через запятую — миксин переведет их
    # за ОДИН пакетный запрос к API!
    translate_fields = ["title", "text"]

    # ---------------------- Вариант через LingvaTranslator ----------------------
    # def save(self, *args, **kwargs):
    #     try:
    #         # 1. Перевод заголовка
    #         if self.title_ru and not self.title_en:
    #             self.title_en = LingvaTranslator(source="ru", target="en").translate(
    #                 self.title_ru
    #             )
    #             time.sleep(1)  # Небольшая пауза для стабильности

    #         # 2. Перевод текста
    #         if self.text_ru and not self.text_en:
    #             self.text_en = LingvaTranslator(source="ru", target="en").translate(
    #                 self.text_ru
    #             )

    #         print("🎉 Автоперевод через Lingva успешно выполнен!")
    #     except Exception as e:
    #         print(f"❌ Сбой автоперевода Lingva: {e}")

    #     super().save(*args, **kwargs)

    # ------------------- Вариант через MyMemoryTranslator -------------------

    # def save(self, *args, **kwargs):
    #     # Массив для текстов, которые нужно перевести
    #     to_translate = []

    #     # Флаги, чтобы знать, что именно мы переводим
    #     translate_title = bool(self.title_ru and not self.title_en)
    #     translate_text = bool(self.text_ru and not self.text_en)

    #     if translate_title:
    #         to_translate.append(self.title_ru)
    #     if translate_text:
    #         to_translate.append(self.text_ru)

    #     # Если есть что переводить, делаем ОДИН запрос к Google
    #     if to_translate:
    #         try:
    #             # Искусственная пауза перед запросом, чтобы дать IP-адресу "остыть"
    #             time.sleep(1.5)
    #             # Переводим через MyMemory (он не банит по IP так жестко, как Google)
    #             translated_results = MyMemoryTranslator(
    #                 source="ru-RU", target="en-US"
    #             ).translate_batch(to_translate)

    #             # Распределяем результаты обратно по полям
    #             if translate_title and translate_text:
    #                 self.title_en = translated_results[0]
    #                 self.text_en = translated_results[1]
    #             elif translate_title:
    #                 self.title_en = translated_results[0]
    #             elif translate_text:
    #                 self.text_en = translated_results[0]

    #             print("🎉 Автоперевод через MyMemory успешно выполнен!")

    #         except Exception as e:
    #             print(f"❌ Сбой пакетного автоперевода: {e}")
    #             # На продакшене (Beget) логгируйте это или пишите в файлы, чтобы не падать

    #     super().save(*args, **kwargs)


# ---------------------- Вариант через GoogleTranslator ----------------------

# def save(self, *args, **kwargs):
#     # Если русское поле заполнено, а английское оставили пустым:
#     if self.title_ru and not self.title_en:
#         try:
#             # Автоматически переводим через Google
#             self.title_en = GoogleTranslator(source="ru", target="en").translate(
#                 self.title_ru
#             )
#         # except Exception:
#         #     pass  # Если нет интернета, просто пропускаем
#         except Exception as e:
#             print(
#                 f"❌ ОШИБКА ПЕРЕВОДА TITLE: {e}"
#             )  # Это покажет реальную причину в терминале

#     if self.text_ru and not self.text_en:
#         try:
#             self.text_en = GoogleTranslator(source="ru", target="en").translate(
#                 self.text_ru
#             )
#         # except Exception:
#         #     pass  # Если нет интернета, просто пропускаем
#         except Exception as e:
#             print(
#                 f"❌ ОШИБКА ПЕРЕВОДА TITLE: {e}"
#             )  # Это покажет реальную причину в терминале

#     super().save(*args, **kwargs)


# --------------------------------------------------------------------------------


class Category(MyMemoryAutoTranslateMixin, models.Model):
    # class Category(models.Model):

    name = models.CharField(max_length=64, unique=True)
    slug = models.SlugField(
        max_length=255, unique=True, db_index=True, verbose_name="URL"
    )

    class Meta:
        verbose_name = "Категория Поста"
        verbose_name_plural = "Категории Постов"

    def __str__(self):
        return self.name or f"Категория #{self.id}"

    translate_fields = ["name"]

    # ---------------------- Вариант через MyMemoryTranslator ----------------------

    # def save(self, *args, **kwargs):

    #     # Если есть что переводить, делаем запрос
    #     if self.name_ru and not self.name_en:

    #         try:
    #             # Искусственная пауза перед запросом, чтобы дать IP-адресу "остыть"
    #             time.sleep(1)
    #             # Переводим через MyMemory (он не банит по IP так жестко, как Google)
    #             self.name_en = MyMemoryTranslator(
    #                 source="ru-RU", target="en-US"
    #             ).translate(self.name_ru)

    #             print("🎉 Автоперевод через MyMemory успешно выполнен!")

    #         except Exception as e:
    #             print(f"❌ Сбой автоперевода: {e}")
    #     # На продакшене (Beget) логгируйте это или пишите в файлы, чтобы не падать

    #     super().save(*args, **kwargs)


class Subscriber(models.Model):
    LANG_CHOICES = [
        ("ru", "Русский"),
        ("en", "English"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subscriptions",
    )
    email = models.EmailField(max_length=254, unique=True)

    # НОВОЕ ПОЛЕ: Храним язык пользователя
    lang = models.CharField(
        max_length=2, choices=LANG_CHOICES, default="ru", verbose_name="Язык рассылки"
    )

    is_verified = models.BooleanField(default=False)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    # --- Временные метки для аналитики ---
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата подписки")
    unsubscribed_at = models.DateTimeField(
        null=True, blank=True, verbose_name="Дата отписки"
    )

    # Статус подписки (Soft Delete вместо жесткого удаления)
    is_active = models.BooleanField(default=True, verbose_name="Активен")

    class Meta:
        verbose_name = "Подписчик на новости"
        verbose_name_plural = "Подписчики на новости"
        ordering = ["-created_at"]

    def __str__(self):
        status = (
            "Активен"
            if self.is_active and self.is_verified
            else "Отписан" if not self.is_active else "Не подтвержден"
        )
        return f"{self.email} ({status})"

    @property
    @admin.display(description="Жизненный срок подписки")
    def duration(self):
        if self.is_active == False:
            _duration = self.unsubscribed_at - self.created_at
            duration = str(_duration).split(" ", 1)[0] + " дней"
            return duration
