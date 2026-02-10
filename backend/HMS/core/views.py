from uuid import UUID

from rest_framework import status, viewsets, views
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from jwt_auth.permissions import IsRole
from core.models import Hospital
from core.serializers import HospitalSerializer


class BaseLoggedInView(views.APIView):
    """
    Base view for logged-in users using ViewSets.
    All actions disabled by default.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsRole]
    required_roles: list = []  # To be set by subclasses
    role = "unknown"

    def initial(self, request: Request, *args, **kwargs) -> None:
        super().initial(request, *args, **kwargs)
        try:
            self.role = request.user.baseuserprofile.role
        except AttributeError:
            self.role = "unknown"


class MyInfoView(BaseLoggedInView):
    """
    View for users to retrieve their own information.

    Accessible by all authenticated users.
    """

    required_roles = ["admin", "doctor", "nurse", "patient"]

    def get(self, request: Request):
        """
        GET /my-info/ — retrieve the user's own information.
        """
        user = request.user
        profile = getattr(user, "baseuserprofile", None)
        if profile:
            data = {
                "username": user.username,
                "email": user.email,
                "role": profile.role,
                "hospital_id": profile.hospital_id,
            }
        else:
            data = {
                "username": user.username,
                "email": user.email,
                "role": "unknown",
                "hospital_id": None,
            }
        return Response(data)


class BaseLoggedInViewSet(viewsets.ViewSet):
    """
    Base view for logged-in users using ViewSets.
    All actions disabled by default.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsRole]
    required_roles: list = []  # To be set by subclasses
    role = "unknown"

    def initial(self, request: Request, *args, **kwargs) -> None:
        super().initial(request, *args, **kwargs)
        try:
            self.role = request.user.baseuserprofile.role
        except AttributeError:
            self.role = "unknown"

    # By default, all actions return 405 Method Not Allowed
    def list(self, request, *args, **kwargs):
        return Response(
            {"detail": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def create(self, request, *args, **kwargs):
        return Response(
            {"detail": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def retrieve(self, request, *args, **kwargs):
        return Response(
            {"detail": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def update(self, request, *args, **kwargs):
        return Response(
            {"detail": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def partial_update(self, request, *args, **kwargs):
        return Response(
            {"detail": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED
        )

    def destroy(self, request, *args, **kwargs):
        return Response(
            {"detail": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED
        )


from core.modules.views.hospital import HospitalViewSet
from core.modules.views.operating_room import OperatingRoomViewSet
from core.modules.views.staff import StaffViewSet
from core.modules.views.equipment import EquipmentViewSet
from core.modules.views.surgery_requests import SurgeryRequestViewSet
from core.modules.views.schedule import SurgeryScheduleViewSet
