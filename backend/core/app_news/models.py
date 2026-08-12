from django.db import models
from .mixins import AutoTranslationMixin


class Post(AutoTranslationMixin, models.Model):

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

    # def save(self, *args, **kwargs):
    #     self.slug = slugify(self.title)
    #     return super(Post, self).save(*args, **kwargs)


# --------------------------------------------------------------------------------


class Category(AutoTranslationMixin, models.Model):

    name = models.CharField(max_length=64, unique=True)
    slug = models.SlugField(
        max_length=255, unique=True, db_index=True, verbose_name="URL"
    )

    class Meta:
        verbose_name = "Категория Поста"
        verbose_name_plural = "Категории Постов"

    def __str__(self):
        return self.name or f"Категория #{self.id}"
