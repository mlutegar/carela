import uuid

from cloudinary.models import CloudinaryField
from django.conf import settings
from django.db import models


class DiagnosticRequest(models.Model):
    PROVIDER_CHOICES = [
        ("groq", "Groq"),
        ("deepseek", "DeepSeek"),
        ("glm", "GLM"),
    ]
    SEVERITY_CHOICES = [
        ("baixo", "Baixo"),
        ("medio", "Médio"),
        ("alto", "Alto"),
        ("urgente", "Urgente"),
    ]
    STATUS_CHOICES = [
        ("processando", "Processando"),
        ("concluido", "Concluído"),
        ("erro", "Erro"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(
        "vehicles.Vehicle",
        on_delete=models.CASCADE,
        related_name="diagnostics",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="diagnostics",
    )
    photo = CloudinaryField("diagnostic_photos", blank=True, null=True)
    description = models.TextField()
    llm_provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES, default="groq")
    llm_response = models.JSONField(default=dict, blank=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="processando")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Diagnóstico"
        verbose_name_plural = "Diagnósticos"

    def __str__(self):
        return f"Diagnóstico {self.id} — {self.vehicle} ({self.status})"
