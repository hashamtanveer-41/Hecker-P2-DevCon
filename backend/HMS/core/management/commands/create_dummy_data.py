# yourapp/management/commands/dummy_datagen_django.py
from __future__ import annotations

"""
Management command to generate dummy data for the OR scheduling app.

Features:
- _clean_all() always runs first (removes data for the models we create).
- Per-model creation functions named _create_X().
- Command-line options to specify counts: --hospital 10, --patient 20, etc.
- Option --clean-only to only perform cleanup.
- Uses Faker for realistic data.
- Creates several Django users with password 'testuser123'.
- Creates a superuser at the end with username 'super' and password 'super@123'.
- Prints progress to stdout.
"""

from typing import Any, Dict, Iterable, List, Optional, Tuple
import random
import sys
from datetime import date, timedelta, datetime

from django.core.management.base import BaseCommand, CommandParser
from django.db import transaction
from django.utils import timezone
from django.contrib.auth.models import User

from faker import Faker

# Import models from your app - adjust the import path if your app name differs
from core.models import (
    Hospital,
    OperatingRoom,
    BaseUserProfile,
    RescheduleEvent,
    SurgeonProfile,
    StaffProfile,
    Patient,
    SurgeryEquipmentRequirement,
    SurgeryRequest,
    SurgeryQueue,
    Equipment,
    EquipmentSterilization,
    Notification,
    SurgerySchedule,
)

fake = Faker()


