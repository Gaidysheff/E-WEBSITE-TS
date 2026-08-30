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
    category_query = request.query_params.get("category", "")

    # Начинаем со всех постов
    posts = Post.objects.all().order_by("id")
    # Сначала ВСЕГДА инициализируем базовый QuerySet
    # .order_by('id') ОБЯЗАТЕЛЕН для стабильной пагинации

    # Добавляем фильтр по категории
    if category_query:
        posts = posts.filter(category__slug=category_query)

    serializer = PostListSerializer(posts, many=True)
    # serializer = PostListSerializer(page_obj, many=True)

    return Response(
        {
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
