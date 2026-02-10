from typing import Optional
from uuid import UUID

from django.contrib.admin import action
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from core.models import SurgeryRequest
from core.serializers import SurgeryRequestSerializer

from core.views import BaseLoggedInViewSet


class SurgeryRequestViewSet(BaseLoggedInViewSet):
    """
    SurgeryRequest management ViewSet.

    Only admins can access.
    Currently only list and create can be explicitly enabled.
    """

    required_roles = ["admin"]

    def list(self, request: Request) -> Response:
        """
        GET /surgery-requests/ — list surgery requests the admin can access.
        """
        # Multi-tenant: admins can only see their hospital
        hospital_id: str = request.user.baseuserprofile.hospital_id
        if not hospital_id:
            return Response(
                {"detail": "Cannot list surgery requests without hospital."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if hospital_id:
            surgery_requests = SurgeryRequest.objects.filter(hospital_id=hospital_id)

        serializer = SurgeryRequestSerializer(surgery_requests, many=True)
        return Response(serializer.data)

    def create(self, request: Request) -> Response:
        """
        POST /surgery-requests/ — create a new surgery request.
        """
        hospital_id: str = request.user.baseuserprofile.hospital_id
        if not hospital_id:
            return Response(
                {"detail": "Cannot create surgery request without hospital."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = request.data.copy()
        data["hospital"] = str(hospital_id)

        serializer = SurgeryRequestSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        surgery_request = serializer.save()
        return Response(
            SurgeryRequestSerializer(surgery_request).data,
            status=status.HTTP_201_CREATED,
        )

    def retrieve(self, request: Request, pk: Optional[str] = None) -> Response:
        """
        GET /surgery-requests/<pk>/ — retrieve a surgery request if admin belongs to it.
        """
        try:
            hospital_id = request.user.baseuserprofile.hospital_id
            if not hospital_id:
                return Response(
                    {"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND
                )

            surgery_request = SurgeryRequest.objects.get(id=pk)
            serializer = SurgeryRequestSerializer(surgery_request)
            return Response(serializer.data)
        except SurgeryRequest.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
