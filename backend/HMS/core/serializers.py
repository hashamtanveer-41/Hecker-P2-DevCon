from rest_framework import serializers
from core.models import Hospital

class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = ["id", "name", "code", "timezone", "is_active", "created_at"]
        read_only_fields = ["id", "created_at"]
