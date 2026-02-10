from uuid import UUID
from rest_framework.permissions import BasePermission
from rest_framework.request import Request


class IsRole(BasePermission):
    """
    Permission class to check if user has a required role
    """

    def has_permission(self, request, view):
        try:
            user_role = request.user.baseuserprofile.role
        except AttributeError:
            return False

        required_roles = getattr(view, "required_roles", [])
        if not required_roles:  # No roles specified, allow all
            return True

        return user_role in required_roles

