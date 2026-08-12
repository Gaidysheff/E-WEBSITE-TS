from django.contrib import admin
from django.urls import path, include
from knox import views as knox_views

from django.conf.urls.static import static
from core import settings

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/app_news/", include("app_news.urls")),
    path("api/core_app/", include("api.urls")),
    # path("auth/", include("knox.urls")),
    path("api/mailing/", include("mailing.urls")),
    path(
        "api/password_reset/",
        include("django_rest_passwordreset.urls", namespace="password_reset"),
    ),
    path("api/logout/", knox_views.LogoutView.as_view(), name="knox_logout"),
    path("api/logoutall/", knox_views.LogoutAllView.as_view(), name="knox_logoutall"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    # Optional UI:
    path(
        "schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "schema/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_header = "Панель администрирования Базы Данных магазина E-Shop Kalika"
admin.site.index_title = "Разделы Базы Данных магазина E-Shop Kalika"
