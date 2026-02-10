from uuid import UUID

from rest_framework import status, viewsets, views
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from jwt_auth.permissions import IsRole
from core.models import Hospital
from core.serializers import HospitalSerializer


class BaseLoggedInView(views.APIView):
    """
    Base view for logged-in users using ViewSets.

    Requires JWT Token and role enforcement.
    All actions disabled by default.
    """

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

    Requires JWT Token and role enforcement.
    All actions disabled by default.
    """

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


class HospitalViewSet(BaseLoggedInViewSet):
    """
    Hospital management ViewSet.

    Only admins can access.
    Currently only list and create can be explicitly enabled.
    """

    required_roles = ["admin"]

    def list(self, request: Request):
        """
        GET /hospitals/ — list hospitals the admin can access.
        """
        # Multi-tenant: admins can only see their hospital
        hospital_id = getattr(request.user.baseuserprofile, "hospital_id", None)
        if hospital_id:
            hospitals = Hospital.objects.filter(id=hospital_id)
        else:
            hospitals = Hospital.objects.none()

        serializer = HospitalSerializer(hospitals, many=True)
        return Response(serializer.data)

    def create(self, request: Request):
        """
        POST /hospitals/ — create a new hospital.
        """
        serializer = HospitalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        hospital = serializer.save()
        return Response(
            HospitalSerializer(hospital).data, status=status.HTTP_201_CREATED
        )

    def retrieve(self, request: Request, pk=None):
        """
        GET /hospitals/<pk>/ — retrieve a hospital if admin belongs to it.
        """
        try:
            hospital_id = getattr(request.user.baseuserprofile, "hospital_id", None)
            if hospital_id != UUID(pk):
                return Response(
                    {"detail": "Access denied"}, status=status.HTTP_403_FORBIDDEN
                )

            hospital = Hospital.objects.get(pk=pk)
            serializer = HospitalSerializer(hospital)
            return Response(serializer.data)
        except Hospital.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
