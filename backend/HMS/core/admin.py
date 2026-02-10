from django.contrib import admin
from core.models import (
    Hospital,
    OperatingRoom,
    BaseUserProfile,
    SurgeonProfile,
    StaffProfile,
    Patient,
    SurgeryRequest,
    SurgerySchedule,
    RescheduleEvent,
    SurgeryQueue,
    SurgeryEquipmentRequirement,
    Equipment,
    EquipmentSterilization,
    Notification,
)


admin.site.register(Hospital)
admin.site.register(OperatingRoom)
admin.site.register(BaseUserProfile)
admin.site.register(SurgeonProfile)
admin.site.register(StaffProfile)
admin.site.register(Patient)
admin.site.register(SurgeryRequest)
admin.site.register(SurgerySchedule)
admin.site.register(RescheduleEvent)
admin.site.register(SurgeryQueue)
admin.site.register(SurgeryEquipmentRequirement)
admin.site.register(Equipment)
admin.site.register(EquipmentSterilization)
admin.site.register(Notification)