class Command(BaseCommand):
    help = "Generate dummy data for the OR scheduler. Always cleans existing data for targeted models before creating new data."

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--hospital", type=int, default=2, help="Number of hospitals to create."
        )
        parser.add_argument(
            "--operatingroom",
            type=int,
            default=4,
            help="Number of operating rooms per hospital.",
        )
        parser.add_argument(
            "--surgeon",
            type=int,
            default=4,
            help="Number of surgeons to create per hospital.",
        )
        parser.add_argument(
            "--staff",
            type=int,
            default=6,
            help="Number of staff (nurses/techs) per hospital.",
        )
        parser.add_argument(
            "--patient", type=int, default=10, help="Number of patients per hospital."
        )
        parser.add_argument(
            "--equipment",
            type=int,
            default=8,
            help="Number of equipment items per hospital.",
        )
        parser.add_argument(
            "--surgeryrequest",
            type=int,
            default=10,
            help="Number of surgery requests per hospital.",
        )
        parser.add_argument(
            "--users",
            type=int,
            default=6,
            help="Number of plain django users (testuserX) to create.",
        )
        parser.add_argument(
            "--clean-only",
            action="store_true",
            help="If provided, only perform cleanup and exit (still runs _clean_all()).",
        )

    def handle(self, *args: Any, **options: Any) -> None:
        counts: Dict[str, int] = {
            "hospital": int(options.get("hospital", 0)),
            "operatingroom": int(options.get("operatingroom", 0)),
            "surgeon": int(options.get("surgeon", 0)),
            "staff": int(options.get("staff", 0)),
            "patient": int(options.get("patient", 0)),
            "equipment": int(options.get("equipment", 0)),
            "surgeryrequest": int(options.get("surgeryrequest", 0)),
            "users": int(options.get("users", 0)),
        }
        clean_only: bool = bool(options.get("clean_only", False))

        # Always perform clean
        self.stdout.write("Starting cleanup of dummy data for targeted models...")
        self._clean_all()
        self.stdout.write(self.style.SUCCESS("Cleanup finished."))

        if clean_only:
            self.stdout.write("Exiting because --clean-only was provided.")
            return

        # Begin creation within a transaction for safety
        with transaction.atomic():
            hospitals = self._create_hospitals(counts["hospital"])
            # For each hospital create other things
            for idx, hospital in enumerate(hospitals, start=1):
                self.stdout.write(
                    f"Populating hospital {idx}/{len(hospitals)}: {hospital.name}"
                )
                self._create_operating_rooms(hospital, counts["operatingroom"])
                surgeons = self._create_surgeons(hospital, counts["surgeon"])
                self._create_staff(hospital, counts["staff"])
                patients = self._create_patients(hospital, counts["patient"])
                equipment_items = self._create_equipment(hospital, counts["equipment"])
                self._create_equipment_sterilization(equipment_items)
                self._create_surgery_requests(
                    hospital, patients, surgeons, counts["surgeryrequest"]
                )
                self._create_surgery_schedules(hospital)
                self._create_reschedule_events(hospital)
                self._create_surgery_equipment_requirements(hospital)

            # Create extra plain Django users
            self._create_plain_users(counts["users"])

            # Finally create superuser
            self._create_superuser()

        self.stdout.write(self.style.SUCCESS("Dummy data generation complete."))

    # ---------------------
    # Cleaning
    # ---------------------
    def _clean_all(self) -> None:
        """
        Remove data from all models touched by this generator.
        This function always runs at the start of the command.
        """
        # Order matters for FK constraints
        models_and_desc: List[Tuple[Any, str]] = [
            (Notification, "notifications"),
            (EquipmentSterilization, "equipment sterilization"),
            (SurgeryQueue, "surgery queues"),
            (SurgeryRequest, "surgery requests"),
            (Equipment, "equipment"),
            (Patient, "patients"),
            (StaffProfile, "staff profiles"),
            (SurgeonProfile, "surgeon profiles"),
            (BaseUserProfile, "base user profiles"),
            (OperatingRoom, "operating rooms"),
            (Hospital, "hospitals"),
            (RescheduleEvent, "reschedule events"),
            (SurgerySchedule, "surgery schedules"),
            (SurgeryEquipmentRequirement, "surgery equipment requirements"),
            # Do not delete User superusers automatically unless they were created by this script.
            # We'll remove test users below.
        ]
        for model, desc in models_and_desc:
            deleted_count: int = model.objects.all().count()
            model.objects.all().delete()
            self.stdout.write(f"Deleted {deleted_count} {desc}.")

        # Remove users created by previous runs that match our test pattern
        users_to_remove = User.objects.filter(username__startswith="testuser")
        removed_users_count: int = users_to_remove.count()
        users_to_remove.delete()
        self.stdout.write(f"Deleted {removed_users_count} testuser users.")

        # Optionally remove any non-staff superuser named 'super' from prior runs so we can recreate
        User.objects.filter(username="super").delete()
        self.stdout.write("Deleted existing 'super' user if present.")

    # ---------------------
    # Creation helpers
    # ---------------------
    def _create_hospitals(self, count: int) -> List[Hospital]:
        """Create `count` hospitals and return created list."""
        created: List[Hospital] = []
        for i in range(count):
            name: str = f"{fake.company()} Hospital"
            code: str = f"HOSP-{fake.unique.bothify(text='####')}"
            tz: str = random.choice(
                ["UTC", "Asia/Karachi", "Europe/London", "America/New_York"]
            )
            hospital = Hospital.objects.create(
                name=name, code=code, timezone=tz, is_active=True
            )
            created.append(hospital)
            self.stdout.write(
                f"  [Hospital {i+1}/{count}] {hospital.name} ({hospital.code})"
            )
        return created

    def _create_operating_rooms(self, hospital: Hospital, count: int) -> None:
        """Create operating rooms for given hospital."""
        room_types = ["general", "cardiac", "neuro", "ortho"]
        for i in range(count):
            name: str = f"OR-{hospital.code}-{i+1}"
            operating_room_type: str = random.choice(room_types)
            OperatingRoom.objects.create(
                hospital=hospital,
                name=name,
                operating_room_type=operating_room_type,
                is_available=True,
                has_anesthesia=True,
                has_imaging=random.choice([True, False]),
                maintenance_until=None,
            )
            self._print_progress(i + 1, count, prefix="    Creating ORs")

    def _create_surgeons(self, hospital: Hospital, count: int) -> List[SurgeonProfile]:
        """Create surgeons (BaseUserProfile + SurgeonProfile) for hospital."""
        created: List[SurgeonProfile] = []
        for i in range(count):
            username: str = f"surgeon_{hospital.code}_{i+1}"
            django_user = User.objects.create_user(
                username=username, email=fake.email(), password="testuser123"
            )
            base_profile = BaseUserProfile.objects.create(
                django_user=django_user, hospital=hospital, role="surgeon"
            )
            specialization: str = random.choice(
                ["Cardiac", "Neurosurgery", "Orthopedics", "General"]
            )
            surgeon = SurgeonProfile.objects.create(
                base_profile=base_profile,
                specialization=specialization,
                max_daily_hours=random.randint(6, 12),
            )
            created.append(surgeon)
            self._print_progress(i + 1, count, prefix="    Creating surgeons")
        return created

    def _create_staff(self, hospital: Hospital, count: int) -> None:
        """Create staff profiles for hospital."""
        for i in range(count):
            username: str = f"staff_{hospital.code}_{i+1}"
            django_user = User.objects.create_user(
                username=username, email=fake.email(), password="testuser123"
            )
            base_profile = BaseUserProfile.objects.create(
                django_user=django_user, hospital=hospital, role="nurse"
            )
            start: datetime = timezone.now().replace(
                hour=8, minute=0, second=0, microsecond=0
            )
            end: datetime = start + timedelta(hours=8)
            StaffProfile.objects.create(
                base_profile=base_profile,
                start_time=start,
                end_time=end,
                is_on_call=random.choice([False, True]),
            )
            self._print_progress(i + 1, count, prefix="    Creating staff")

    def _create_patients(self, hospital: Hospital, count: int) -> List[Patient]:
        """Create patients for hospital."""
        created: List[Patient] = []
        for i in range(count):
            mrn: str = fake.unique.bothify(text="MRN-####-??")
            dob: date = fake.date_of_birth(minimum_age=0, maximum_age=90)
            gender: str = random.choice(["male", "female"])
            patient = Patient.objects.create(
                hospital=hospital,
                medical_record_number=mrn,
                full_name=fake.name(),
                date_of_birth=dob,
                gender=gender,
            )
            created.append(patient)
            self._print_progress(i + 1, count, prefix="    Creating patients")
        return created

    def _create_equipment(self, hospital: Hospital, count: int) -> List[Equipment]:
        """Create equipment items for hospital."""
        created: List[Equipment] = []
        equipment_types = [
            "Ventilator",
            "Monitor",
            "Sterile Tray",
            "C-arm",
            "Anesthesia Machine",
        ]
        for i in range(count):
            name: str = f"{random.choice(equipment_types)} {fake.bothify(text='###')}"
            eq_type: str = random.choice(equipment_types)
            item = Equipment.objects.create(
                hospital=hospital,
                name=name,
                equipment_type=eq_type,
                location="Central Store",
                is_available=True,
            )
            created.append(item)
            self._print_progress(i + 1, count, prefix="    Creating equipment")
        return created

    def _create_equipment_sterilization(self, equipment_items: List[Equipment]) -> None:
        """Create sterilization records for a subset of equipment."""
        if not equipment_items:
            return
        count: int = len(equipment_items)
        for idx, item in enumerate(equipment_items, start=1):
            sterilized_at: datetime = timezone.now() - timedelta(
                days=random.randint(0, 3)
            )
            valid_until: datetime = sterilized_at + timedelta(days=random.randint(1, 7))
            EquipmentSterilization.objects.create(
                equipment=item, sterilized_at=sterilized_at, valid_until=valid_until
            )
            self._print_progress(idx, count, prefix="    Sterilizing equipment")

    def _create_surgery_requests(
        self,
        hospital: Hospital,
        patients: List[Patient],
        surgeons: List[SurgeonProfile],
        count: int,
    ) -> None:
        """Create surgery requests and optionally queues/notifications."""
        procedure_types = ["general", "cardiac", "neuro", "ortho"]
        priority_choices = ["emergency", "urgent", "elective"]
        patients_cycle: Iterable[Patient] = patients if patients else []
        for i in range(count):
            patient = random.choice(patients_cycle) if patients_cycle else None
            if patient is None:
                break
            proc_type: str = random.choice(procedure_types)
            complexity: int = random.randint(1, 5)
            priority: str = random.choice(priority_choices)
            latest_allowed: datetime = timezone.now() + timedelta(
                days=random.randint(0, 30)
            )
            preferred_surgeon: Optional[SurgeonProfile] = (
                random.choice(surgeons) if surgeons else None
            )
            sr = SurgeryRequest.objects.create(
                hospital=hospital,
                patient=patient,
                procedure_name=f"{proc_type.title()} procedure - {fake.word()}",
                procedure_type=proc_type,
                complexity=complexity,
                priority=priority,
                required_specialization=(
                    preferred_surgeon.base_profile.django_user.get_full_name()
                    if preferred_surgeon
                    else None
                ),
                anesthesia_type=random.choice(["general", "regional", "local"]),
                preferred_surgeon=preferred_surgeon,
                latest_allowed_time=latest_allowed,
                approved=random.choice([True, False]),
            )
            # Create queue entry
            SurgeryQueue.objects.create(
                surgery_request=sr,
                current_priority=priority,
                wait_days=random.randint(0, 20),
                escalated=random.choice([False, True]),
            )
            # Optionally create a notification to an admin user if approval false
            if not sr.approved:
                # pick any admin base profile in hospital (if present), otherwise skip
                admin_profile = BaseUserProfile.objects.filter(
                    hospital=hospital, role="admin"
                ).first()
                if admin_profile:
                    Notification.objects.create(
                        base_profile=admin_profile,
                        message=f"Surgery {sr.procedure_name} needs approval.",
                        severity="warning",
                    )
            self._print_progress(i + 1, count, prefix="    Creating surgery requests")

    def _create_surgery_schedules(self, hospital: Hospital) -> None:
        """Create SurgerySchedule entries for approved surgery requests."""
        surgery_requests = SurgeryRequest.objects.filter(
            hospital=hospital, approved=True
        )
        operating_rooms = list(OperatingRoom.objects.filter(hospital=hospital))
        if not operating_rooms:
            return

        for i, sr in enumerate(surgery_requests, start=1):
            oroom = random.choice(operating_rooms)
            start_time = timezone.now() + timedelta(
                days=random.randint(0, 5), hours=random.randint(8, 16)
            )
            end_time = start_time + timedelta(hours=random.randint(1, 4))
            sched = SurgerySchedule.objects.create(
                surgery_request=sr,
                operating_room=oroom,
                start_time=start_time,
                end_time=end_time,
                status="scheduled",
                notes=f"Auto-generated schedule for {sr.procedure_name}",
            )
            # Assign surgeons (1-2 randomly)
            surgeons = SurgeonProfile.objects.filter(base_profile__hospital=hospital)
            if surgeons:
                sched.surgeons.set(
                    random.sample(
                        list(surgeons), min(len(surgeons), random.randint(1, 2))
                    )
                )
            self._print_progress(
                i, surgery_requests.count(), prefix="    Creating surgery schedules"
            )

    def _create_reschedule_events(self, hospital: Hospital) -> None:
        """Create some reschedule events for schedules (simulate bumps)."""
        schedules = SurgerySchedule.objects.filter(operating_room__hospital=hospital)
        for i, sched in enumerate(schedules, start=1):
            # Randomly decide to create a reschedule
            if random.choice([True, False]):
                reason = random.choice(
                    [
                        "Equipment maintenance",
                        "Surgeon unavailable",
                        "Emergency case bumped schedule",
                        "Staff shortage",
                    ]
                )
                RescheduleEvent.objects.create(
                    triggered_by=sched.surgery_request,
                    affected_schedule=sched,
                    reason=reason,
                )
            self._print_progress(
                i, schedules.count(), prefix="    Creating reschedule events"
            )

    def _create_surgery_equipment_requirements(self, hospital: Hospital) -> None:
        """Assign random equipment requirements to surgery requests."""
        surgery_requests = SurgeryRequest.objects.filter(hospital=hospital)
        equipment_items = list(Equipment.objects.filter(hospital=hospital))
        for i, sr in enumerate(surgery_requests, start=1):
            if equipment_items:
                # Each surgery requires 1-3 equipment items
                required_eqs = random.sample(
                    equipment_items, min(len(equipment_items), random.randint(1, 3))
                )
                for eq in required_eqs:
                    qty = random.randint(1, 2)
                    SurgeryEquipmentRequirement.objects.create(
                        surgery_request=sr, equipment=eq, quantity_required=qty
                    )
            self._print_progress(
                i,
                surgery_requests.count(),
                prefix="    Creating equipment requirements",
            )

    def _create_plain_users(self, count: int) -> None:
        """Create plain Django users with password 'testuser123'."""
        for i in range(count):
            username: str = f"testuser{i+1}"
            email: str = fake.email()
            User.objects.create_user(
                username=username, email=email, password="testuser123"
            )
            self._print_progress(i + 1, count, prefix="  Creating plain django users")

    def _create_superuser(self) -> None:
        """Create the final superuser with fixed credentials."""
        username: str = "super"
        password: str = "super@123"
        email: str = "super@example.com"
        if User.objects.filter(username=username).exists():
            # ensure predictable state: delete previous before creating
            User.objects.filter(username=username).delete()
        User.objects.create_superuser(username=username, email=email, password=password)
        self.stdout.write(
            self.style.SUCCESS(
                f"Created superuser '{username}' with password '{password}'."
            )
        )

    # ---------------------
    # Utilities
    # ---------------------
    def _print_progress(self, idx: int, total: int, prefix: str = "") -> None:
        """Print a concise progress line; avoids overwhelming output for large totals."""
        # Print every 1 or when percent increments by 10% for large totals
        if total <= 20 or idx == total or (idx % max(1, total // 10) == 0):
            pct: float = (idx / total) * 100 if total else 100.0
            self.stdout.write(f"{prefix}: {idx}/{total} ({pct:.0f}%)")
            # flush to make progress visible immediately
            try:
                sys.stdout.flush()
            except Exception:
                pass
