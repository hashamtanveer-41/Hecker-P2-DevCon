from rest_framework.request import Request
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RoleTokenObtainPairSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsRole


class RoleTokenObtainPairView(TokenObtainPairView):
    serializer_class = RoleTokenObtainPairSerializer



class UserRoleView(APIView):
    """
    Returns the role of the currently authenticated user.
    """
    permission_classes: list = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        try:
            role = request.user.baseuserprofile.role
        except AttributeError:
            role = "unknown"
        return Response({
            "username": request.user.username,
            "role": role
        })