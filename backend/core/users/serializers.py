from rest_framework import serializers
from api.models import CustomerAddress

# Импортируем МОДЕЛЬ, а не сериализатор

from .models import *
from django.contrib.auth import get_user_model

User = get_user_model()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret.pop("password", None)
        return ret


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Если username не пришел с фронтенда, делаем его равным email
        if "username" not in validated_data or not validated_data["username"]:
            validated_data["username"] = validated_data["email"]

        user = User.objects.create_user(**validated_data)
        return user


# ==================================================


# Создаем мини-сериализатор прямо здесь, чтобы не импортировать его из api
class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = [
            "street",
            "house",
            "apartment",
            "city",
            "zip",
            "region",
            "state",
        ]


class UserSerializer(serializers.ModelSerializer):
    # Находим все адреса, связанные с этим пользователем (через related_name или по умолчанию)
    # Если в модели CustomerAddress не указан related_name, Django создаст customeraddress_set
    address = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "birthday",
            "image",
            "address",
            "phone",
        ]

    def get_address(self, obj):
        # Берем последний добавленный адрес пользователя
        address = obj.address.last()
        # address = CustomerAddress.objects.filter(customer=obj).last()
        if address:
            return UserAddressSerializer(address).data
        return None


class EmailChangeRequestSerializer(serializers.Serializer):
    new_email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_new_email(self, value):
        # Проверка, что email не занят другим пользователем
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Этот email уже используется.")
        return value

    def validate_password(self, value):
        # Обязательная проверка текущего пароля для безопасности
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Неверный текущий пароль.")
        return value

    def create(self, validated_data):
        user = self.context["request"].user
        # Деактивируем предыдущие запросы этого пользователя, если они были
        EmailChangeRequest.objects.filter(user=user, is_active=True).update(
            is_active=False
        )

        return EmailChangeRequest.objects.create(
            user=user, new_email=validated_data["new_email"]
        )
