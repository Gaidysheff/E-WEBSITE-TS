import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives
from app_news.models import Post, Subscriber


class Command(BaseCommand):
    help = "Ежедневная пакетная рассылка новых статей подписчикам"

    def handle(self, *args, **options):
        self.stdout.write("[CRON] Запуск ежедневной рассылки...")

        # 1. Вычисляем временной порог (24 часа назад)
        time_threshold = timezone.now() - datetime.timedelta(days=1)

        # 2. Ищем статьи, опубликованные за последние сутки
        fresh_posts = Post.objects.filter(status="P", created_at__gte=time_threshold)

        if not fresh_posts.exists():
            self.stdout.write(
                self.style.SUCCESS(
                    "[CRON] Новых статей за последние 24 часа нет. Рассылка отменена."
                )
            )
            return

        # 3. Извлекаем активных верифицированных подписчиков
        subscribers = Subscriber.objects.filter(is_verified=True, is_active=True)
        if not subscribers.exists():
            self.stdout.write("[CRON] Нет активных подписчиков для рассылки.")
            return

        self.stdout.write(
            f"[CRON] Найдено статей: {fresh_posts.count()}, подписчиков: {subscribers.count()}"
        )

        # 4. Запускаем пакетную рассылку
        for subscriber in subscribers:
            lang = subscriber.lang
            template_name = (
                "app_news/newsletters_list_en.html"
                if lang == "en"
                else "app_news/newsletters_list_ru.html"
            )
            unsubscribe_link = f"{settings.BASE_URL_FRONTEND}/{lang}/news/unsubscribe/{subscriber.token}"

            # Формируем контент (если статей несколько, выводим их списком)
            posts_content = []
            for post in fresh_posts:
                post_title = post.title_en if lang == "en" else post.title_ru
                post_text = post.text_en if lang == "en" else post.text_ru
                post_link = f"{settings.BASE_URL_FRONTEND}/{lang}/news/{post.slug}"

                backend_url = settings.BASE_URL_BACKEND.rstrip("/")
                image_path = post.image.url.lstrip("/") if post.image else None
                post_image = f"{backend_url}/{image_path}" if image_path else None

                posts_content.append(
                    {
                        "title": post_title,
                        "text": post_text[:200] + "...",
                        "image": post_image,
                        "link": post_link,
                    }
                )

            context = {
                "posts": posts_content,
                "unsubscribe_link": unsubscribe_link,
            }

            html_message = render_to_string(template_name, context=context)
            plain_message = strip_tags(html_message)

            subject = (
                "Дайджест новостей за сегодня" if lang == "ru" else "Daily News Digest"
            )

            try:
                msg = EmailMultiAlternatives(
                    subject=subject,
                    body=plain_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[subscriber.email],
                )
                msg.attach_alternative(html_message, "text/html")
                msg.send()
            except Exception as e:
                self.stderr.write(f"Ошибка отправки на {subscriber.email}: {e}")

        self.stdout.write(
            self.style.SUCCESS("[CRON] Ежедневная рассылка успешно завершена!")
        )
