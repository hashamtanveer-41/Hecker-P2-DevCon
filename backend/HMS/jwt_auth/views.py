from rest_framework.request import Request
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RoleTokenObtainPairSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import HasHospitalHeader, IsRole


class RoleTokenObtainPairView(TokenObtainPairView):
    serializer_class = RoleTokenObtainPairSerializer


class MyInfoView(APIView):
    """
    Returns the role of the authenticated user.
    Requires JWT and X-Hospital-ID header.
    """

    permission_classes: list = [IsAuthenticated, HasHospitalHeader]

    def get(self, request: Request) -> Response:
        try:
            role = request.user.baseuserprofile.role
        except AttributeError:
            role = "unknown"

        hospital_id = request.headers.get("X-Hospital-ID")

        return Response(
            {
                "username": request.user.username,
                "role": role,
                "hospital_id": hospital_id,
            }
        )
