from django.urls import path
from jwt_auth.views import LoginView, LogoutView, RoleTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns: list = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/", RoleTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
