from django.urls import path
from . import views

urlpatterns = [
    path("category_list/", views.category_list),
    path("categories/<slug:slug>", views.category_detail),
    path("post_list/", views.post_list),
    path("posts/<slug:slug>", views.post_detail),
    path("filtering/", views.post_filtering),
    path("get_filter_labels/", views.filter_labels),
]
