from django.db import models
from apps.iot.sensores.models import Sensores
from apps.trazabilidad.plantacion.models import Plantacion
import logging

logger = logging.getLogger(__name__)

class Mide(models.Model):
    fk_id_sensor = models.ForeignKey(Sensores, on_delete=models.SET_NULL, null=True, related_name="mediciones")
    fk_id_plantacion = models.ForeignKey(Plantacion, on_delete=models.SET_NULL, null=True, related_name="mediciones")
    valor_medicion = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_medicion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Nombre del sensor: {self.fk_id_sensor.nombre_sensor if self.fk_id_sensor else 'Desconocido'} | Plantación: {self.fk_id_plantacion}"

    def save(self, *args, **kwargs):
        super(Mide, self).save(*args, **kwargs)