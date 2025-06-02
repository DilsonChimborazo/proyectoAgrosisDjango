from django.db import models
from apps.trazabilidad.plantacion.models import Plantacion
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Evapotranspiracion(models.Model):
    fk_id_plantacion = models.ForeignKey(Plantacion, on_delete=models.CASCADE, related_name="evapotranspiraciones")
    fecha = models.DateField()
    eto = models.DecimalField(max_digits=8, decimal_places=2)
    etc = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        pass

    def __str__(self):
        return f"ETo: {self.eto} mm/día | ETc: {self.etc} mm/día | Plantación: {self.fk_id_plantacion}"

@receiver(post_save, sender=Evapotranspiracion)
def enviar_datos_evapotranspiracion(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    data = {
        "plantacion_id": instance.fk_id_plantacion.id,
        "cultivo": instance.fk_id_plantacion.fk_id_cultivo.nombre_cultivo if instance.fk_id_plantacion.fk_id_cultivo else "Sin cultivo",
        "era_id": instance.fk_id_plantacion.fk_id_eras.id if instance.fk_id_plantacion.fk_id_eras else None,
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