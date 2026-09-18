from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import Post, Subscriber


@receiver(pre_save, sender=Post)
def check_post_publication_status(sender, instance, **kwargs):
    # Флаг по умолчанию
    instance._should_send_newsletter = False

    # Если текущий статус не опубликован — сразу выходим
    if instance.status != "P":
        return

    if not instance.pk:
        # Кейс 1: Пост создается с нуля и СРАЗУ в статусе "P"
        instance._should_send_newsletter = True
    else:
        # Кейс 2: Пост редактируется. Данные в БД еще СТАРЫЕ.
        try:
            old_post = Post.objects.get(pk=instance.pk)
            # Если старый статус НЕ равен "P", а новый (текущий) равен "P" — отправляем!
            if old_post.status != "P":
                instance._should_send_newsletter = True
        except Post.DoesNotExist:
            pass


@receiver(post_save, sender=Post)
def send_newsletter_on_post_creation(sender, instance, created, **kwargs):
    # Читаем флаг, который мы подготовили в pre_save
    should_send = getattr(instance, "_should_send_newsletter", False)

    # # Условие для отправки: статус должен быть строго "Опубликовано"
    # if instance.status != "P":
    #     return

    # should_send = False

    # if created:
    #     # Кейс 1: Пост создали и у него СРАЗУ стоит статус "Опубликовано"
    #     should_send = True
    # else:
    #     # Кейс 2: Пост редактируют. Нам нужно проверить, какой статус был ДО сохранения.
    #     try:
    #         old_post = Post.objects.get(pk=instance.pk)
    #         # Если раньше был Черновик/Архив, а сейчас стала Публикация — отправляем!
    #         if old_post.status == "P":
    #             should_send = False
    #     except Post.DoesNotExist:
    #         pass

    # Если условия совпали — запускаем рассылку

    if should_send:
        # Удаляем временный флаг
        instance._should_send_newsletter = False

        subscribers = Subscriber.objects.filter(is_verified=True, is_active=True)

        if not subscribers.exists():
            return

        for subscriber in subscribers:
            subscriber_lang = subscriber.lang

            template_name = (
                "core/newsletter_en.html"
                if subscriber_lang == "en"
                else "core/newsletter_ru.html"
            )
            post_title = (
                instance.title_en if subscriber_lang == "en" else instance.title_ru
            )
            post_text = (
                instance.text_en if subscriber_lang == "en" else instance.text_ru
            )

            post_link = (
                f"{settings.BASE_URL_FRONTEND}/{subscriber_lang}/news/{instance.slug}"
            )

            # Корректно склеиваем путь к картинке без дублирования слэшей
            backend_url = settings.BASE_URL_BACKEND.rstrip("/")
            image_path = instance.image.url.lstrip("/")
            post_image = f"{backend_url}/{image_path}" if instance.image else None

            unsubscribe_link = f"{settings.BASE_URL_FRONTEND}/{subscriber_lang}/news/unsubscribe/{subscriber.token}"

            context = {
                "post_title": post_title,
                "post_text": post_text[:300] + "...",
                "post_image": post_image,
                "post_link": post_link,
                "unsubscribe_link": unsubscribe_link,
            }

            html_message = render_to_string(template_name, context=context)
            plain_message = strip_tags(html_message)

            msg = EmailMultiAlternatives(
                subject=(
                    f"Новая статья: {post_title}"
                    if subscriber_lang == "ru"
                    else f"New article: {post_title}"
                ),
                body=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[subscriber.email],
            )
            msg.attach_alternative(html_message, "text/html")
            msg.send()


# @receiver(post_save, sender=Post)
# def send_newsletter_on_post_creation(sender, instance, created, **kwargs):
#     # Срабатывает СТРОГО только при создании нового поста в админке
#     if created:
#         # Берём только подтверждённых и активных подписчиков
#         subscribers = Subscriber.objects.filter(is_verified=True, is_active=True)

#         if not subscribers.exists():
#             return

#         for subscriber in subscribers:
#             # Читаем язык СТРОГО ИЗ БД для этого конкретного человека!
#             subscriber_lang = subscriber.lang

#             # Выбираем правильный шаблон и локализованные поля поста (django-modeltranslation)
#             template_name = (
#                 "core/newsletter_en.html"
#                 if subscriber_lang == "en"
#                 else "core/newsletter_ru.html"
#             )
#             post_title = (
#                 instance.title_en if subscriber_lang == "en" else instance.title_ru
#             )
#             post_text = (
#                 instance.text_en if subscriber_lang == "en" else instance.text_ru
#             )

#             # Формируем ссылки
#             post_link = (
#                 f"{settings.BASE_URL_FRONTEND}/{subscriber_lang}/news/{instance.slug}"
#             )
#             unsubscribe_link = f"{settings.BASE_URL_FRONTEND}/{subscriber_lang}/news/unsubscribe/{subscriber.token}"

#             # Собираем контекст для конкретного подписчика
#             context = {
#                 "post_title": post_title,
#                 "post_text": post_text[:300]
#                 + "...",  # В письме показываем только анонс
#                 "post_image": (
#                     f"{settings.BASE_URL_BACKEND}{instance.image.url}"
#                     if instance.image
#                     else None
#                 ),
#                 "post_link": post_link,
#                 "unsubscribe_link": unsubscribe_link,
#             }

#             html_message = render_to_string(template_name, context=context)
#             plain_message = strip_tags(html_message)

#             # Создаем и отправляем письмо
#             msg = EmailMultiAlternatives(
#                 subject=(
#                     f"Новая статья: {post_title}"
#                     if subscriber_lang == "ru"
#                     else f"New article: {post_title}"
#                 ),
#                 body=plain_message,
#                 from_email=settings.DEFAULT_FROM_EMAIL,
#                 to=[subscriber.email],
#             )
#             msg.attach_alternative(html_message, "text/html")
#             msg.send()
