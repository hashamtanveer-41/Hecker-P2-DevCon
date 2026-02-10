from rest_framework import serializers
from .models import (
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


class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = "__all__"


class OperatingRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatingRoom
        fields = "__all__"


class BaseUserProfileSerializer(serializers.ModelSerializer):
    django_user = serializers.StringRelatedField()

    class Meta:
        model = BaseUserProfile
        fields = "__all__"


class SurgeonProfileSerializer(serializers.ModelSerializer):
    base_profile = BaseUserProfileSerializer(read_only=True)

    class Meta:
        model = SurgeonProfile
        fields = "__all__"


class StaffProfileSerializer(serializers.ModelSerializer):
    base_profile = BaseUserProfileSerializer(read_only=True)

    class Meta:
        model = StaffProfile
        fields = "__all__"


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = "__all__"


class SurgeryRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurgeryRequest
        fields = "__all__"


class SurgeryScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurgerySchedule
        fields = "__all__"


class RescheduleEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = RescheduleEvent
        fields = "__all__"


class SurgeryQueueSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurgeryQueue
        fields = "__all__"


class SurgeryEquipmentRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurgeryEquipmentRequirement
        fields = "__all__"


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = "__all__"


class EquipmentSterilizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentSterilization
        fields = "__all__"


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
