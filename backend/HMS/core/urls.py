from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from core.views import MyInfoView, RoleTokenObtainPairView

urlpatterns: list = [
    path("api/v1/token/", RoleTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/v1/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/v1/my-info/", MyInfoView.as_view(), name="my_info"),
]
