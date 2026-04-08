from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from .models import *
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from api.models import Cart

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

            # Это для мягкой привязки корзины к пользователю
            # ----------------------------------
            # Достаем cart_code из ТЕЛА запроса (request.data)
            # cart_code = request.data.get("cart_code")

            user = authenticate(request, email=email, password=password)

            if user:

                # --- ЛОГИКА ПРИВЯЗКИ КОРЗИНЫ ---
                # if cart_code:
                #     try:

                #         # 1. Находим "гостевую" корзину
                #         guest_cart = Cart.objects.get(cart_code=cart_code)

                #         # 2. Проверяем, нет ли у этого юзера уже какой-то другой корзины
                #         # (Чтобы не было ситуации, когда у юзера 2 открытые корзины)
                #         Cart.objects.filter(user=user).exclude(
                #             cart_code=cart_code
                #         ).delete()

                #         # 3. Привязываем гостевую корзину к юзеру
                #         guest_cart.user = user
                #         guest_cart.save()
                #     except Cart.DoesNotExist:
                #         pass  # Если корзины с таким кодом нет — игнорируем
                # -------------------------------

                _, token = AuthToken.objects.create(user)
                return Response(
                    {"user": self.serializer_class(user).data, "token": token}
                )
            else:
                return Response({"error": "Invalid credentials"}, status=401)
        else:
            return Response(serializer.errors, status=400)

    def merge_carts(user, guest_cart_code):
        try:
            # Корзина, которая сейчас в браузере у гостя
            guest_cart = Cart.objects.get(cart_code=guest_cart_code)

            # Ищем, есть ли у юзера уже какая-то активная корзина в БД
            user_cart = Cart.objects.filter(user=user).first()

            if user_cart and user_cart != guest_cart:
                # Переносим товары из гостевой в основную
                for item in guest_cart.cartitems.all():
                    # Проверяем, нет ли такого товара уже в основной корзине
                    existing_item = user_cart.cartitems.filter(
                        product=item.product
                    ).first()
                    if existing_item:
                        existing_item.quantity += item.quantity
                        existing_item.save()
                        item.delete()
                    else:
                        item.cart = user_cart
                        item.save()
                guest_cart.delete()
                return user_cart.cart_code
            else:
                # Если у юзера не было корзины, просто привязываем гостевую
                guest_cart.user = user
                guest_cart.save()
                return guest_cart.cart_code
        except Cart.DoesNotExist:
            return guest_cart_code


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
