from django.db import models
from apps.trazabilidad.cultivo.models import Cultivo
from apps.iot.eras.models import Eras
from apps.trazabilidad.semillero.models import Semillero


class Plantacion(models.Model):
    fk_id_eras = models.ForeignKey(Eras, on_delete=models.SET_NULL, null=True)
    fk_id_cultivo = models.ForeignKey(Cultivo, on_delete=models.SET_NULL, null=True)
    cantidad_transplante = models.IntegerField()
    fecha_plantacion = models.DateField() 
    fk_id_semillero = models.ForeignKey(Semillero, on_delete=models.SET_NULL, null=True)

    
    def __str__(self): 
        return f"Cultivo: {self.fk_id_cultivo.nombre_cultivo} Era: {self.fk_id_eras}" 
