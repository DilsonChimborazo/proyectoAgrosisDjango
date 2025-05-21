from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.finanzas.produccion.models import Produccion
from .models import Stock

@receiver(post_save, sender=Produccion)
def registrar_entrada_stock(sender, instance, created, **kwargs):
    if created:
        instance.stock_disponible = instance.cantidad_en_base or 0
        instance.save(update_fields=['stock_disponible'])

        Stock.objects.create(
            fk_id_produccion=instance,
            cantidad=instance.cantidad_en_base or 0,
            movimiento='Entrada'
        )
