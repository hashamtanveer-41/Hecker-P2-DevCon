from rest_framework.request import Request

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from jwt_auth.permissions import IsRole


class BaseLoggedInView(APIView):
    """
    Base view for logged in users.

    Requires JWT Token and X-Hospital-ID header.
    Requires the user to have a role in the hospital.
    """

    permission_classes: list = [IsAuthenticated, IsRole]

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
    Returns the user's information, including username, role, and hospital ID.
    """

    def get(self, request: Request) -> Response:
        return Response(
            {
                "username": request.user.username,
                "role": self.role,
                "hospital_id": (
                    request.user.baseuserprofile.hospital_id
                    if hasattr(request.user, "baseuserprofile")
                    else None
                ),
            }
        )
