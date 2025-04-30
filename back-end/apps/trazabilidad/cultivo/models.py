from django.db import models
from apps.trazabilidad.especie.models import Especie

class Cultivo(models.Model):
    nombre_cultivo = models.CharField(max_length=100)
    fecha_plantacion = models.DateField()
    descripcion = models.CharField(max_length=300)
    fk_id_especie = models.ForeignKey(Especie, on_delete=models.SET_NULL, null=True)
    def __str__(self):
        if self.fk_nombre_cultivo:
            return f"{self.fk_nombre_cultivo.nombre_cultivo} - {self.fecha_plantacion}"
        return f"Cultivo - {self.fecha_plantacion}"