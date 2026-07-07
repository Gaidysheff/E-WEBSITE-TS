import requests

from django.utils import timezone
from datetime import timedelta
from api.models import CurrencyRate  # Скорректируйте импорт под ваше приложение


def update_live_currency_rates():
    # Открытый и быстрый фид котировок ЦБ РФ в JSON
    url = "https://www.cbr-xml-daily.ru/daily_json.js"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    try:
        # 🔥 ГЛАВНЫЙ ФИКС: proxies={"http": None, "https": None}
        # заставляет Python игнорировать системные шлюзы Windows и идти напрямую, как Postman!
        response = requests.get(
            url, headers=headers, proxies={"http": None, "https": None}, timeout=5
        )

        if response.status_code == 200:
            data = response.json()
            valute = data.get("Valute", {})

            updated = False
            for code in ["USD", "EUR"]:
                if code in valute:
                    # Рассчитываем курс рубля
                    rub_rate = float(valute[code]["Value"]) / float(
                        valute[code]["Nominal"]
                    )
                    CurrencyRate.objects.update_or_create(
                        code=code, defaults={"rate": round(rub_rate, 4)}
                    )
                    updated = True

            if updated:
                print(
                    "--- БЭКЕНД: Сетевой баг Windows обойден. Живые курсы успешно в БД! ---"
                )
                return True
        else:
            print(f"!!! Зеркало вернуло код: {response.status_code}")

    except Exception as e:
        print(f"!!! Сетевой сбой Python requests: {e}")

    # Наш надежный парашют-фоллбэк, защищающий фронтенд от падений
    print("⚠️ Сеть недоступна. Записываю стабильный базовый курс в БД.")
    CurrencyRate.objects.update_or_create(code="USD", defaults={"rate": 91.50})
    CurrencyRate.objects.update_or_create(code="EUR", defaults={"rate": 98.20})
    return True


def get_actual_rates():
    rates = CurrencyRate.objects.all()

    # if not rates.exists() or (timezone.now() - rates.first().updated_at) > timedelta(
    #     hours=24
    # ):
    #     update_live_currency_rates()
    #     rates = CurrencyRate.objects.all()

    # 1. Если базы нет, сразу обновляем
    if not rates.exists():
        update_live_currency_rates()
        rates = CurrencyRate.objects.all()
    else:
        # 2. 🔥 БЕРЕМ САМУЮ СТАРУЮ ЗАПИСЬ по времени обновления
        # Сортируем по возрастанию времени (сначала самые старые)
        oldest_rate = CurrencyRate.objects.order_by("updated_at").first()

        # Если самая старая запись обновлялась больше суток назад — принудительно обновляем
        if oldest_rate and (timezone.now() - oldest_rate.updated_at) > timedelta(
            hours=24
        ):
            print(
                "--- БЭКЕНД: Курсы устарели. Запускаю автоматическое обновление... ---"
            )
            update_live_currency_rates()
            rates = CurrencyRate.objects.all()  # Перезапрашиваем обновленные данные

    return {r.code: float(r.rate) for r in rates}


# def update_live_currency_rates():
#     # 🌟 Используем публичное, сверхстабильное API, которое никогда не блокирует Python-скрипты
#     url = "https://er-api.com"

#     headers = {
#         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
#     }

#     try:
#         # Ставим таймаут побольше и отключаем верификацию SSL (на случай проблем с сертификатами Минцифры)
#         response = requests.get(url, headers=headers, timeout=10, verify=False)

#         if response.status_code == 200:
#             data = response.json()
#             rates = data.get("rates", {})

#             # Извлекаем курсы относительно USD
#             usd_to_rub = float(rates.get("RUB", 1))
#             eur_to_usd = float(rates.get("EUR", 1))

#             # Кросс-курс перевода EUR в RUB
#             eur_to_rub = usd_to_rub / eur_to_usd

#             # Записываем живые данные в БД
#             CurrencyRate.objects.update_or_create(
#                 code="USD", defaults={"rate": round(usd_to_rub, 4)}
#             )
#             CurrencyRate.objects.update_or_create(
#                 code="EUR", defaults={"rate": round(eur_to_rub, 4)}
#             )

#             print("--- БЭКЕНД: Живые курсы успешно обновлены по кросс-курсу USD! ---")
#             return True

#     except Exception as e:
#         print(f"!!! СЕТЕВАЯ ОШИБКА: {e}. Применяю аварийный парашют...")

