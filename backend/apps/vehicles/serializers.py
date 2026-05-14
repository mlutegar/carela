from rest_framework import serializers

from .models import Vehicle


class VehicleSerializer(serializers.ModelSerializer):
    owner = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Vehicle
        fields = (
            "id", "owner", "brand", "model", "year",
            "plate", "color", "fuel_type", "km_current", "created_at",
        )
        read_only_fields = ("id", "created_at")

    def validate_year(self, value):
        if value < 1886 or value > 2100:
            raise serializers.ValidationError("Ano inválido.")
        return value

    def validate_km_current(self, value):
        if value < 0:
            raise serializers.ValidationError("KM não pode ser negativo.")
        return value
