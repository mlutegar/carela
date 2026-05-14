from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health_check),
    path("api/auth/", include("apps.users.urls")),
    path("api/vehicles/", include("apps.vehicles.urls")),
    path("api/maintenance/", include("apps.maintenance.urls")),
    path("api/diagnostics/", include("apps.diagnostics.urls")),
    path("api/mechanics/", include("apps.mechanics.urls")),
]
