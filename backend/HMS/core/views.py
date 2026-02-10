from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request



class ProtectedView(APIView):
    permission_classes: list = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        return Response(
            {
                "user": request.user.username,
                "status": "authenticated",
            }
        )
