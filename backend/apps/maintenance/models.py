import uuid

from django.db import models


class MaintenanceReminder(models.Model):
    TYPE_CHOICES = [
        ("oleo", "Troca de Óleo"),
        ("pneu", "Pneus"),
        ("revisao", "Revisão Geral"),
        ("freio", "Freios"),
        ("correia", "Correia Dentada"),
        ("ipva", "IPVA"),
        ("seguro", "Seguro"),
        ("licenciamento", "Licenciamento"),
        ("outro", "Outro"),
    ]
    STATUS_CHOICES = [
        ("pendente", "Pendente"),
        ("concluido", "Concluído"),
        ("atrasado", "Atrasado"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(
        "vehicles.Vehicle",
        on_delete=models.CASCADE,
        related_name="reminders",
    )
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    due_km = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pendente")
    notified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["due_date", "due_km"]
        verbose_name = "Lembrete de Manutenção"
        verbose_name_plural = "Lembretes de Manutenção"

    def __str__(self):
        return f"{self.title} — {self.vehicle}"


class MaintenanceLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(
        "vehicles.Vehicle",
        on_delete=models.CASCADE,
        related_name="maintenance_logs",
    )
    reminder = models.ForeignKey(
        MaintenanceReminder,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="logs",
    )
    title = models.CharField(max_length=200)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    workshop_name = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    date = models.DateField()
    km_at_service = models.PositiveIntegerField(null=True, blank=True)
    receipt_photo = models.ImageField(upload_to="receipts/", blank=True, null=True)

    class Meta:
        ordering = ["-date"]
        verbose_name = "Registro de Manutenção"
        verbose_name_plural = "Registros de Manutenção"

    def __str__(self):
        return f"{self.title} em {self.date} — {self.vehicle}"
