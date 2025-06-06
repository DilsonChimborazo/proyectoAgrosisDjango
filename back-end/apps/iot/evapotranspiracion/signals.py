from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from apps.iot.evapotranspiracion.models import Evapotranspiracion
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Evapotranspiracion)
def enviar_datos_evapotranspiracion(sender, instance, created, **kwargs):
    if created:  # Solo enviar datos cuando se crea un nuevo registro
        channel_layer = get_channel_layer()
        data = {
            'id': instance.id,
            'plantacion_id': instance.fk_id_plantacion_id,
            'nombre_plantacion': instance.fk_id_plantacion.fk_id_cultivo.nombre_cultivo if instance.fk_id_plantacion.fk_id_cultivo else 'Sin plantación',
            'era_id': instance.fk_id_plantacion.fk_id_eras.id if instance.fk_id_plantacion.fk_id_eras else None,
            'nombre_era': instance.fk_id_plantacion.fk_id_eras.nombre if instance.fk_id_plantacion.fk_id_eras else 'Sin era',
            'cultivo': instance.fk_id_plantacion.fk_id_cultivo.nombre_cultivo if instance.fk_id_plantacion.fk_id_cultivo else 'Sin cultivo',
            'eto': float(instance.eto),
            'etc': float(instance.etc),
            'fecha': instance.fecha.isoformat(),
        }
        logger.info(f"Enviando nuevo dato de evapotranspiración para plantacion_id: {instance.fk_id_plantacion_id}")
        async_to_sync(channel_layer.group_send)(
            f'evapotranspiracion_{instance.fk_id_plantacion_id}',
            {
                'type': 'evapotranspiracion_data',
                'message': data
            }
        )