from rest_framework import mixins, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Mechanic, Review
from .serializers import MechanicDetailSerializer, MechanicSerializer, ReviewSerializer


class MechanicViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Mechanic.objects.all()
        city = self.request.query_params.get("city")
        rating = self.request.query_params.get("rating")
        state = self.request.query_params.get("state")

        if city:
            qs = qs.filter(city__icontains=city)
        if state:
            qs = qs.filter(state__iexact=state)
        return qs

    def get_serializer_class(self):
        if self.action == "retrieve":
            return MechanicDetailSerializer
        return MechanicSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        rating_min = request.query_params.get("rating")
        mechanics = list(queryset)

        if rating_min:
            try:
                min_val = float(rating_min)
                mechanics = [
                    m for m in mechanics
                    if m.average_rating is not None and m.average_rating >= min_val
                ]
            except ValueError:
                pass

        serializer = self.get_serializer(mechanics, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="reviews")
    def add_review(self, request, pk=None):
        mechanic = self.get_object()
        data = {**request.data, "mechanic": mechanic.pk}
        serializer = ReviewSerializer(data=data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, mechanic=mechanic)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
