from django.urls import path

from core.modules.views.get_requests import GetHospitals

from core.views import MyInfoView

urlpatterns: list = [
    path("my-info/", MyInfoView.as_view(), name="my_info"),
    # get requests
    path("hospitals/get", GetHospitals.as_view(), name="get_hospitals"),
]
