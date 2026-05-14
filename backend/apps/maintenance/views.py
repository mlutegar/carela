from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from .models import MaintenanceLog, MaintenanceReminder
from .serializers import MaintenanceLogSerializer, MaintenanceReminderSerializer


class MaintenanceReminderViewSet(viewsets.ModelViewSet):
    serializer_class = MaintenanceReminderSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_queryset(self):
        return MaintenanceReminder.objects.filter(vehicle__owner=self.request.user)

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx


class MaintenanceLogViewSet(viewsets.ModelViewSet):
    serializer_class = MaintenanceLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_queryset(self):
        return MaintenanceLog.objects.filter(vehicle__owner=self.request.user)

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx
