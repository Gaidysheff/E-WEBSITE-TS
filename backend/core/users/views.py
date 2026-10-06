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
# class YandexSocialAuthView(APIView):
#     permission_classes = [permissions.AllowAny]

#     # Декоратор @psa перехватывает запрос и подключает нужный социальный бэкенд
#     # @psa("yandex-oauth2")
#     # def post(self, request, backend):

#     def post(self, request):
#         # Фронтенд присылает нам временный код авторизации в ключе 'code'
#         code = request.data.get("code")
#         if not code:
#             return Response(
#                 {"error": "Code is required"}, status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             # Инициализируем стратегию и бэкенд Яндекса вручную без использования магии @psa
#             strategy = load_strategy(request)
#             backend = load_backend(
#                 strategy=strategy, name="yandex-oauth2", redirect_uri=None
#             )

#             # Добавляем принудительное чтение ключей из настроек для ручной инициализации
#             backend.setting("KEY", settings.SOCIAL_AUTH_YANDEX_OAUTH2_KEY)
#             backend.setting("SECRET", settings.SOCIAL_AUTH_YANDEX_OAUTH2_SECRET)

#             # Магия python-social-auth: меняем код на пользователя
#             # user = request.backend.do_auth(code)

#             user = backend.do_auth(code)

#             if user:
#                 # Если пользователь успешно вошел/создался, генерируем для него Knox-токен!
#                 instance, token = AuthToken.objects.create(user)
#                 return Response(
#                     {
#                         "token": token,
#                         "user": {
#                             "id": user.id,
#                             "email": user.email,
#                             "username": user.username,
#                         },
#                     },
#                     status=status.HTTP_200_OK,
#                 )

#             else:
#                 return Response(
#                     {"error": "Не удалось аутентифицировать пользователя через Yandex"},
#                     status=status.HTTP_400_BAD_REQUEST,
#                 )

#         except Exception as e:
#             # КРИТИЧЕСКИ ВАЖНО ДЛЯ ОТЛАДКИ: Выводим полный Traceback ошибки 500 в консоль Django!
#             # print("❌❌❌ КРИТИЧЕСКАЯ ОШИБКА В СОЦ-АВТОРИЗАЦИИ:")
#             print("[ERROR] КРИТИЧЕСКАЯ ОШИБКА В СОЦ-АВТОРИЗАЦИИ:")
#             traceback.print_exc()
#             return Response(
#                 {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

#         # except Exception as e:
#         #     return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

#         # return Response(
#         #     {"error": "Authentication failed"}, status=status.HTTP_400_BAD_REQUEST
#         # )

# ============================ Вариант-2 =======================================
# from social_django.models import UserSocialAuth
# from requests.auth import HTTPBasicAuth


# class YandexSocialAuthView(APIView):
#     permission_classes = [permissions.AllowAny]

#     def post(self, request):
#         code = request.data.get("code")
#         if not code:
#             return Response(
#                 {"error": "Code is required"}, status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             # 1. Меняем code на access_token
#             token_url = "https://yandex.ru"

#             headers = {"Content-Type": "application/x-www-form-urlencoded"}

#             # В теле запроса оставляем только код, тип гранта и redirect_uri
#             token_data = {
#                 "grant_type": "authorization_code",
#                 "code": code,
#                 "client_id": settings.SOCIAL_AUTH_YANDEX_OAUTH2_KEY,
#                 "client_secret": settings.SOCIAL_AUTH_YANDEX_OAUTH2_SECRET,
#                 # КРИТИЧЕСКИЙ ФИКС: Передаем тот самый redirect_uri, который был на фронтенде!
#                 "redirect_uri": settings.SOCIAL_AUTH_YANDEX_OAUTH2_REDIRECT_URL,
#             }

#             # Ключи приложения передаем через легальный заголовок Basic Auth (requests сделает base64 сам!)
#             # client_id = settings.SOCIAL_AUTH_YANDEX_OAUTH2_KEY
#             # client_secret = settings.SOCIAL_AUTH_YANDEX_OAUTH2_SECRET

#             # Отправляем данные как обычную x-www-form-urlencoded форму
#             token_res = requests.post(
#                 token_url,
#                 # json=token_data,  # <-- МЕНЯЕМ НА JSON
#                 data=token_data,
#                 headers=headers,  # Заголовки формы
#                 # auth=HTTPBasicAuth(client_id, client_secret),  # <-- Защита Basic Auth
#                 timeout=5,
#             )

#             print(f"[DEBUG OAUTH] Отправляем код: {code}")
#             print(
#                 f"[DEBUG OAUTH] Ссылка возврата бэкенда: {settings.SOCIAL_AUTH_YANDEX_OAUTH2_REDIRECT_URL}"
#             )
#             print(f"[DEBUG OAUTH] Ответ сервера (Код статуса): {token_res.status_code}")

