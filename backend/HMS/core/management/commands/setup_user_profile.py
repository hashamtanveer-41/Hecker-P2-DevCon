from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from core.models import BaseUserProfile, Hospital


class Command(BaseCommand):
    help = 'Creates a BaseUserProfile for a user and assigns them a role'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username to set up profile for')
        parser.add_argument('--role', type=str, default='admin',
                          choices=['admin', 'room_manager', 'surgeon', 'scheduler', 'nurse'],
                          help='Role to assign to the user')
        parser.add_argument('--hospital-name', type=str, default='Default Hospital',
                          help='Hospital name to create/assign')

    def handle(self, *args, **options):
        username = options['username']
        role = options['role']
        hospital_name = options['hospital_name']

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User "{username}" does not exist'))
            return

        # Get or create hospital
        hospital, created = Hospital.objects.get_or_create(
            name=hospital_name,
            defaults={
                'address': '123 Main St',
                'num_operating_rooms': 5,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created hospital "{hospital_name}"'))
        else:
            self.stdout.write(f'Using existing hospital "{hospital_name}"')

        # Get or create BaseUserProfile
        profile, created = BaseUserProfile.objects.get_or_create(
            django_user=user,
            defaults={
                'hospital': hospital,
                'role': role,
            }
        )

        if not created:
            # Update existing profile
            profile.hospital = hospital
            profile.role = role
            profile.save()
            self.stdout.write(self.style.WARNING(f'Updated existing profile for "{username}"'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Created new profile for "{username}"'))

        self.stdout.write(self.style.SUCCESS(
            f'\nUser Profile Setup Complete:'
            f'\n  Username: {username}'
            f'\n  Role: {role}'
            f'\n  Hospital: {hospital.name}'
        ))
