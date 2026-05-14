from rest_framework import serializers

from .models import DiagnosticRequest


class DiagnosticCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiagnosticRequest
        fields = ("id", "vehicle", "photo", "description", "created_at")
        read_only_fields = ("id", "created_at")

    def validate_vehicle(self, value):
        request = self.context["request"]
        if value.owner != request.user:
            raise serializers.ValidationError("Veículo não pertence à usuária.")
        return value

    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                "Descreva o problema com pelo menos 10 caracteres."
            )
        return value


class DiagnosticSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiagnosticRequest
        fields = (
            "id", "vehicle", "user", "photo", "description",
            "llm_provider", "llm_response", "severity", "status", "created_at",
        )
        read_only_fields = fields
