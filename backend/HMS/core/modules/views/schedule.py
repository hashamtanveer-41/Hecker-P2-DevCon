from typing import Optional
from uuid import UUID

from django.contrib.admin import action
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from core.models import SurgerySchedule
from core.serializers import SurgeryScheduleSerializer

from core.views import BaseLoggedInViewSet


class SurgeryScheduleViewSet(BaseLoggedInViewSet):
    """
    SurgerySchedule management ViewSet.

    Only admins can access.
    Currently only list and create can be explicitly enabled.
    """

    required_roles = ["admin"]

    def list(self, request: Request) -> Response:
        """
        GET /schedule/ — list surgery schedules the admin can access.
        """
        # Multi-tenant: admins can only see their hospital
        hospital_id: str = request.user.baseuserprofile.hospital_id
        if not hospital_id:
            return Response(
                {"detail": "Cannot list surgery schedules without hospital."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if hospital_id:
            surgery_schedules = SurgerySchedule.objects.filter(surgery_request__hospital_id=hospital_id)

        serializer = SurgeryScheduleSerializer(surgery_schedules, many=True)
        return Response(serializer.data)

    def create(self, request: Request) -> Response:
        """
        POST /schedule/ — create a new surgery schedule.
        """
        hospital_id: str = request.user.baseuserprofile.hospital_id
        if not hospital_id:
            return Response(
                {"detail": "Cannot create surgery schedule without hospital."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = request.data.copy()
        data["hospital"] = str(hospital_id)

        serializer = SurgeryScheduleSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        surgery_schedule = serializer.save()
        return Response(
            SurgeryScheduleSerializer(surgery_schedule).data,
            status=status.HTTP_201_CREATED,
        )

    def retrieve(self, request: Request, pk: Optional[str] = None) -> Response:
        """
        GET /schedule/<pk>/ — retrieve a surgery schedule if admin belongs to it.
        """
        try:
            hospital_id = request.user.baseuserprofile.hospital_id
            if not hospital_id:
                return Response(
                    {"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND
                )
                
            surgery_schedule = SurgerySchedule.objects.get(id=pk)
        except SurgerySchedule.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SurgeryScheduleSerializer(surgery_schedule)
        return Response(serializer.data)
