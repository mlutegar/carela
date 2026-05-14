from django.contrib import admin

from .models import Vehicle


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ("brand", "model", "year", "plate", "owner", "km_current", "fuel_type")
    list_filter = ("fuel_type", "brand")
    search_fields = ("brand", "model", "plate", "owner__email")
