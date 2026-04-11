from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from .models import *
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from api.models import Cart
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from knox.models import AuthToken

User = get_user_model()


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
                            self.merge_carts(user, guest_cart_code, user_cart)

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

    def merge_carts(self, user, guest_cart_code, user_cart):
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
