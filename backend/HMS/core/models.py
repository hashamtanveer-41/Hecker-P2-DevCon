from turtle import mode
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid

# MARK: Hospital


class Hospital(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    timezone = models.CharField(max_length=64, default="UTC")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class OperatingRoom(models.Model):
    ROOM_TYPES = [
        ("general", "General"),
        ("cardiac", "Cardiac"),
        ("neuro", "Neuro"),
        ("ortho", "Orthopedic"),
    ]

    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    operating_room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    is_available = models.BooleanField(default=True)
    has_anesthesia = models.BooleanField(default=True)
    has_imaging = models.BooleanField(default=False)
    maintenance_until = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.hospital.name} - {self.name}"


# MARK: Users


class BaseUserProfile(models.Model):
    django_user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="baseuserprofile")
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, null=True)
    role = models.CharField(
        max_length=30,
        choices=[
            ("admin", "Hospital Admin"),
            ("room_manager", "Operating Room Manager"),
            ("surgeon", "Surgeon"),
            ("scheduler", "Scheduler"),
            ("nurse", "Nurse"),
        ],
    )

    def __str__(self):
        return f"{self.django_user.get_username()} ({self.role})"


class SurgeonProfile(models.Model):
    base_profile = models.OneToOneField(BaseUserProfile, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)
    max_daily_hours = models.IntegerField(default=12)

    def __str__(self):
        return self.base_profile.django_user.get_username()


class StaffProfile(models.Model):
    base_profile = models.ForeignKey(BaseUserProfile, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_on_call = models.BooleanField(
        default=False,
        help_text="Indicates if the staff is available for emergency surgeries outside of regular hours",
    )

    def __str__(self):
        return self.base_profile.django_user.get_username()


# cannot login, so no BaseUserProfile
class Patient(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    medical_record_number = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(
        max_length=20,
        choices=[("male", "Male"), ("female", "Female")],
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.medical_record_number})"


# MARK: Surgery


class SurgeryRequest(models.Model):
    PRIORITY_CHOICES = [
        ("emergency", "Emergency"),
        ("urgent", "Urgent"),
        ("elective", "Elective"),
    ]
    PROCEDURE_TYPE_CHOICES = [
        ("general", "General"),
        ("cardiac", "Cardiac"),
        ("neuro", "Neuro"),
        ("ortho", "Orthopedic"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    procedure_name = models.CharField(max_length=255)
    procedure_type = models.CharField(max_length=100, choices=PROCEDURE_TYPE_CHOICES)
    complexity = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    required_specialization = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="If the surgery requires a specific surgeon specialization",
    )
    anesthesia_type = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        help_text="Type of anesthesia required (e.g., general, local, regional)",
    )
    preferred_surgeon = models.ForeignKey(
        SurgeonProfile, null=True, blank=True, on_delete=models.SET_NULL
    )

    requested_at = models.DateTimeField(auto_now_add=True)
    latest_allowed_time = models.DateTimeField()
    approved = models.BooleanField(default=False)

    def is_overdue(self):
        return timezone.now() > self.latest_allowed_time

    def __str__(self):
        return f"SurgeryRequest {self.id} for {self.patient.full_name}"


class SurgerySchedule(models.Model):
    surgery_request = models.OneToOneField(SurgeryRequest, on_delete=models.CASCADE)
    operating_room = models.ForeignKey(OperatingRoom, on_delete=models.CASCADE)
    surgeons = models.ManyToManyField(
        SurgeonProfile, related_name="scheduled_surgeries"
    )

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=[
            ("scheduled", "Scheduled"),
            ("completed", "Completed"),
            ("cancelled", "Cancelled"),
            ("bumped", "Bumped"),
        ],
        default="scheduled",
    )

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Schedule for {self.surgery_request.patient.full_name} in {self.operating_room.name}"


class RescheduleEvent(models.Model):
    triggered_by = models.ForeignKey(SurgeryRequest, on_delete=models.CASCADE)
    affected_schedule = models.ForeignKey(SurgerySchedule, on_delete=models.CASCADE)
    reason = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"RescheduleEvent for {self.affected_schedule.surgery_request.patient.full_name} at {self.timestamp}"


class SurgeryQueue(models.Model):
    surgery_request = models.OneToOneField(SurgeryRequest, on_delete=models.CASCADE)
    current_priority = models.CharField(max_length=20)
    wait_days = models.IntegerField(default=0)
    escalated = models.BooleanField(
        default=False,
        help_text="Indicates if the surgery has been escalated due to waiting too long",
    )

    def __str__(self):
        return f"Queue entry for {self.surgery_request.patient.full_name} with priority {self.current_priority}"


# requirement because must be approved
class SurgeryEquipmentRequirement(models.Model):
    surgery_request = models.ForeignKey(SurgeryRequest, on_delete=models.CASCADE)
    equipment = models.ForeignKey("Equipment", on_delete=models.CASCADE)
    quantity_required = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity_required} x {self.equipment.name} for {self.surgery_request.patient.full_name}"


# MARK: Equipment


class Equipment(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    equipment_type = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.equipment_type}) in {self.location}"


class EquipmentSterilization(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    sterilized_at = models.DateTimeField()
    valid_until = models.DateTimeField()

    def is_valid(self):
        return timezone.now() <= self.valid_until

    def __str__(self):
        return f"Sterilization record for {self.equipment.name} at {self.sterilized_at}"


# MARK: Notifications


class Notification(models.Model):
    base_profile = models.ForeignKey(BaseUserProfile, on_delete=models.CASCADE)
    message = models.TextField()
    severity = models.CharField(
        max_length=20,
        choices=[("info", "Info"), ("warning", "Warning"), ("critical", "Critical")],
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.base_profile.django_user.get_username()} - {self.severity}"
