from django.contrib import admin

from .models import Mechanic, Review


@admin.register(Mechanic)
class MechanicAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "state", "phone", "is_verified")
    list_filter = ("is_verified", "state")
    search_fields = ("name", "city", "address")


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("mechanic", "user", "rating", "created_at")
    list_filter = ("rating",)
    search_fields = ("mechanic__name", "user__email")
