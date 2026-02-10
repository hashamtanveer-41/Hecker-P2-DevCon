from typing import Optional
from uuid import UUID

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response

from core.models import Hospital
from core.serializers import HospitalSerializer

from core.views import BaseLoggedInViewSet


class HospitalViewSet(BaseLoggedInViewSet):
    """
    Hospital management ViewSet.

    Only admins can access.
    Currently only list and create can be explicitly enabled.
    """

    required_roles = ["admin"]

    def list(self, request: Request) -> Response:
        """
        GET /hospitals/ — list hospitals the admin can access.
        """
        # Multi-tenant: admins can only see their hospital
        hospital_id: str = request.user.baseuserprofile.hospital_id
        # If admin is multi-tenant and belongs to a single hospital, enforce that.
        if not hospital_id:
            return Response(
                {"detail": "Cannot list hospitals without hospital."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if hospital_id:
            hospitals = Hospital.objects.filter(id=hospital_id)
        else:
            hospitals = Hospital.objects.none()

        serializer = HospitalSerializer(hospitals, many=True)
        return Response(serializer.data)

    def create(self, request: Request) -> Response:
        """
        POST /hospitals/ — create a new hospital.
        """
        serializer = HospitalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        hospital = serializer.save()
        return Response(
            HospitalSerializer(hospital).data, status=status.HTTP_201_CREATED
        )

    def retrieve(self, request: Request, pk: Optional[str] = None) -> Response:
        """
        GET /hospitals/<pk>/ — retrieve a hospital if admin belongs to it.
        """
        try:
            hospital_id = request.user.baseuserprofile.hospital_id
            if hospital_id and str(hospital_id) != pk:
                return Response(
                    {"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND
                )

            hospital = Hospital.objects.get(id=pk)
            serializer = HospitalSerializer(hospital)
            return Response(serializer.data)
        except Hospital.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
