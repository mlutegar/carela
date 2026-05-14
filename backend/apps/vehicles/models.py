import uuid

from django.conf import settings
from django.db import models


class Vehicle(models.Model):
    FUEL_CHOICES = [
        ("gasolina", "Gasolina"),
        ("etanol", "Etanol"),
        ("flex", "Flex"),
        ("diesel", "Diesel"),
        ("eletrico", "Elétrico"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vehicles",
    )
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    plate = models.CharField(max_length=20, blank=True)
    color = models.CharField(max_length=50, blank=True)
    fuel_type = models.CharField(max_length=20, choices=FUEL_CHOICES, default="flex")
    km_current = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Veículo"
        verbose_name_plural = "Veículos"

    def __str__(self):
        return f"{self.brand} {self.model} {self.year} — {self.owner.name}"
