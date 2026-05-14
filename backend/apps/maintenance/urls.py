from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MaintenanceLogViewSet, MaintenanceReminderViewSet

router = DefaultRouter()
router.register(r"reminders", MaintenanceReminderViewSet, basename="reminder")
router.register(r"logs", MaintenanceLogViewSet, basename="maintenance-log")

urlpatterns = [
    path("", include(router.urls)),
]
