from rest_framework import serializers

from .models import Mechanic, Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = Review
        fields = ("id", "mechanic", "user", "user_name", "vehicle", "rating", "comment", "created_at")
        read_only_fields = ("id", "user", "created_at", "user_name")

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("A nota deve ser entre 1 e 5.")
        return value

    def validate(self, attrs):
        request = self.context["request"]
        mechanic = attrs.get("mechanic") or self.instance and self.instance.mechanic
        if Review.objects.filter(mechanic=mechanic, user=request.user).exists():
            raise serializers.ValidationError("Você já avaliou este mecânico.")
        return attrs


class MechanicSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Mechanic
        fields = (
            "id", "name", "address", "city", "state",
            "phone", "whatsapp", "specialties", "is_verified",
            "average_rating", "review_count", "created_at",
        )
        read_only_fields = ("id", "created_at", "is_verified")

    def get_average_rating(self, obj):
        return obj.average_rating

    def get_review_count(self, obj):
        return obj.reviews.count()


class MechanicDetailSerializer(MechanicSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta(MechanicSerializer.Meta):
        fields = MechanicSerializer.Meta.fields + ("reviews",)
