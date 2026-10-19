from rest_framework.views import APIView
from rest_framework.response import Response
from knox.models import AuthToken
from social_django.utils import psa
from rest_framework import viewsets, permissions, status
import traceback
from social_django.utils import load_backend, load_strategy
from .serializers import *
from .models import *
from django.contrib.auth import get_user_model, authenticate
from api.models import Cart
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
import requests
from rest_framework import status

from django.shortcuts import get_object_or_404

# from django.shortcuts import render
# from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import translation
from requests.auth import HTTPBasicAuth  # Обязательно импортируем для заголовков!

User = get_user_model()


def merge_carts(user, guest_cart_code, user_cart):
    try:
        guest_cart = Cart.objects.get(cart_code=guest_cart_code)

        # Если гостевая корзина уже чья-то (другого юзера), не трогаем её
        if guest_cart.user and guest_cart.user != user:
            return

        for item in guest_cart.cartitems.all():
            existing_item = user_cart.cartitems.filter(product=item.product).first()
            if existing_item:
                existing_item.quantity += item.quantity
                existing_item.save()
                item.delete()
            else:
                item.cart = user_cart
                item.save()

        guest_cart.delete()
    except Cart.DoesNotExist:
        pass


class LoginViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]

            # 1. Аутентификация
            user = authenticate(request, username=email, password=password)
            # Убедитесь, что username=email если юзаете кастомный Auth

            if user:
                # 2. Создание токена (Knox)
                _, token = AuthToken.objects.create(user)

                # 3. Работа с гостевой корзиной
                guest_cart_code = request.data.get("cart_code")

                # 4. Ищем существующую корзину пользователя
                # Получаем или создаем основную корзину пользователя
                # ВАЖНО: используем фильтр .first(), чтобы избежать MultipleObjectsReturned
                user_cart = Cart.objects.filter(user=user).first()

                # 5. Ищем гостевую корзину
                guest_cart = Cart.objects.filter(cart_code=guest_cart_code).first()

                if guest_cart:
                    if not user_cart:
                        # Сценарий А: У юзера нет корзины, а у гостя есть.
                        # Просто привязываем гостевую к юзеру.
                        guest_cart.user = user
                        guest_cart.save()
                        user_cart = guest_cart
                    else:
                        # Сценарий Б: Есть обе корзины. Нужно объединить.
                        if user_cart.id != guest_cart.id:
                            merge_carts(user, guest_cart_code, user_cart)
                            # self.merge_carts(user, guest_cart_code, user_cart)

                # 6. Если вообще никаких корзин не нашли (редкий случай), создаем новую

                if not user_cart:
                    user_cart = Cart.objects.create(user=user)

                # Возвращаем в ответе ПРАВИЛЬНЫЙ cart_code, который привязан к юзеру
                return Response(
                    {
                        "token": token,  # В Knox token обычно это строка
                        "cart_code": user_cart.cart_code,
                        "user": UserSerializer(user).data,
                    }
                )

            return Response({"error": "Invalid credentials"}, status=401)
        return Response(serializer.errors, status=400)


class RegisterViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Сохраняем и получаем объект созданного юзера

            # Возвращаем минимальный безопасный ответ и правильный статус 201 Created
            return Response(
                {"status": "success", "user_id": user.id, "email": user.email},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class RegisterViewset(viewsets.ViewSet):
#     permission_classes = []  # Максимально открываем доступ
#     authentication_classes = []  # Отключаем любые интерцепторы токенов/сессий Django

#     def create(self, request):
#         print("--- МЫ ТУТ: Запрос дошел до бэкенда! ---")
#         print("Данные с фронта:", request.data)

#         # Просто возвращаем заглушку, НИЧЕГО не сохраняя в БД
#         return Response({"message": "Test success"}, status=status.HTTP_200_OK)


class UserViewset(viewsets.ViewSet):
    # permission_classes = [permissions.AllowAny]
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def list(self, request):
        queryset = User.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_cart_code(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    return Response({"cart_code": cart.cart_code})


@api_view(["PUT"])  # Меняем на PUT
@permission_classes([IsAuthenticated])
def update_user_data(request):
    email = request.data.get("email")
    if not email:
        return Response(
            {"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Берем пользователя
        customer = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Приводим фронтенд-поля (CamelCase) к полям Django (snake_case)
    customer.username = request.data.get("username", customer.username)
    # customer.birthday = request.data.get("birthday", customer.birthday)
    customer.first_name = request.data.get(
        "firstName", customer.first_name
    )  # Исправлено
    customer.last_name = request.data.get("lastName", customer.last_name)  # Исправлено
    customer.phone = request.data.get("phone", customer.phone)

    # Картинку обрабатываем отдельно: обновляем только если пришел реальный файл.
    # Если пришла строка или пустота — игнорируем, чтобы не вызвать ошибку 500
    if "image" in request.FILES:
        customer.image = request.FILES["image"]

    birthday_val = request.data.get("birthday")
    # Если пришла пустота, "null" или None — пишем в БД честный NULL
    if birthday_val in ["", "null", None]:
        customer.birthday = None
    else:
        customer.birthday = birthday_val

    customer.save()

    # Возвращаем обновленные данные через сериализатор
    serializer = UserSerializer(customer)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ======================= User's Email change ========================
class RequestEmailChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Используем созданный ранее сериализатор для валидации данных
        serializer = EmailChangeRequestSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid(raise_exception=True):
            # Сохраняем запрос в БД (метод create в сериализаторе вернет объект EmailChangeRequest)
            change_request = serializer.save()

            # 1. Получаем текущий язык запроса (например, 'ru' или 'en')
            # Если Django его не определил, ставим дефолтный 'en'
            lang = translation.get_language() or "en"

            # Сокращаем локали типа 'ru-ru' до чистых двух букв 'ru'
            lang = lang.split("-")[0]

            # 2. Формируем ссылку для подтверждения
            # Собираем идеальную мультиязычную ссылку для TanStack Router

            confirm_link = f"{settings.BASE_URL_FRONTEND}/{lang}/verify_email_reset/{change_request.token}"

            # print(f"Link to verify: {confirm_link}")

            context = {
                "confirm_link": confirm_link,
                "email_address": change_request.new_email,  # от куда вытянуть e-mail ???
            }

            # Выбираем нужный шаблон
            template_name = (
                "core/email_reset_en.html"
                if lang == "en"
                else "core/email_reset_ru.html"
            )

            html_message = render_to_string(template_name, context=context)

            # html_message = render_to_string("core/email_reset.html", context=context)

            plain_message = strip_tags(html_message)

            # --------------- метод send_mail от django.core.mail ----------------
            # Отправляем письмо на НОВЫЙ адрес
            # send_mail(
            #     subject="Подтверждение смены email",
            #     message=f"Для подтверждения смены адреса перейдите по ссылке: {confirm_link}",
            #     from_email=settings.DEFAULT_FROM_EMAIL,
            #     # Рекомендуется использовать этот параметр DEFAULT_FROM_EMAIL - это Company Name
            #     recipient_list=[change_request.new_email],
            #     fail_silently=False,
            # )

            # Использование EmailMultiAlternatives для отправки текста и HTML
            msg = EmailMultiAlternatives(
                subject=(
                    "Подтверждение смены email"
                    if lang == "ru"
                    else "Confirm change of email"
                ),
                body=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                # Рекомендуется использовать этот параметр DEFAULT_FROM_EMAIL - это Company Name
                to=[change_request.new_email],
            )

            msg.attach_alternative(html_message, "text/html")
            msg.send()

            return Response(
                {
                    "message": "Запрос создан. Проверьте ваш новый почтовый ящик для подтверждения."
                },
                status=status.HTTP_201_CREATED,
            )


class ConfirmEmailChangeView(APIView):
    # Доступ разрешен всем, так как переход осуществляется по уникальному токену
    permission_classes = [AllowAny]

    def post(self, request, token):
        # Ищем активный запрос по токену
        change_request = get_object_or_404(
            EmailChangeRequest, token=token, is_active=True
        )

        # Обновляем email основного пользователя
        user = change_request.user
        user.email = change_request.new_email
        # Если email является логином (USERNAME_FIELD), это изменит и логин
        user.save()

        # Деактивируем запрос после успешного использования
        change_request.is_active = False
        change_request.save()

        return Response(
            {
                "message": "Email успешно изменен. Теперь вы можете войти с новым адресом.",
                "status": "success",
            },
            status=status.HTTP_200_OK,
        )


# ====================== Google Auth ==========================


# def verify_google_token(access_token):
#     # Прямой запрос к Google для проверки токена и получения данных пользователя
#     response = requests.get(
#         "https://googleapis.com", headers={"Authorization": f"Bearer {access_token}"}
#     )
#     if response.status_code == 200:
#         return response.json()  # Вернет {'email': '...', 'given_name': '...', ...}
#     return None


@api_view(["POST"])
@permission_classes([AllowAny])
def google_auth(request):
    access_token = request.data.get("access_token")
    guest_cart_code = request.data.get("cart_code")

    # 1. Используем ТОЧНЫЙ и ПОЛНЫЙ URL
    google_url = "https://www.googleapis.com/oauth2/v3/userinfo"

    # 2. Передаем токен в заголовках (рекомендуемый способ Google)
    headers = {"Authorization": f"Bearer {access_token}"}

    try:
        # Указываем таймаут, чтобы запрос не висел вечно
        google_response = requests.get(google_url, headers=headers, timeout=10)
    except requests.exceptions.RequestException as e:
        return Response({"error": f"Google connection error: {str(e)}"}, status=500)

    if not google_response.ok:
        # Если статус не 200, выводим что именно ответил Google
        print(
            f"Google API Error: {google_response.status_code} - {google_response.text}"
        )
        return Response({"error": "Invalid Google token or expired"}, status=400)

    # Здесь переменная называется user_data (как в вашем коде выше)
    user_data = google_response.json()
    email = user_data.get("email")

    if not email:
        return Response({"error": "Email not provided by Google"}, status=400)

    # Готовим username, чтобы Pylance не ругался
    # Заменяем символы, которые не разрешены в username Django
    username_clean = email.replace("@", "_").replace(".", "_")

    # 2. Ищем или создаем пользователя
    # Если создаем нового, используем email как username
    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            "username": username_clean,  # Используем созданную переменную
            "first_name": user_data.get("given_name", ""),  # Используем user_data
            "last_name": user_data.get("family_name", ""),  # Используем user_data
        },
    )

    # 3. Генерируем Knox токен
    _, token = AuthToken.objects.create(user)

    # 4. Слияние корзин (используем ту же логику, что в Login)
    user_cart, _ = Cart.objects.get_or_create(user=user)

    if guest_cart_code and guest_cart_code != user_cart.cart_code:
        # Так как merge_carts теперь глобальная, вызываем без self
        merge_carts(user, guest_cart_code, user_cart)

    return Response(
        {
            "token": token,
            "cart_code": user_cart.cart_code,
            "user": {"email": user.email, "first_name": user.first_name, "id": user.id},
        }
    )


# ====================== Yandex Auth ==========================
import requests
import traceback
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from knox.models import AuthToken
from social_django.models import UserSocialAuth
from django.core.files.base import ContentFile  # Добавляем импорт в самый верх файла

User = get_user_model()


@method_decorator(csrf_exempt, name="dispatch")
class YandexSocialAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        code = request.data.get("code")
        if not code:
            return Response(
                {"error": "Code is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # 1. МЕНЯЕМ КОД НА ACCESS_TOKEN (СТРОГИЙ URL ПО ДОКУМЕНТАЦИИ ЯНДЕКСА)
            token_url = "https://oauth.yandex.ru/token"

            headers = {"Content-Type": "application/x-www-form-urlencoded"}

            # Передаем ВСЕ параметры строго в теле формы x-www-form-urlencoded
            token_data = {
                "grant_type": "authorization_code",
                "code": code,
                "client_id": settings.SOCIAL_AUTH_YANDEX_OAUTH2_KEY,
                "client_secret": settings.SOCIAL_AUTH_YANDEX_OAUTH2_SECRET,
                "redirect_uri": settings.SOCIAL_AUTH_YANDEX_OAUTH2_REDIRECT_URL,
            }

            token_res = requests.post(
                token_url,
                data=token_data,
                headers=headers,
                timeout=5,
            )

            # print(f"[DEBUG OAUTH] Отправляем код: {code}")
            # print(f"[DEBUG OAUTH] Ответ Яндекса (Статус): {token_res.status_code}")

            # try:
            #     token_json = token_res.json()
            # except Exception:
            #     # Если Яндекс вернул ошибку текстом/HTML — выводим без смайликов в консоль
            #     print(
            #         "[DEBUG ERROR] Yandex returned non-JSON format. Status:",
            #         token_res.status_code,
            #     )
            #     print("[DEBUG RESPONSE TEXT]:", token_res.text[:300])
            #     return Response(
            #         {
            #             "error": "Yandex returned invalid format",
            #             "status_code": token_res.status_code,
            #             "raw_response": token_res.text[:150],
            #         },
            #         status=400,
            #     )

            # Если Яндекс вернул ошибку авторизации (например, код устарел)
            if token_res.status_code != 200:
                # print(f"[DEBUG OAUTH] Сбой обмена токенов. Ответ API: {token_res.json()}")
                return Response(
                    {
                        "error": "Yandex token exchange failed",
                        "details": token_res.json(),
                    },
                    status=400,
                )

            token_json = token_res.json()
            access_token = token_json.get("access_token")

            # 2. ЗАПРАШИВАЕМ ДАННЫЕ ПРОФИЛЯ (СТРОГИЙ URL СЕРВЕРА ПАСПОРТА)
            info_url = "https://login.yandex.ru/info"
            headers = {"Authorization": f"OAuth {access_token}"}

            info_res = requests.get(info_url, headers=headers, timeout=5)
            if info_res.status_code != 200:
                return Response(
                    {
                        "error": "Yandex profile fetch failed",
                        "details": info_res.json(),
                    },
                    status=400,
                )

            user_info = info_res.json()

            # 3. Извлекаем данные
            emails_list = user_info.get("emails", [])
            email = user_info.get("default_email") or (
                emails_list[0] if emails_list else None
            )

            if not email:
                return Response(
                    {
                        "error": "Yandex did not return an email. Check application scopes."
                    },
                    status=400,
                )

            # A. Формируем безопасный номер телефона
            phone_data = user_info.get("default_phone") or {}
            # Вытаскиваем строго номер телефона текстом
            phone_number = phone_data.get("number", "")

            # B. Обрабатываем дату рождения (Яндекс отдает её в формате YYYY-MM-DD
            #  или пустую строку, если не заполнена)
            birthday_raw = user_info.get("birthday", "")
            # Если в модели поле birthday ожидает объект даты (DateField),
            # а Яндекс прислал пустую строку, лучше записать None,
            # чтобы Django не ругался на неверный формат даты
            birthday_value = birthday_raw if birthday_raw else None

            # C. Формируем абсолютную ссылку на аватарку Яндекса
            avatar_id = user_info.get("default_avatar_id")
            avatar_url = ""
            if avatar_id:
                # Склеиваем по официальной спецификации с размером islands-large
                avatar_url = (
                    f"https://avatars.yandex.net/get-yapic/{avatar_id}/islands-200"
                )

            # 4. Находим или создаем пользователя в нашей модели
            email_clean = email.lower().strip()

            username_default = user_info.get("login") or email.split("@")[0]

            # 4-1. Сначала находим или создаем пользователя БЕЗ картинки
            user, created = User.objects.get_or_create(
                email=email_clean,
                # email=email.lower().strip(),
                defaults={
                    "username": username_default,
                    "first_name": user_info.get("first_name", ""),
                    "last_name": user_info.get("last_name", ""),
                    "birthday": birthday_value,  # Безопасная дата
                    "phone": phone_number,  # Чистый номер телефона +7...
                    # "image": avatar_url,  # Готовая ссылка на аватарку Яндекса!
                },
            )

            # 4-2. Если пользователь только что создался и у него есть аватарка в Яндексе
            if created and avatar_url:
                try:
                    # Скачиваем бинарные данные картинки из Яндекса
                    response = requests.get(avatar_url, timeout=5)
                    if response.status_code == 200:
                        # Формируем уникальное имя файла
                        file_name = f"yandex_avatar_{user.id}.jpg"
                        # Магия Django: передаем ContentFile в ImageField!
                        # Он САМ положит файл в images_users/YYYY/MM/DD/ благодаря upload_to
                        user.image.save(
                            file_name, ContentFile(response.content), save=True
                        )
                except Exception as e:
                    print(f"[DEBUG ERROR] Не удалось скачать аватарку Яндекса: {e}")

            # Сохраняем связь профилей
            UserSocialAuth.objects.get_or_create(
                user=user, provider="yandex-oauth2", uid=user_info.get("id")
            )

            # 5. Выпускаем ваш Knox-токен
            instance, token = AuthToken.objects.create(user)

            # Формируем безопасный текстовый URL аватарки для JSON ответа
            # Если картинка есть, берем её .url, если нет — пустую строку
            avatar_response_url = user.image.url if user.image else ""

            return Response(
                {
                    "token": token,
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                        "birthday": user.birthday,
                        "phone": user.phone,
                        # "image": user.image,
                        "image": avatar_response_url,
                        # <-- ФИКС: Передаем СТРОКУ с URL, а не бинарный объект!
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            print("[ERROR] КРИТИЧЕСКАЯ ОШИБКА В ЯНДЕКС-АВТОРИЗАЦИИ:")
            traceback.print_exc()
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ========================= VK ID Auth =============================
@method_decorator(csrf_exempt, name="dispatch")
class VKSocialAuthView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Получаем от фронтенда!
        code = request.data.get("code")
        state = request.data.get("state")
        device_id = request.data.get("device_id")

        # АВТОМАТИЧЕСКИЙ ПЕРЕХВАТ: Достаем оригинальный верификатор из кук SDK!
        code_verifier = request.COOKIES.get("vkid_sdk:codeVerifier")

        if not code:
            return Response(
                {"error": "Code is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # 1. Меняем code на access_token в VK ID
            token_url = "https://id.vk.ru/oauth2/auth"
            headers = {"Content-Type": "application/x-www-form-urlencoded"}

            # Превращаем ID приложения строго в ЧИСЛО
            client_id_numeric = int(settings.SOCIAL_AUTH_VKID_OAUTH2_KEY)
            client_secret = settings.SOCIAL_AUTH_VKID_OAUTH2_SECRET
            redirect_uri = settings.SOCIAL_AUTH_VKID_OAUTH2_REDIRECT_URL

            token_data = {
                "grant_type": "authorization_code",
                "code": code,
                "client_id": client_id_numeric,  # Передаем как число!
                "client_secret": client_secret,
                "redirect_uri": redirect_uri,
                "state": state,
            }

            # Если кука успешно долетела до бэкенда, передаем её в VK ID
            if code_verifier:
                token_data["code_verifier"] = code_verifier

            # Если фронтенд прислал device_id, обязательно добавляем его в форму!
            if device_id:
                token_data["device_id"] = device_id

            token_res = requests.post(
                token_url, data=token_data, headers=headers, timeout=5
            )

            token_json = token_res.json()

            if token_res.status_code != 200:
                # ++++++++++ после отработки кода закомментить это логирование ++++++++++
                # Жестко прописываем абсолютный путь к error_wsgi.txt в корень backend_app
                # log_path = "/home/g/gaidys2d/eshop/backend_app/error_wsgi.txt"
                # with open(log_path, "w", encoding="utf-8") as f:
                #     f.write(
                #         f"--- ШЛЮЗ VK ID ОТКЛОНИЛ ОБМЕН ---\nОтвет API: {token_json}\n"
                #     )
                # ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                return Response(
                    {"error": "VK token exchange error", "details": token_json},
                    status=400,
                )

            # Безопасный извлекатель токена
            raw_token = token_json.get("access_token")
            access_token = None

            if isinstance(raw_token, dict):
                access_token = raw_token.get("token") or raw_token.get("access_token")
            elif isinstance(raw_token, str):
                access_token = raw_token

            if not access_token:
                access_token = token_json.get("token") or token_json.get("id_token")

            # ++++++++++ после отработки кода закомментить это логирование ++++++++++
            # Жестко фиксируем абсолютный путь для записи успешного лога
            # log_path = "/home/g/gaidys2d/eshop/backend_app/error_wsgi.txt"
            # with open(log_path, "w", encoding="utf-8") as f:
            #     f.write(f"--- УСПЕШНЫЙ ОТВЕТ VK ID ---\n")
            #     f.write(f"Полный JSON ответа: {token_json}\n")
            #     f.write(f"Извлеченный access_token: {access_token}\n")
            # ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

            if not access_token:
                # КРИТИЧЕСКИЙ ФИКС ДЛЯ ОТЛАДКИ: Отдаем весь сырой ответ VK
                # прямо на фронтенд в details!
                return Response(
                    {
                        "error": "No access_token in VK response",
                        "details": token_json,  # Выводим сырой ответ VK на экран!
                    },
                    status=400,
                )

            # 🛠️ 2. ЗАПРОС ДАННЫХ ПРОФИЛЯ
            # (СТРОГО ПО СПЕЦИФИКАЦИИ VK ID С ПЕРЕДАЧЕЙ CLIENT_ID)
            info_url = "https://id.vk.ru/oauth2/user_info"
            info_headers = {"Authorization": f"Bearer {access_token}"}

            # По документации VK ID, передаем параметры как форму POST-запросом!
            info_headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": f"Bearer {access_token}",
            }

            info_data = {
                "client_id": int(
                    settings.SOCIAL_AUTH_VKID_OAUTH2_KEY
                )  # Передаем ID приложения числом
            }

            info_res = requests.post(
                info_url, data=info_data, headers=info_headers, timeout=5
            )

            # Проверяем второй ответ на JSON

            try:
                user_info = info_res.json()
            except Exception:
                # +++++ после отработки кода закомментить это логирование +++++
                # with open(
                #     os.path.join(settings.BASE_DIR, "error_wsgi.txt"),
                #     "w",
                #     encoding="utf-8",
                # ) as f:
                #     f.write(f"--- СБОЙ НА ЭТАПЕ ЗАПРОСА ПРОФИЛЯ ---\n")
                #     f.write(f"Статус ответа VK: {info_res.status_code}\n")
                #     f.write(f"Текст ответа VK: {info_res.text[:500]}\n")
                # +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                return Response(
                    {"error": "VK ID profile returned non-JSON format"}, status=400
                )

            if info_res.status_code != 200 or "error" in user_info:
                # +++++ после отработки кода закомментить это логирование +++++
                # with open(
                #     os.path.join(settings.BASE_DIR, "error_wsgi.txt"),
                #     "w",
                #     encoding="utf-8",
                # ) as f:
                #     f.write(f"--- ШЛЮЗ VK ID ОТКЛОНИЛ ЗАПРОС ПРОФИЛЯ ---\n")
                #     f.write(f"Ответ API: {user_info}\n")
                # +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                return Response(
                    {"error": "VK ID profile fetch failed", "details": user_info},
                    status=400,
                )

            # 3. ИЗВЛЕКАЕМ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ (VK ID возвращает их в плоском виде
            #  или в объекте 'user')
            user_data = user_info.get("user", user_info)

            # 3. Извлекаем данные
            email = user_data.get("email")
            if not email:
                # На случай, если у аккаунта в VK нет почты, создаем уникальный
                # внутренний email по user_id
                vk_uid = token_json.get("user_id") or user_data.get("id") or "unknown"
                email = f"vk_user_{vk_uid}@eshop.gaidysheff.ru"

            email_clean = email.lower().strip()

            # Формируем имя пользователя
            vk_user_id = token_json.get("user_id") or user_data.get("id") or "user"
            username_default = (
                user_data.get("username")
                or user_data.get("nickname")
                or f"vk_{vk_user_id}"
            )

            # 4. НАХОДИМ ИЛИ СОЗДАЕМ ПОЛЬЗОВАТЕЛЯ В БД DJANGO
            user, created = User.objects.get_or_create(
                email=email_clean,
                defaults={
                    "username": username_default,
                    "first_name": user_data.get("first_name", ""),
                    "last_name": user_data.get("last_name", ""),
                    "phone": user_data.get("phone", ""),
                },
            )

            # 5. АВТОМАТИЧЕСКОЕ СКАЧИВАНИЕ АВАТАРКИ
            # (Обычно поле называется 'avatar' или 'picture')
            avatar_url = user_data.get("avatar") or user_data.get("picture")
            if created and avatar_url:
                try:
                    img_res = requests.get(avatar_url, timeout=5)
                    if img_res.status_code == 200:
                        file_name = f"vkid_avatar_{user.id}.jpg"
                        user.image.save(
                            file_name, ContentFile(img_res.content), save=True
                        )
                except Exception:
                    pass

            # 6. ВЫПУСКАЕМ Knox-ТОКЕН МАГАЗИНА
            instance, token = AuthToken.objects.create(user)
            avatar_response_url = user.image.url if user.image else ""

            return Response(
                {
                    "token": token,
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "username": user.username,
                        "image": avatar_response_url,
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:

            # ++++++++++ после отработки кода закомментить это логирование ++++++++++
            # import traceback

            # with open(os.path.join(settings.BASE_DIR, "error_wsgi.txt"), "w") as f:
            #     f.write("=== КРИТИЧЕСКОЕ ИСКЛЮЧЕНИЕ PYTHON ===\n")
            #     traceback.print_exc(file=f)
            # ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
