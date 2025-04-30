from django.db import models
from apps.trazabilidad.nombre_cultivo.models import Nombre_cultivo
from apps.trazabilidad.semillero.models import Semillero

class Cultivo(models.Model):
    fk_nombre_cultivo = models.ForeignKey(
        Nombre_cultivo,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Nombre del Cultivo",
        related_name="cultivos"
    )
    
    fecha_plantacion = models.DateField(
        verbose_name="Fecha de Plantación",
        help_text="Fecha cuando se realizó la plantación"
    )
    
    descripcion = models.TextField(
        verbose_name="Descripción",
        max_length=300,
        blank=True,
        help_text="Detalles adicionales sobre el cultivo"
    )
    
    fk_id_semillero = models.ForeignKey(
        Semillero,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Semillero"
    )
    
    class Meta:
        verbose_name = "Cultivo"
        verbose_name_plural = "Cultivos"
        ordering = ['-fecha_plantacion']
    
    def __str__(self):
        if self.fk_nombre_cultivo:
            return f"{self.fk_nombre_cultivo.nombre_cultivo} - {self.fecha_plantacion}"
        return f"Cultivo - {self.fecha_plantacion}"