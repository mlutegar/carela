from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from .models import Vehicle
from .serializers import VehicleSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def get_queryset(self):
        return Vehicle.objects.filter(owner=self.request.user)

    def perform_update(self, serializer):
        vehicle = self.get_object()
        if vehicle.owner != self.request.user:
            raise PermissionDenied()
        serializer.save()

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            raise PermissionDenied()
        instance.delete()
