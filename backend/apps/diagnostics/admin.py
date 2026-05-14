from django.contrib import admin

from .models import DiagnosticRequest


@admin.register(DiagnosticRequest)
class DiagnosticRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "vehicle", "user", "severity", "status", "created_at")
    list_filter = ("severity", "status", "llm_provider")
    search_fields = ("vehicle__plate", "user__email", "description")
    readonly_fields = ("llm_response",)
