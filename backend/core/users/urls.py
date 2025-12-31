from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import include, path

router = DefaultRouter()
router.register("register", RegisterViewset, basename="register")
router.register("login", LoginViewset, basename="login")
router.register("users", UserViewset, basename="users")
# urlpatterns = router.urls

urlpatterns = [
    path("", include(router.urls)),
    # path('current-user/', CurrentUserView.as_view(), name='current_user'),
]
