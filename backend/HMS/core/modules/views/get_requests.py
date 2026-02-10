from rest_framework.request import Request
from rest_framework.response import Response

from core.models import Hospital
from core.views import BaseLoggedInView


class GetHospitals(BaseLoggedInView):

    required_roles: list = ["admin"]

    def get(self, request: Request) -> Response:
        hospital_id = request.user.baseuserprofile.hospital_id
        hospitals = Hospital.objects.filter(id=hospital_id)
        hospital_data = [
            {
                "id": str(hospital.id),
                "name": hospital.name,
                "code": hospital.code,
                "timezone": hospital.timezone,
            }
            for hospital in hospitals
        ]
        return Response(hospital_data)
