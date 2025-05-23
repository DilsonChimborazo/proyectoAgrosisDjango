from django.db import models
from apps.trazabilidad.plantacion.models import Plantacion

class ControlRiego(models.Model):
    fk_id_plantacion = models.ForeignKey(Plantacion, on_delete=models.CASCADE, related_name='controles_riego')
    estado = models.CharField(max_length=10, choices=[('encendido', 'Encendido'), ('apagado', 'Apagado')])
    etc = models.DecimalField(max_digits=8, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Control de Riego'
        verbose_name_plural = 'Controles de Riego'
        ordering = ['-fecha']

    def __str__(self):
        return f"{self.fk_id_plantacion} - {self.estado} - {self.fecha}"