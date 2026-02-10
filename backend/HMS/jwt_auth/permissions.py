from uuid import UUID
from rest_framework.permissions import BasePermission
from rest_framework.request import Request


class IsRole(BasePermission):
    """
    Permission class to check if user has a required role
    """

    required_roles: list[str] = []

    def has_permission(self, request, view):
        try:
            user_role = request.user.baseuserprofile.role
        except AttributeError:
            return False
        return user_role in self.required_roles


class HasHospitalHeader(BasePermission):
    """
    Ensures the request includes a valid X-Hospital-ID header.
    """

    def has_permission(self, request: Request, view) -> bool:
        hospital_id = request.headers.get("X-Hospital-ID")
        if not hospital_id:
            return False

        try:
            # Validate UUID format
            UUID(hospital_id, version=4)
        except ValueError:
            return False

        return True
