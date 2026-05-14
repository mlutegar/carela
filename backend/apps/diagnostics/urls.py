from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import DiagnosticViewSet

router = DefaultRouter()
router.register(r"", DiagnosticViewSet, basename="diagnostic")

urlpatterns = [
    path("", include(router.urls)),
]
