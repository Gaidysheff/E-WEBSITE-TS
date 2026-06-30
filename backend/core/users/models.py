from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.utils import translation

from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver
from django.urls import reverse
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
import os


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is a required field")

        email = self.normalize_email(email)

        # 🔥 ЖЕСТКАЯ ПРОВЕРКА:
        # Если username не пришел, равен пустоте,
        # ИЛИ равен самому email (проделки DRF)
        current_username = extra_fields.get("username")
        if not current_username or current_username == email:
            extra_fields["username"] = email.split("@")[0]

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    email = models.EmailField(max_length=200, unique=True)
    username = models.CharField(max_length=200, null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=13, blank=True, null=True)

    image = models.ImageField(
        upload_to="images_users/%Y/%m/%d/",
        default="images_users/default-user.jpg",
        blank=True,
        null=True,
        verbose_name="Фото",
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def save(self, *args, **kwargs):
        # 1. Проверяем, что email заполнен, а username пустой (или равен None)
        if self.email and not self.username:
            # 2. Извлекаем часть до собаки и записываем в username
            self.username = self.email.split("@")[0]

        # 3. Обязательно вызываем стандартный метод сохранения родительского класса
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email


@receiver(reset_password_token_created)
def password_reset_token_created(reset_password_token, *args, **kwargs):
    sitelink = os.getenv("BASE_URL_FRONTEND")
    # sitelink = "http://localhost:5173"

    # token = "{}".format(reset_password_token.key)

    token = reset_password_token.key

    # 1. Получаем текущий язык запроса (например, 'ru' или 'en')
    # Если Django его не определил, ставим дефолтный 'en'
    lang = translation.get_language() or "en"

    # Сокращаем локали типа 'ru-ru' до чистых двух букв 'ru'
    lang = lang.split("-")[0]

    # 2. Собираем идеальную мультиязычную ссылку для TanStack Router
    full_link = f"{sitelink}/{lang}/password-reset/{token}"

    # full_link = str(sitelink) + str("/password-reset/") + str(token)

    # print(token)
    # print(full_link)

    context = {"full_link": full_link, "email_adress": reset_password_token.user.email}

    html_message = render_to_string("core/password_reset.html", context=context)
    plain_message = strip_tags(html_message)

    msg = EmailMultiAlternatives(
        subject="Request for resetting password for {title}".format(
            title=reset_password_token.user.email
        ),
        body=plain_message,
        from_email="sender@example.com",
        to=[reset_password_token.user.email],
    )

    msg.attach_alternative(html_message, "text/html")
    msg.send()
