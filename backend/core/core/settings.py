from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import os
from corsheaders.defaults import default_headers

load_dotenv()


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = "django-insecure-etjh)qgezf$@v!)k)zuxbgk!hub#7$2o=bwinzv828+fef#0ov"
SECRET_KEY = os.getenv("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

if DEBUG:
    ALLOWED_HOSTS = [
        "localhost",
        "127.0.0.1",
        "192.168.20.2",
        "e-shop-ts-back.onrender.com",
    ]
else:
    ALLOWED_HOSTS = [
        "eshop.gaidysheff.ru",
        "www.eshop.gaidysheff.ru",
        # "https://mwu0o2-83-217-13-197.ru.tuna.am",
    ]

# ALLOWED_HOSTS = [
#     "localhost",
#     "127.0.0.1",
#     "192.168.20.2",
#     # "e-shop-ts-back.onrender.com",  # Домен вашего сервера на Render
#     # "test.gaidysheff.ru",
#     # "www.test.gaidysheff.ru",
#     "eshop.gaidysheff.ru",
#     "www.eshop.gaidysheff.ru",
# ]


CSRF_TRUSTED_ORIGINS = [
    "https://eshop.gaidysheff.ru",
    "https://e-website-ts.vercel.app",
]
# CSRF_TRUSTED_ORIGINS = ["https://mwu0o2-83-217-13-197.ru.tuna.am"]


# Application definition

INSTALLED_APPS = [
    "modeltranslation",  # Обязательно сверху!
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "api.apps.ApiConfig",
    "app_news.apps.AppNewsConfig",
    "users.apps.UsersConfig",
    "mailing.apps.MailingConfig",
    "rest_framework",
    "django_rest_passwordreset",
    "corsheaders",
    "knox",
    "crispy_forms",
    "crispy_bootstrap4",
    "drf_spectacular",
    "colorfield",
    "social_django",  # Пакет для интеграции социальных сетей
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    # "corsheaders.middleware.CorsMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    # <-- СТРОГО ОБЯЗАТЕЛЬНО ДЛЯ ПЕРЕВОДОВ API!
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

AUTH_USER_MODEL = "users.CustomUser"

AUTHENTICATION_BACKENDS = [
    # 'users.auth_backend.EmailBackend',
    # "social_core.backends.vk.VKOAuth2",  # Для VK
    "social_core.backends.yandex.YandexOAuth2",  # Добавляем Яндекс
    # "social_core.backends.ok.OKOAuth2",  # Для Одноклассников
    # "social_core.backends.odnoklassniki.OdnoklassnikiOAuth2"
    # "social_core.backends.mailru.MailruOAuth2",  # Для Mail.ru
    "django.contrib.auth.backends.ModelBackend",  # this line fixed the problem
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ("knox.auth.TokenAuthentication",),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",  # Всё закрыто по умолчанию
    ],
}

SPECTACULAR_SETTINGS = {
    "TITLE": "My Ecommerce Project",
    "DESCRIPTION": "Your project description",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

WSGI_APPLICATION = "core.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases


if DEBUG:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": "gaidys2d_eshop",
            "USER": "gaidys2d_eshop",
            "PASSWORD": "sHDfv3vn8!8!",
            #         "NAME": "gaidys2d_ecomm",
            #         "USER": "gaidys2d_ecomm",
            #         "PASSWORD": "9UCy4dPbR&nA",
            "HOST": "localhost",
            "POST": "3306",
        },
        "OPTIONS": {
            "init_command": "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = []

# AUTH_PASSWORD_VALIDATORS = [
#     {
#         "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
#     },
#     {
#         "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
#     },
#     {
#         "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
#     },
#     {
#         "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
#         "OPTIONS": {
#             "min_length": 4,  # Set your desired minimum length here
#         },
#     },
# ]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

# LANGUAGE_CODE = "en-us"

LANGUAGE_CODE = "ru"
LANGUAGES = [
    ("ru", "Русский"),
    ("en", "English"),
]

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = "static/"
MEDIA_URL = "/media/"

if DEBUG:
    STATIC_ROOT = os.path.join(BASE_DIR, "static")
    MEDIA_ROOT = os.path.join(BASE_DIR, "media")
    STATICFILES_DIRS = [os.path.join(BASE_DIR, "mailing/static")]
else:
    STATIC_ROOT = "/home/g/gaidys2d/eshop/backend_app/static"
    MEDIA_ROOT = "/home/g/gaidys2d/eshop/backend_app/core/media"

# STATIC_ROOT = os.path.join(BASE_DIR, "static")
# MEDIA_ROOT = os.path.join(BASE_DIR, "media")
# STATICFILES_DIRS = [os.path.join(BASE_DIR, "mailing/static")]
# !!! ДЛЯ ДЕПЛОЯ - Пути должны быть абсолютными
# STATIC_ROOT = '/home/g/gaidys2d/eshop/backend_app/static'
# MEDIA_ROOT = '/home/g/gaidys2d/eshop/backend_app/media'


# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS settings


CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap4"
CRISPY_TEMPLATE_PACK = "bootstrap4"

CORS_ALLOW_HEADERS = list(default_headers) + [
    "accept-language",  # Разрешаем читать этот заголовок при CORS-запросах
]

# 1. ОТКЛЮЧАЕМ разрешение для всех (это ломает запросы с credentials)
CORS_ALLOW_ALL_ORIGINS = False

# 2. CORS_ALLOWED_ORIGINS — это домены ФРОНТЕНДА, которым разрешено делать запросы.
# ВАЖНО: без путей (/ru, /en) на конце! Только протокол и домен.
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",  # СТРОГО БЕЗ слэша на конце!
#     "http://127.0.0.1:5173",
#     "http://172.27.32.1:5173",
#     "http://192.168.20.2:5173",
#     "https://test.gaidysheff.ru",  # Без /ru и /en! и СТРОГО БЕЗ слэша на конце!
#     "https://eshop.gaidysheff.ru",  # Без /ru и /en! и СТРОГО БЕЗ слэша на конце!
#     "https://e-website-ts.vercel.app",  # Без /ru и /en! и СТРОГО БЕЗ слэша на конце!
# ]

# 3. Обязательно разрешаем передачу учетных данных (куки/токены)
CORS_ALLOW_CREDENTIALS = True  # Обязательно разрешаем передачу кук/авторизации

if DEBUG:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",  # СТРОГО БЕЗ слэша на конце!
        "http://127.0.0.1:5173",
        "http://172.27.32.1:5173",
        "http://192.168.20.2:5173",
        # "https://cloudflare.com",
    ]
else:
    CORS_ALLOWED_ORIGINS = [
        "https://gaidysheff.ru",
        "https://e-website-ts.vercel.app",
        # "https://cloudflare.com",
    ]

CORS_ALLOW_HEADERS = list(default_headers) + [
    "accept-language",
    "authorization",
    "content-type",
    "accept",
    "origin",
    "x-csrftoken",
]

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

# ======================= STRIPE ==========================

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PUBLIC_KEY = os.getenv("STRIPE_PUBLIC_KEY")

WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET")

# Если переменная в .env пустая, подставится локальный адрес разработки
BASE_URL_FRONTEND = os.getenv("BASE_URL_FRONTEND", "eshop.gaidysheff.ru")
FRONTEND_URL = BASE_URL_FRONTEND  # дублируем для совместимости
# Если переменная в .env пустая, подставится локальный адрес разработки
BASE_URL_BACKEND = os.getenv("BASE_URL_FRONTEND", "eshop.gaidysheff.ru")

# BASE_URL_FRONTEND = os.getenv("BASE_URL_FRONTEND", "http://localhost:5173")

# =================== Cloud Payments =======================

CLOUD_PAYMENTS_API_SECRET_KEY = os.getenv("CLOUD_PAYMENTS_API_SECRET_KEY")
CLOUD_PAYMENTS_PUBLIC_ID = os.getenv("CLOUD_PAYMENTS_PUBLIC_ID")

# ===================== for Social Auth =====================
# Позволяет всплывающему окну общаться с вашим приложением
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin-allow-popups"
# Необязательно, но полезно для работы с внешними ресурсами (Google, карты)
SECURE_REFERRER_POLICY = "no-referrer-when-downgrade"

# APPEND_SLASH = False

# Ключи из личного кабинета VK
SOCIAL_AUTH_VKID_OAUTH2_KEY = os.getenv("SOCIAL_AUTH_VKID_OAUTH2_KEY")
SOCIAL_AUTH_VKID_OAUTH2_SECRET = os.getenv("SOCIAL_AUTH_VKID_OAUTH2_SECRET")

# Ключи из личного кабинета OK
SOCIAL_AUTH_OK_OAUTH2_KEY = "client_id_ok"
SOCIAL_AUTH_OK_OAUTH2_SECRET = "secret_key_ok"

# Ключи из личного кабинета Яндекса
SOCIAL_AUTH_YANDEX_OAUTH2_KEY = os.getenv("SOCIAL_AUTH_YANDEX_OAUTH2_KEY")
SOCIAL_AUTH_YANDEX_OAUTH2_SECRET = os.getenv("SOCIAL_AUTH_YANDEX_OAUTH2_SECRET")

# Запрашиваем у Яндекса расширенные данные (заголовки)
SOCIAL_AUTH_YANDEX_OAUTH2_SCOPE = [
    "login:email",
    "login:info",
    "login:birthday",
    "login:avatar",
    "login:default_phone",
]

# Настройка создания пользователя: Django автоматически создаст юзера
# в вашей модели, если его еще нет в базе, или свяжет по email.
SOCIAL_AUTH_PIPELINE = (
    "social_core.pipeline.social_auth.social_details",
    "social_core.pipeline.social_auth.social_uid",
    "social_core.pipeline.social_auth.auth_allowed",
    "social_core.pipeline.social_auth.social_user",
    "social_core.pipeline.user.get_username",
    "social_core.pipeline.social_auth.associate_by_email",
    # Ели юзер уже есть с таким email — связываем, а не создаем дубликат!
    "social_core.pipeline.user.create_user",
    # Если юзера нет — создаем в БД
    "social_core.pipeline.social_auth.associate_user",
    "social_core.pipeline.social_auth.load_extra_data",
    "social_core.pipeline.user.user_details",
    # Заполняет first_name, last_name, email
    "api.users.pipelines.save_custom_user_details",
    # Наш кастомный шаг для даты рождения и телефона!
)

# Фиксируем адрес возврата для бэкенда. Он должен СТРОГО совпадать с фронтендом!
if DEBUG:
    SOCIAL_AUTH_YANDEX_OAUTH2_REDIRECT_URL = (
        "http://localhost:5173/ru/social-auth-callback"
    )
    SOCIAL_AUTH_VKID_OAUTH2_REDIRECT_URL = "http://localhost:5173/ru/vk-auth-callback"
else:
    SOCIAL_AUTH_YANDEX_OAUTH2_REDIRECT_URL = (
        "https://eshop.gaidysheff.ru/ru/social-auth-callback"
    )
    SOCIAL_AUTH_VKID_OAUTH2_REDIRECT_URL = (
        "https://eshop.gaidysheff.ru/ru/vk-auth-callback"
    )


EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

if DEBUG:
    # ======================= Gmail ==========================
    EMAIL_HOST = "smtp.gmail.com"
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True
    DEFAULT_FROM_EMAIL = "KALIKA Shop <gaidysheff@gmail.com>"
    EMAIL_HOST_USER = os.getenv("GMAIL_EMAIL_HOST_USER")
    EMAIL_HOST_PASSWORD = os.getenv("GMAIL_EMAIL_HOST_PASSWORD")

    # ======================= Yandex ==========================
    # EMAIL_HOST = "smtp.yandex.ru"
    # EMAIL_PORT = 465
    # EMAIL_HOST_USER = os.getenv("YANDEX_EMAIL_HOST_USER")
    # EMAIL_HOST_PASSWORD = os.getenv("YANDEX_EMAIL_HOST_PASSWORD")
    # EMAIL_USE_SSL = True

    # ACCOUNT_EMAIL_REQUIRED = True
    # ACCOUNT_UNIQUE_EMAIL = True
    # ACCOUNT_USERNAME_REQUIRED = False
    # ACCOUNT_AUTHENTICATION_METHOD = "email"
    # ACCOUNT_EMAIL_VERIFICATION = "mandatory"
else:
    # =============== email Beget localhost ===================
    EMAIL_HOST = "smtp.beget.com"  # Используем хост Beget
    EMAIL_PORT = 2525  # Используем успешный порт из telnet!
    EMAIL_HOST_USER = os.getenv(
        "BEGET_EMAIL_HOST_USER"
    )  # Корпоративный ящик (полностью с доменом)
    EMAIL_HOST_PASSWORD = os.getenv("BEGET_EMAIL_HOST_PASSWORD")
    EMAIL_USE_TLS = False  # Отключаем TLS, чтобы обойти ошибку сертификатов
    EMAIL_TIMEOUT = 5
    # Адрес отправителя по умолчанию (должен совпадать с EMAIL_HOST_USER)
    DEFAULT_FROM_EMAIL = "info@gaidysheff.ru"
