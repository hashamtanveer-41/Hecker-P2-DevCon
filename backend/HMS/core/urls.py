from django.urls import path

from core.views import MyInfoView

urlpatterns: list = [
    path("my-info/", MyInfoView.as_view(), name="my_info"),
]
