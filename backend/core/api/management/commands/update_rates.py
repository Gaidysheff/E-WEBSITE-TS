from django.core.management.base import BaseCommand
from api.utils.currency import update_live_currency_rates


class Command(BaseCommand):
    help = "Принудительное обновление курсов валют из внешних источников"

    def handle(self, *args, **options):
        self.stdout.write("Запуск обновления курсов валют...")
        success = update_live_currency_rates()
        if success:
            self.stdout.write(self.style.SUCCESS("Курсы валют успешно обновлены!"))
        else:
            self.stdout.write(self.style.ERROR("Не удалось обновить курсы валют."))
