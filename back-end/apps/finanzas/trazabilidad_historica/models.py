from django.db import models
from apps.trazabilidad.plantacion.models import Plantacion

# Create your models here.

from django.core.serializers.json import DjangoJSONEncoder
from datetime import date, datetime

class CustomJSONEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, (date, datetime)):
            return obj.isoformat()
        return super().default(obj)

class SnapshotTrazabilidad(models.Model):
    plantacion = models.ForeignKey(Plantacion, on_delete=models.CASCADE, related_name='snapshots_trazabilidad')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    datos = models.JSONField(encoder=CustomJSONEncoder) 
    version = models.PositiveSmallIntegerField(default=1)
    trigger = models.CharField(max_length=50, null=True, blank=True)  # Qué evento lo generó
    
    class Meta:
        ordering = ['-fecha_registro']
        verbose_name_plural = 'Snapshots de trazabilidad'
        indexes = [
            models.Index(fields=['plantacion', 'fecha_registro']),
        ]
    
    def __str__(self):
        return f"Snapshot v{self.version} - {self.plantacion} ({self.fecha_registro.date()})"


class ResumenTrazabilidad(models.Model):
    plantacion = models.OneToOneField(Plantacion, on_delete=models.CASCADE, related_name='resumen_trazabilidad')
    ultima_actualizacion = models.DateTimeField(auto_now=True)
    datos_actuales = models.JSONField(encoder=CustomJSONEncoder)
    
    def __str__(self):
        return f"Resumen actual - {self.plantacion}"