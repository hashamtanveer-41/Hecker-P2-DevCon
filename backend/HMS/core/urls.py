from django.urls import path, include
from core.views import MyInfoView

from rest_framework.routers import DefaultRouter
from core.views import HospitalViewSet

router = DefaultRouter()
router.register(r"hospitals", HospitalViewSet, basename="hospital")

urlpatterns = [
    path("my-info/", MyInfoView.as_view(), name="my_info"),
    path("", include(router.urls)),
]
