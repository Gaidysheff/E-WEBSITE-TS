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

from .models import Category, Post
from .serializers import (
    CategoryDetailSerializer,
    CategoryListSerializer,
    PostDetailSerializer,
    PostListSerializer,
)
from rest_framework.decorators import (
    api_view,
    permission_classes,
)

from rest_framework.permissions import AllowAny

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


# ======================= Filtering =============================
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
