from rest_framework.permissions import BasePermission


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
