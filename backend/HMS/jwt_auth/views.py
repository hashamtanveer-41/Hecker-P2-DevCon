from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenObtainPairView

from jwt_auth.serializers import RoleTokenObtainPairSerializer


class RoleTokenObtainPairView(TokenObtainPairView):
    serializer_class = RoleTokenObtainPairSerializer


class LoginView(APIView):
    """
    Login view: issues JWT tokens, sets refresh token in HTTP-only cookie
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        try:
            role = user.baseuserprofile.role
        except AttributeError:
            role = "unknown"
        refresh["role"] = role
        access = refresh.access_token

        # Set refresh token in HttpOnly cookie
        response = Response(
            {
                "access": str(access),
                "role": role,
            },
            status=status.HTTP_200_OK,
        )
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,  # MUST be False on http
            samesite="Lax",  # NOT Strict for cross-origin dev
            max_age=7 * 24 * 60 * 60,  # 7 days, match your refresh token lifetime
        )
        return response


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token missing"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response(
                {"detail": "Invalid refresh token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        response = Response(
            {"detail": "Logged out successfully"},
            status=status.HTTP_200_OK,
        )
        response.delete_cookie("refresh_token")
        return response