#             # Проверяем, пришел ли JSON, чтобы избежать падения JSONDecodeError
#             try:
#                 token_json = token_res.json()
#             except Exception:
#                 # Если Яндекс прислал ошибку текстом/HTML — выводим её в консоль
#                 print(
#                     f"[DEBUG ERROR] Яндекс вернул не-JSON ответ (Статус {token_res.status_code}): {token_res.text}"
#                 )
#                 print("[DEBUG RESPONSE TEXT]:", token_res.text)
#                 return Response(
#                     {
#                         "error": "Yandex returned invalid format",
#                         "status_code": token_res.status_code,
#                         "raw_response": token_res.text[:200],
#                     },
#                     status=400,
#                 )

#             if token_res.status_code != 200:
#                 print(
#                     f"[DEBUG OAUTH] Яндекс отклонил запрос обмена токенов. Ответ API: {token_json}"
#                 )
#                 return Response(
#                     {"error": "Yandex token exchange failed", "details": token_json},
#                     status=400,
#                 )

#             access_token = token_json.get("access_token")

#             # 2. Запрашиваем данные профиля
#             info_url = "https://yandex.ru"
#             headers = {"Authorization": f"OAuth {access_token}"}

#             info_res = requests.get(info_url, headers=headers, timeout=5)
#             if info_res.status_code != 200:
#                 return Response(
#                     {
#                         "error": "Yandex profile fetch failed",
#                         "details": info_res.json(),
#                     },
#                     status=400,
#                 )

#             user_info = info_res.json()

#             # 3. Извлекаем данные (Яндекс может вернутьdefault_email или массив emails)
#             email = user_info.get("default_email") or (
#                 user_info.get("emails")[0] if user_info.get("emails") else None
#             )
#             if not email:
#                 return Response(
#                     {
#                         "error": "Yandex did not return an email. Check application scopes."
#                     },
#                     status=400,
#                 )

#             # 4. Находим или создаем пользователя
#             # Если login отсутствует, берем часть email до собачки
#             username_default = user_info.get("login") or email.split("@")[0]

#             user, created = User.objects.get_or_create(
#                 email=email.lower().strip(),
#                 defaults={
#                     "username": username_default,
#                     "first_name": user_info.get("first_name", ""),
#                     "last_name": user_info.get("last_name", ""),
#                 },
#             )

#             # Записываем связь в таблицу социалок
#             UserSocialAuth.objects.get_or_create(
#                 user=user, provider="yandex-oauth2", uid=user_info.get("id")
#             )

#             # 5. Выпускаем токен Knox
#             instance, token = AuthToken.objects.create(user)

#             return Response(
#                 {
#                     "token": token,
#                     "user": {
#                         "id": user.id,
#                         "email": user.email,
#                         "username": user.username,
#                     },
#                 },
#                 status=status.HTTP_200_OK,
#             )

#         except Exception as e:
#             print("[ERROR] КРИТИЧЕСКАЯ ОШИБКА В ЯНДЕКС-АВТОРИЗАЦИИ:")
#             traceback.print_exc()
#             return Response(
#                 {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )


# ============================ Вариант-3 ==================

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status, permissions

# from django.utils.decorators import method_decorator
# from django.views.decorators.csrf import csrf_exempt


# # КРИТИЧЕСКИЙ ФИКС: Освобождаем API-эндпоинт от проверки CSRF кук браузера!
# @method_decorator(csrf_exempt, name="dispatch")
# class YandexSocialAuthView(APIView):
#     permission_classes = [permissions.AllowAny]

#     def post(self, request):
#         # Наш тестовый код с заглушкой
#         code = request.data.get("code")
#         if not code:
#             return Response(
#                 {"error": "Code is required"}, status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             # Ваша тестовая заглушка:
#             user_info = {
#                 "id": "123456789_yandex_test",
#                 "default_email": "test-yandex-user@gaidysheff.ru",
#                 "first_name": "Семен",
#                 "last_name": "Семеныч",
#                 "login": "gaidysheff_test",
#             }

#             email = user_info.get("default_email")
#             username_default = user_info.get("login") or email.split("@")[0]

#             user, created = User.objects.get_or_create(
#                 email=email.lower().strip(),
#                 defaults={
#                     "username": username_default,
#                     "first_name": user_info.get("first_name", ""),
#                     "last_name": user_info.get("last_name", ""),
#                 },
#             )

#             # Выпускаем токен Knox
#             instance, token = AuthToken.objects.create(user)

#             return Response(
#                 {
#                     "token": token,
#                     "user": {
#                         "id": user.id,
#                         "email": user.email,
#                         "username": user.username,
#                     },
#                 },
#                 status=status.HTTP_200_OK,
#             )

#         except Exception as e:
#             return Response(
#                 {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )


# ======================== Финальный Вариант ============================
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
