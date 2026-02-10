from typing import Optional
from uuid import UUID

from django.contrib.admin import action
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from core.models import OperatingRoom
from core.serializers import HospitalSerializer, OperatingRoomSerializer

from core.views import BaseLoggedInViewSet


class OperatingRoomViewSet(BaseLoggedInViewSet):
    """
    Operating Room management ViewSet.

    Only admins can access.
    Currently only list and create can be explicitly enabled.
    """

    required_roles = ["admin"]

    def list(self, request: Request) -> Response:
        """
        GET /operating-rooms/ — list operating rooms the admin can access.
        """
        # Multi-tenant: admins can only see their hospital
        hospital_id: str = request.user.baseuserprofile.hospital_id
        if not hospital_id:
            return Response(
                {"detail": "Cannot list operating room without hospital."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if hospital_id:
            operating_rooms = OperatingRoom.objects.filter(hospital_id=hospital_id)

        serializer = OperatingRoomSerializer(operating_rooms, many=True)
        return Response(serializer.data)

    def create(self, request: Request) -> Response:
        """
        POST /operating-rooms/ — create a new operating room.
        """
        hospital_id: str = request.user.baseuserprofile.hospital_id
        if not hospital_id:
            return Response(
                {"detail": "Cannot create operating room without hospital."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = request.data.copy()
        data["hospital"] = str(hospital_id)

        serializer = OperatingRoomSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        operating_room = serializer.save()
        return Response(
            OperatingRoomSerializer(operating_room).data,
            status=status.HTTP_201_CREATED,
        )
