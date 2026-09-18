# from django.shortcuts import render
# from django.db import transaction
# import json
# from django.conf import settings
# from django.shortcuts import get_object_or_404, render
# from django.contrib.auth import get_user_model
# from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
# from django.db.models import Q, Max
# from django.http import JsonResponse
# import requests
# from requests.auth import HTTPBasicAuth
# from rest_framework import status
# from django.http import HttpResponse
# from rest_framework.authentication import SessionAuthentication
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from rest_framework.response import Response

from .models import Category, Post, Subscriber
from .serializers import (
    CategoryDetailSerializer,
    CategoryListSerializer,
    PostDetailSerializer,
    PostListSerializer,
    SubscriberSerializer,
)
from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import AllowAny
from rest_framework import status
import uuid
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from rest_framework.views import APIView
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView

# ================= Category =======================


@api_view(["GET"])
@permission_classes([AllowAny])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategoryListSerializer(categories, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def category_detail(request, slug):
    category = Category.objects.get(slug=slug)
    serializer = CategoryDetailSerializer(category)
    return Response(serializer.data)


# ================= Post =======================


@api_view(["GET"])
@permission_classes([AllowAny])
def post_list(request):
    posts = Post.objects.all()
    serializer = PostListSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([AllowAny])
def post_detail(request, slug):
    post = Post.objects.get(slug=slug)
    serializer = PostDetailSerializer(post)
    return Response(serializer.data)


# ========================== Filtering ================================
@api_view(["GET"])
@permission_classes([AllowAny])
def post_filtering(request):

    # Извлекаем параметры
    page_number = request.query_params.get("page", 1)
    page_size = request.query_params.get("page_size", 12)  # 12 по умолчанию

    category_query = request.query_params.get("category", "")

    # Начинаем со всех постов
    # posts = Post.objects.all().order_by("id")

    posts = Post.objects.all().order_by("created_at")

    # Сначала ВСЕГДА инициализируем базовый QuerySet
    # .order_by('id') ОБЯЗАТЕЛЕН для стабильной пагинации

    # Добавляем фильтр по категории
    if category_query:
        posts = posts.filter(category__slug=category_query)

    # Только ПОСЛЕ сортировки применяем пагинацию
    paginator = Paginator(posts, page_size)

    try:
        page_obj = paginator.page(page_number)
    except PageNotAnInteger:
        page_obj = paginator.page(1)
    except EmptyPage:
        page_obj = paginator.page(paginator.num_pages)
    except Exception as e:
        # ОБЯЗАТЕЛЬНО возвращаем Response при ошибке!
        return Response({"error": str(e)}, status=500)

    # serializer = PostListSerializer(posts, many=True)
    serializer = PostListSerializer(page_obj, many=True)

    return Response(
        {
            "count": paginator.count,  # Общее количество постов
            "total_pages": paginator.num_pages,  # Всего страниц
            "current_page": page_obj.number,
            "results": serializer.data,  # Список новостей
        }
    )


# ------------------- Filters --------------------------
@api_view(["GET"])
@permission_classes([AllowAny])
def filter_labels(request):
    return Response(
        {
            "categories": Category.objects.values("id", "name", "slug"),
        }
    )


# =============================== Subscribe ===============================


class SubscribeView(APIView):
    # Разрешаем всем, так как подписаться может и гость сайта
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SubscriberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        # Получаем язык ИЗ ЗАГОЛОВКА запроса (Axios пришлет 'ru' или 'en')
        request_lang = request.headers.get("Accept-Language", "ru")
        # На всякий случай обрезаем до 2 символов, если прилетит что-то вроде 'ru-RU'
        request_lang = request_lang[:2].lower()
        if request_lang not in ["ru", "en"]:
            request_lang = "ru"  # Фолбэк на дефолт

        # Ищем существующего или создаем нового (пока неактивного)
        subscriber, created = Subscriber.objects.get_or_create(email=email)

        # Если подписчик уже существует, активен и подтвержден — ругаемся
        if not created and subscriber.is_active and subscriber.is_verified:
            return Response(
                {"detail": "Вы уже подписаны на рассылку."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Реанимируем старую отписку или настраиваем нового гостя
        subscriber.is_active = True
        subscriber.is_verified = False  # Ждем Double Opt-In
        subscriber.unsubscribed_at = None  # Сбрасываем дату отписки
        subscriber.token = uuid.uuid4()  # Генерируем новый токен безопасности
        subscriber.lang = request_lang  # <-- СОХРАНЯЕМ КОМФОРТНЫЙ ЯЗЫК В БД!

        # Если запрос пришел от залогиненного пользователя, привязываем ForeignKey
        if request.user.is_authenticated:
            subscriber.user = request.user

        subscriber.save()

        # --- Формирование красивого HTML-письма на основе языка запроса ---
        # Ссылку верификации тоже строим с учетом сохраненного request_lang:
        template_name = (
            "core/subscribe_en.html"
            if request_lang == "en"
            else "core/subscribe_ru.html"
        )
        # Ссылка для фронтенда (React / TanStack Router перехватит её)
        confirm_link = f"{settings.BASE_URL_FRONTEND}/{request_lang}/news/verify_subscription/{subscriber.token}"

        context = {
            "confirm_link": confirm_link,
            "email_address": subscriber.email,
        }

        html_message = render_to_string(template_name, context=context)
        plain_message = strip_tags(html_message)

        msg = EmailMultiAlternatives(
            subject=(
                "Подтверждение подписки на новости"
                if request_lang == "ru"
                else "Confirm your subscription"
            ),
            body=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[subscriber.email],
        )
        msg.attach_alternative(html_message, "text/html")
        msg.send()

        return Response(
            {
                "message": "На указанный email отправлено письмо для подтверждения подписки."
            },
            status=status.HTTP_201_CREATED,
        )


# ---------------- Confirm Subscription -----------------------


class ConfirmSubscriptionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        # Ищем строго активную, но еще не подтвержденную подписку
        subscriber = get_object_or_404(
            Subscriber, token=token, is_active=True, is_verified=False
        )

        subscriber.is_verified = True
        subscriber.save()

        return Response(
            {"status": "success", "message": "Подписка успешно подтверждена!"},
            status=status.HTTP_200_OK,
        )


# ------------------- Unsubscribe --------------------------


class UnsubscribeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, token):
        # Мягкое удаление (Soft Delete) по токену из футера письма
        subscriber = get_object_or_404(Subscriber, token=token, is_active=True)

        subscriber.is_active = False
        subscriber.unsubscribed_at = timezone.now()  # Фиксируем точное время ухода
        subscriber.save()

        return Response(
            {"status": "success", "message": "Вы успешно отписались от рассылки."},
            status=status.HTTP_200_OK,
        )
