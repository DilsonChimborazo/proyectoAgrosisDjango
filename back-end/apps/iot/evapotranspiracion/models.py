from django.db import models
from apps.iot.eras.models import Eras
from apps.trazabilidad.cultivo.models import Cultivo
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Evapotranspiracion(models.Model):
    fk_id_era = models.ForeignKey(Eras, on_delete=models.CASCADE, related_name="evapotranspiraciones")
    fk_id_cultivo = models.ForeignKey(Cultivo, on_delete=models.CASCADE, related_name="evapotranspiraciones")
    fecha = models.DateField()
    eto = models.DecimalField(max_digits=8, decimal_places=2)
    etc = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('fk_id_era', 'fecha')

    def __str__(self):
        return f"ETo: {self.eto} mm/día | ETc: {self.etc} mm/día | Era: {self.fk_id_era}"

@receiver(post_save, sender=Evapotranspiracion)
def enviar_datos_evapotranspiracion(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    data = {
        "era_id": instance.fk_id_era.id,
        "cultivo": instance.fk_id_cultivo.nombre_cultivo,
        "eto": float(instance.eto),
        "etc": float(instance.etc),
        "fecha": str(instance.fecha),
    }
    async_to_sync(channel_layer.group_send)(
        "evapotranspiracion",
        {
            "type": "evapotranspiracion_data",
            "message": data
        }
    )