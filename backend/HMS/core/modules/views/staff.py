from typing import Optional
from uuid import UUID

from django.contrib.admin import action
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from core.models import BaseUserProfile, StaffProfile
from core.serializers import StaffProfileSerializer

from core.views import BaseLoggedInViewSet


class StaffViewSet(BaseLoggedInViewSet):
    """
    Staff management ViewSet.

    Only admins can access.
    Currently only list and create can be explicitly enabled.
    """

    required_roles = ["admin"]

    def list(self, request: Request) -> Response:
        """
        GET /staff/ — list staff profiles the admin can access.
        """
        # Multi-tenant: admins can only see their hospital
        hospital_id: str = request.user.baseuserprofile.hospital_id
        if not hospital_id:
            return Response(
                {"detail": "Cannot list staff without hospital."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if hospital_id:
            staff_profiles = StaffProfile.objects.filter(
                base_profile__hospital_id=hospital_id
            )

        serializer = StaffProfileSerializer(staff_profiles, many=True)
        return Response(serializer.data)

    def create(self, request: Request) -> Response:
        """
        POST /staff/ — create a StaffProfile for the logged-in user.
        """
        try:
            base_profile = request.user.baseuserprofile
        except AttributeError:
            return Response(
                {"detail": "Logged-in user does not have a BaseUserProfile."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = request.data.copy()
        data["start_time"] = data.get("start_time")
        data["end_time"] = data.get("end_time")
        data["is_on_call"] = data.get("is_on_call", False)

        # Create the StaffProfile using the base_profile instance directly
        try:
            staff_profile = StaffProfile.objects.create(
                base_profile=BaseUserProfile.objects.get(
                    id=data.get("base_profile_id")
                ),
                start_time=data["start_time"],
                end_time=data["end_time"],
                is_on_call=data["is_on_call"],
            )
        except BaseUserProfile.DoesNotExist:
            return Response(
                {"detail": "Please give a valid base_profile_id."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = StaffProfileSerializer(staff_profile)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def retrieve(self, request: Request, pk: Optional[str] = None) -> Response:
        """
        GET /staff/<pk>/ — retrieve a staff profile if admin belongs to the same hospital.
        """
        try:
            staff_profile = StaffProfile.objects.get(id=pk)
        except StaffProfile.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if the staff profile belongs to the same hospital as the admin
        hospital_id = request.user.baseuserprofile.hospital_id
        if staff_profile.base_profile.hospital_id != hospital_id:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = StaffProfileSerializer(staff_profile)
        return Response(serializer.data)
