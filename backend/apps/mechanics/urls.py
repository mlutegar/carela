from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MechanicViewSet

router = DefaultRouter()
router.register(r"", MechanicViewSet, basename="mechanic")

urlpatterns = [
    path("", include(router.urls)),
]
