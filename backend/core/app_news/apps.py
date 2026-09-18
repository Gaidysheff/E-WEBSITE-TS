from django.apps import AppConfig


class AppNewsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app_news"
    verbose_name = "4. ИНФОРМАЦИОННО-НОВОСТНЫЕ ПОСТЫ"

    def ready(self):
        import app_news.signals  # Импортируем сигналы при запуске