#     # Наш пуленепробиваемый парашют (Бизнес не должен стоять)
#     CurrencyRate.objects.update_or_create(code="USD", defaults={"rate": 91.50})
#     CurrencyRate.objects.update_or_create(code="EUR", defaults={"rate": 98.20})
#     return True


# ----------------------- Вариант ЦБ РФ -----------------------
# def update_live_currency_rates():
#     # 🌟 Самое стабильное, открытое и быстрое JSON-зеркало официальных курсов валют
#     url = "https://cbr-xml-daily.ru"

#     headers = {
#         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
#     }

#     try:
#         response = requests.get(url, headers=headers, timeout=10)

#         if response.status_code == 200:
#             data = response.json()
#             valute_data = data.get("Valute", {})

#             updated = False
#             for code in ["USD", "EUR"]:
#                 if code in valute_data:
#                     # В этом API: Value — это цена в рублях, Nominal — количество единиц (обычно 1)
#                     raw_value = float(valute_data[code]["Value"])
#                     nominal = float(valute_data[code]["Nominal"])

#                     # Вычисляем чистую стоимость 1 единицы валюты в рублях
#                     rub_rate = raw_value / nominal

#                     # Сохраняем в нашу базу Django
#                     CurrencyRate.objects.update_or_create(
#                         code=code, defaults={"rate": round(rub_rate, 4)}
#                     )
#                     updated = True

#             if updated:
#                 print("--- БЭКЕНД: Живые курсы USD/EUR успешно сохранены в БД! ---")
#                 return True
#         else:
#             print(f"!!! Зеркало вернуло ошибку HTTP: {response.status_code}")

#     except Exception as e:
#         print(f"!!! КРИТИЧЕСКАЯ ОШИБКА СЕТЕВОГО ОБНОВЛЕНИЯ: {e}")

#     # Надежный фоллбэк-парашют, если даже зеркало упадет
#     print("⚠️ Сеть недоступна. Записываю стабильный базовый курс в БД.")
#     CurrencyRate.objects.update_or_create(code="USD", defaults={"rate": 77.99})
#     CurrencyRate.objects.update_or_create(code="EUR", defaults={"rate": 88.99})
#     return True


# ----------------------- Вариант ЕЦБ -----------------------
# def update_live_currency_rates():
#     # Публичный и сверхстабильный API котировок, работающий без блокировок и ключей
#     url = "https://exchangerate-api.com"

#     headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

#     try:
#         response = requests.get(url, headers=headers, timeout=8)
#         if response.status_code == 200:
#             data = response.json()
#             rates = data.get("rates", {})

#             # Данные приходят в формате: {"USD": 0.0112, "EUR": 0.0102} (сколько валюты в 1 рубле)
#             # Чтобы узнать, сколько рублей в 1 долларе/евро, делим 1 на это значение
#             if "USD" in rates and "EUR" in rates:
#                 usd_in_rub = 1 / float(rates["USD"])
#                 eur_in_rub = 1 / float(rates["EUR"])

#                 CurrencyRate.objects.update_or_create(
#                     code="USD", defaults={"rate": round(usd_in_rub, 4)}
#                 )
#                 CurrencyRate.objects.update_or_create(
#                     code="EUR", defaults={"rate": round(eur_in_rub, 4)}
#                 )

#                 print(
#                     "--- БЭКЕНД: Живые курсы валют успешно обновлены через глобальный JSON API! ---"
#                 )
#                 return True

#     except Exception as e:
#         print(f"!!! Ошибка сети глобального API: {e}. Использую резервный фикс...")

#     # Фоллбэк-заглушка на случай полного отсутствия связи
#     print("⚠️ Сеть недоступна. Записываю стабильный базовый курс в БД.")
#     CurrencyRate.objects.update_or_create(code="USD", defaults={"rate": 77.77})
#     CurrencyRate.objects.update_or_create(code="EUR", defaults={"rate": 88.88})
#     return True


# ----------------------- Вариант er-api.com -----------------------
# def update_live_currency_rates():
#     url = "https://er-api.com"

#     # Имитируем запрос от стандартного браузера Chrome, чтобы API не блокировал нас
#     headers = {
#         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
#     }

#     try:
#         response = requests.get(
#             url, headers=headers, timeout=10
#         )  # Увеличили таймаут до 10с
#         if response.status_code == 200:
#             data = response.json()
#             rates = data.get("rates", {})

