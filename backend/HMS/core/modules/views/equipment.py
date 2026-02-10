from typing import Optional
from uuid import UUID

from django.contrib.admin import action
from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from core.models import BaseUserProfile, Equipment
from core.serializers import EquipmentSerializer

from core.views import BaseLoggedInViewSet


class EquipmentViewSet(BaseLoggedInViewSet):
    """
    Equipment management ViewSet.

    Only admins can access.
    Currently only list and create can be explicitly enabled.
    """

    required_roles = ["admin"]

    def list(self, request: Request) -> Response:
        """
        GET /equipment/ — list equipment the admin can access.
        """
        # Multi-tenant: admins can only see their hospital
        hospital_id: str = request.user.baseuserprofile.hospital_id
        if not hospital_id:
            return Response(
                {"detail": "Cannot list equipment without hospital."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if hospital_id:
            equipment = Equipment.objects.filter(hospital_id=hospital_id)

        serializer = EquipmentSerializer(equipment, many=True)
        return Response(serializer.data)

    def create(self, request: Request) -> Response:
        """
        POST /equipment/ — create a new equipment.
        """
        hospital_id: str = request.user.baseuserprofile.hospital_id
        if not hospital_id:
            return Response(
                {"detail": "Cannot create equipment without hospital."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = request.data.copy()
        data["hospital"] = str(hospital_id)

        serializer = EquipmentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        equipment = serializer.save()
        return Response(
            EquipmentSerializer(equipment).data, status=status.HTTP_201_CREATED
        )

    def retrieve(self, request: Request, pk: Optional[str] = None) -> Response:
        """
        GET /equipment/<pk>/ — retrieve equipment if admin belongs to it.
        """
        try:
            hospital_id = request.user.baseuserprofile.hospital_id
            if not hospital_id:
                return Response(
                    {"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND
                )

            equipment = Equipment.objects.get(id=pk, hospital_id=hospital_id)
            serializer = EquipmentSerializer(equipment)
            return Response(serializer.data)
        except Equipment.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    def destroy(self, request: Request, pk: Optional[str] = None) -> Response:
        """
        DELETE /equipment/<pk>/ — delete equipment if admin belongs to it.
        """
        try:
            hospital_id = request.user.baseuserprofile.hospital_id
            if not hospital_id:
                return Response(
                    {"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND
                )

            equipment = Equipment.objects.get(id=pk, hospital_id=hospital_id)
            equipment.delete()
            return Response({"detail": "Deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Equipment.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
