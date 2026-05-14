from rest_framework import serializers

from apps.vehicles.models import Vehicle

from .models import MaintenanceLog, MaintenanceReminder


class MaintenanceReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceReminder
        fields = (
            "id", "vehicle", "type", "title", "description",
            "due_date", "due_km", "status", "notified", "created_at",
        )
        read_only_fields = ("id", "created_at")

    def validate_vehicle(self, value):
        request = self.context["request"]
        if value.owner != request.user:
            raise serializers.ValidationError("Veículo não pertence à usuária.")
        return value

    def validate(self, attrs):
        if not attrs.get("due_date") and not attrs.get("due_km"):
            raise serializers.ValidationError(
                "Informe ao menos uma data ou km de vencimento."
            )
        return attrs


class MaintenanceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceLog
        fields = (
            "id", "vehicle", "reminder", "title", "cost",
            "workshop_name", "notes", "date", "km_at_service", "receipt_photo",
        )
        read_only_fields = ("id",)

    def validate_vehicle(self, value):
        request = self.context["request"]
        if value.owner != request.user:
            raise serializers.ValidationError("Veículo não pertence à usuária.")
        return value
