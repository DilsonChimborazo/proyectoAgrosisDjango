from django.db import models
from apps.trazabilidad.plantacion.models import Plantacion
from apps.trazabilidad.actividad.models import Actividad
# Create your models here.
class Realiza(models.Model):
    fk_id_plantacion = models.ForeignKey(Plantacion, on_delete=models.SET_NULL, null=True)
    fk_id_actividad = models.ForeignKey(Actividad, on_delete=models.SET_NULL, null=True) 
    
    def __str__(self):
        return f'{self.fk_id_plantacion}{self.fk_id_actividad}'
