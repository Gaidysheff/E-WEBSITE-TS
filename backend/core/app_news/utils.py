# import threading
# from django.core.mail import send_mail
# from django.conf import settings

import os
import threading
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives
from django.conf import settings


def _async_newsletter_sender(post_data, subscribers_data):
    """
    Тяжелый цикл отправки писем.
    Выполняется операционной системой Beget в изолированном фоне.
    """
    try:
        print(f"[BG THREAD] Начало рассылки для {len(subscribers_data)} подписчиков...")

        for sub in subscribers_data:
            lang = sub["lang"]
            token = sub["token"]
            email = sub["email"]

            template_name = (
                "core/newsletter_en.html" if lang == "en" else "core/newsletter_ru.html"
            )
            post_title = (
                post_data["title_en"] if lang == "en" else post_data["title_ru"]
            )
            post_text = post_data["text_en"] if lang == "en" else post_data["text_ru"]

            post_link = f"{settings.BASE_URL_FRONTEND}/{lang}/news/{post_data['slug']}"
            unsubscribe_link = (
                f"{settings.BASE_URL_FRONTEND}/{lang}/news/unsubscribe/{token}"
            )

            context = {
                "post_title": post_title,
                "post_text": post_text[:300] + "...",
                "post_image": post_data["post_image"],
                "post_link": post_link,
                "unsubscribe_link": unsubscribe_link,
            }

            html_message = render_to_string(template_name, context=context)
            plain_message = strip_tags(html_message)

            subject = (
                f"Новая статья: {post_title}"
                if lang == "ru"
                else f"New article: {post_title}"
            )

            msg = EmailMultiAlternatives(
                subject=subject,
                body=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[email],
            )
            msg.attach_alternative(html_message, "text/html")
            msg.send()

        print("[BG THREAD] Рассылка успешно завершена!")
    except Exception as e:
        print(f"[BG THREAD ERROR] Ошибка в фоновом потоке рассылки: {e}")


# def _send_email_thread(subject, message, recipient_list):
#     """
#     Внутренняя тяжелая функция. Выполняется в изолированном потоке OS.
#     Ее подвисания никак не влияют на скорость отдачи страниц пользователю.
#     """
#     try:
#         print(
#             f"[THREAD] Запуск фоновой отправки писем для {len(recipient_list)} адресатов..."
#         )
#         send_mail(
#             subject=subject,
#             message=message,
#             from_email=settings.DEFAULT_FROM_EMAIL,
#             recipient_list=recipient_list,
#             fail_silently=False,  # Ставим False, чтобы поймать ошибки в логи в случае сбоя SMTP
#         )
#         print("[THREAD] Фоновая отправка писем успешно завершена!")
#     except Exception as e:
#         print(f"[THREAD ERROR] Ошибка при фоновой отправке почты: {e}")


# def send_mail_async(subject, message, recipient_list):
#     """
#     Публичная функция-обертка. Мгновенно запускает поток и освобождает основной код Django.
#     """
#     # Если список пуст, даже не создаем поток
#     if not recipient_list:
#         return

#     # Создаем объект потока, передавая целевую функцию и ее аргументы
#     email_thread = threading.Thread(
#         target=_send_email_thread, args=(subject, message, recipient_list)
#     )

#     # Запускаем поток в фоновом режиме
#     email_thread.start()


# Выносим тяжелую отправку в отдельную изолированную функцию
def _async_subscribe_email_sender(email, lang, token):
    try:
        template_name = (
            "core/subscribe_en.html" if lang == "en" else "core/subscribe_ru.html"
        )

        # Ссылка для фронтенда (React / TanStack Router перехватит её)
        confirm_link = (
            f"{settings.BASE_URL_FRONTEND}/{lang}/news/verify_subscription/{token}"
        )

        # Готовим контекст для письма подтверждения
        context = {
            "confirm_link": confirm_link,
            "email_address": email,
        }

        html_message = render_to_string(template_name, context=context)
        plain_message = strip_tags(html_message)

        msg = EmailMultiAlternatives(
            subject=(
                "Подтверждение подписки на новости"
                if lang == "ru"
                else "Confirm your subscription"
            ),
            body=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email],
        )

        msg.attach_alternative(html_message, "text/html")
        msg.send()

        print(f"[MAIL SUCCESS] Письмо подтверждения успешно отправлено на {email}")
    except Exception as mail_err:
        # Ошибка SMTP запишется в логи сервера,
        # но больше никогда не уронит веб-страницу пользователя!
        import traceback

        # log_path = "/home/g/gaidys2d/eshop/backend_app/error_wsgi.txt"
        log_path = os.path.join(settings.BASE_DIR, "error_mail.txt")
        with open(log_path, "a", encoding="utf-8") as f:
            f.write(f"\n=== СБОЙ SMTP В ФОНЕ ===\n")
            traceback.print_exc(file=f)
