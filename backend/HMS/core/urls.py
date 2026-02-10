from django.urls import path, include

from rest_framework.routers import DefaultRouter
from core.views import *

router = DefaultRouter()
router.register(r"hospitals", HospitalViewSet, basename="hospital")
router.register(r"operating-rooms", OperatingRoomViewSet, basename="operatingroom")
router.register(r"staff", StaffViewSet, basename="staff")
router.register(r"equipment", EquipmentViewSet, basename="equipment")
router.register(r"surgery-requests", SurgeryRequestViewSet, basename="surgeryrequest")
router.register(r"schedule", SurgeryScheduleViewSet, basename="schedule")

# # Additional APIViews that are not simple viewsets:
# additional_urlpatterns = [
#     path("scheduler/run", SchedulerRunView.as_view(), name="scheduler_run"),
#     path(
#         "scheduler/emergency",
#         SchedulerEmergencyView.as_view(),
#         name="scheduler_emergency",
#     ),
#     path("calendar/day", CalendarDayView.as_view(), name="calendar_day"),
#     path("calendar/week", CalendarWeekView.as_view(), name="calendar_week"),
#     path("priority-queue", PriorityQueueView.as_view(), name="priority_queue"),
#     path("sync/push", SyncPushView.as_view(), name="sync_push"),
#     path("audit-logs", AuditLogsView.as_view(), name="audit_logs"),
# ]

# Final urlpatterns you can include in your core.urls or project urls.py
urlpatterns = [
    path("", include(router.urls)),
]
# ] + additional_urlpatterns
