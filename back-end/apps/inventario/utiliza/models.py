from django.db import models
from apps.inventario.insumo.models import Insumo
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades

# Create your models here.
class Utiliza (models.Model):
    fk_id_insumo = models.ForeignKey (Insumo, on_delete=models.SET_NULL, null=True)
    fk_id_asignacion_actividades = models.ForeignKey (Asignacion_actividades, on_delete=models.SET_NULL, null=True)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"Utiliza: {self.fk_id_insumo} - Utiliza: {self.fk_id_asignacion_actividades}"