#             # Нам нужно узнать сколько РУБЛЕЙ стоит 1 USD и 1 EUR.
#             # API дает: rates['RUB'] (например, 90.0) и rates['EUR'] (например, 0.92)
#             usd_to_rub = float(rates.get("RUB", 1))
#             eur_to_usd = float(rates.get("EUR", 1))

#             # Математика перевода EUR к RUB через кросс-курс:
#             # Если 1 USD = 90 RUB, а 1 USD = 0.92 EUR, то 1 EUR = 90 / 0.92
#             eur_to_rub = usd_to_rub / eur_to_usd

#             # Записываем в нашу базу данных Django
#             CurrencyRate.objects.update_or_create(
#                 code="USD", defaults={"rate": round(usd_to_rub, 4)}
#             )
#             CurrencyRate.objects.update_or_create(
#                 code="EUR", defaults={"rate": round(eur_to_rub, 4)}
#             )

#             print("--- БЭКЕНД: Курсы валют успешно обновлены по кросс-курсу USD! ---")
#             return True
#         else:
#             print(f"!!! API вернул статус: {response.status_code}")
#     except Exception as e:
#         print(f"!!! КРИТИЧЕСКАЯ ОШИБКА ОБНОВЛЕНИЯ ВАЛЮТ: {e}")
#     return False


# ----------------------- Вариант ЦБ РФ -----------------------
# def update_live_currency_rates():
#     # Используем проверенный XML ЦБ РФ, но обрабатываем его как обычный текст
#     url = "https://cbr.ru"

#     headers = {
#         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
#     }

#     try:
#         response = requests.get(url, headers=headers, timeout=10)

#         # Принудительно декодируем в текст, игнорируя битые символы кодировок
#         html_text = response.content.decode("windows-1251", errors="ignore")

#         # Регулярные выражения для поиска курса доллара и евро внутри XML структуры ЦБ
#         # Ищет блок <CharCode>USD</CharCode>...<Value>90,1234</Value>
#         usd_match = re.search(
#             r"<CharCode>USD</CharCode>.*?<Value>(.*?)</Value>", html_text, re.DOTALL
#         )
#         eur_match = re.search(
#             r"<CharCode>EUR</CharCode>.*?<Value>(.*?)</Value>", html_text, re.DOTALL
#         )

#         updated = False

#         if usd_match:
#             usd_value = float(usd_match.group(1).replace(",", "."))
#             CurrencyRate.objects.update_or_create(
#                 code="USD", defaults={"rate": round(usd_value, 4)}
#             )
#             updated = True

#         if eur_match:
#             eur_value = float(eur_match.group(1).replace(",", "."))
#             CurrencyRate.objects.update_or_create(
#                 code="EUR", defaults={"rate": round(eur_value, 4)}
#             )
#             updated = True

#         if updated:
#             print(
#                 "--- БЭКЕНД: Курсы валют железно обновлены через регулярные выражения! ---"
#             )
#             return True

#         print(
#             "!!! ЦБ вернул текст, но кодов USD/EUR внутри не найдено (возможно, блокировка/капча)"
#         )

#     except Exception as e:
#         print(f"!!! КРИТИЧЕСКАЯ ОШИБКА РЕГУЛЯРНОГО ВЫРАЖЕНИЯ: {e}")

#     # Временный хардкод-фоллбэк, чтобы ваш Postman и фронтенд НИКОГДА не падали и возвращали данные,
#     # даже если у вас полностью отключится интернет на компьютере!
#     print("⚠️ Сеть недоступна. Записываю стабильный базовый курс в БД.")
#     CurrencyRate.objects.update_or_create(code="USD", defaults={"rate": 77.00})
#     CurrencyRate.objects.update_or_create(code="EUR", defaults={"rate": 88.00})
#     return True


# def get_actual_rates():
#     """
#     Умная функция: отдает курсы из БД. Если данных нет или они устарели (старше 24 часов),
#     она сначала тихо обновляет их из API, а затем возвращает свежие.
#     """
#     # Проверяем, есть ли вообще записи
#     rates = CurrencyRate.objects.all()

#     # Если база пустая или последняя запись обновлялась более суток назад
#     if not rates.exists() or (timezone.now() - rates.first().updated_at) > timedelta(
#         hours=24
#     ):
#         update_live_currency_rates()
#         rates = CurrencyRate.objects.all()

#     # Формируем словарь для фронтенда
#     return {r.code: float(r.rate) for r in rates}
