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

            # Достаем cart_code из ТЕЛА запроса (request.data)
            cart_code = request.data.get("cart_code")

            user = authenticate(request, email=email, password=password)

            if user:

                # --- ЛОГИКА ПРИВЯЗКИ КОРЗИНЫ ---
                if cart_code:
                    try:

                        #     cart = Cart.objects.get(cart_code=cart_code)
                        #     # Присваиваем пользователя корзине
                        #     cart.user = user
                        #     cart.save()
                        # except Cart.DoesNotExist:
                        #     pass  # Если корзины нет, ничего не делаем

                        # 1. Находим "гостевую" корзину
                        guest_cart = Cart.objects.get(cart_code=cart_code)

                        # 2. Проверяем, нет ли у этого юзера уже какой-то другой корзины
                        # (Чтобы не было ситуации, когда у юзера 2 открытые корзины)
                        Cart.objects.filter(user=user).exclude(
                            cart_code=cart_code
                        ).delete()

                        # 3. Привязываем гостевую корзину к юзеру
                        guest_cart.user = user
                        guest_cart.save()
                    except Cart.DoesNotExist:
                        pass  # Если корзины с таким кодом нет — игнорируем
                # -------------------------------

                _, token = AuthToken.objects.create(user)
                return Response(
                    {"user": self.serializer_class(user).data, "token": token}
                )
            else:
                return Response({"error": "Invalid credentials"}, status=401)
        else:
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
