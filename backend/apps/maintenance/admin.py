from django.contrib import admin

from .models import MaintenanceLog, MaintenanceReminder


@admin.register(MaintenanceReminder)
class MaintenanceReminderAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "vehicle", "due_date", "due_km", "status")
    list_filter = ("type", "status")
    search_fields = ("title", "vehicle__plate", "vehicle__owner__email")


@admin.register(MaintenanceLog)
class MaintenanceLogAdmin(admin.ModelAdmin):
    list_display = ("title", "vehicle", "date", "cost", "workshop_name")
    list_filter = ("date",)
    search_fields = ("title", "vehicle__plate", "workshop_name")
