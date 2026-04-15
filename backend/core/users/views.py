from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from .models import *
from api.models import Cart, CartItem
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from api.models import Cart
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from knox.models import AuthToken
from rest_framework.permissions import AllowAny
import requests

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
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)


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
    # permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_cart_code(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    return Response({"cart_code": cart.cart_code})


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
