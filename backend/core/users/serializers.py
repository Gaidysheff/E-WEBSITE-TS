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
        user = User.objects.create_user(**validated_data)
        return user


# ==================================================


# Создаем мини-сериализатор прямо здесь, чтобы не импортировать его из api
class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = ["street", "state", "city", "phone"]


class UserSerializer(serializers.ModelSerializer):
    # Находим все адреса, связанные с этим пользователем (через related_name или по умолчанию)
    # Если в модели CustomerAddress не указан related_name, Django создаст customeraddress_set
    address = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "birthday",
            "image",
            "address",
        ]

    def get_address(self, obj):
        # Берем последний добавленный адрес пользователя
        address = obj.address.last()
        # address = CustomerAddress.objects.filter(customer=obj).last()
        if address:
            return UserAddressSerializer(address).data
        return None
