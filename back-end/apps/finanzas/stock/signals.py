# produccion/stock/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.finanzas.produccion.models import Produccion
from apps.finanzas.venta.models import Venta
from apps.finanzas.stock.models import Stock

@receiver(post_save, sender=Produccion)
def registrar_entrada_stock(sender, instance, created, **kwargs):
    if created:
        # Al crear producción, se establece el stock disponible igual a la cantidad producida
        instance.stock_disponible = int(instance.cantidad_producida)
        instance.save(update_fields=['stock_disponible'])

        Stock.objects.create(
            fk_id_produccion=instance,
            cantidad=instance.cantidad_producida,
            movimiento='Entrada'
        )

@receiver(post_save, sender=Venta)
def registrar_salida_stock(sender, instance, created, **kwargs):
    if created:
        produccion = instance.fk_id_produccion
        if produccion:
            # Restamos la cantidad vendida del stock disponible
            produccion.stock_disponible -= instance.cantidad
            produccion.save(update_fields=["stock_disponible"])

        Stock.objects.create(
            fk_id_venta=instance,
            cantidad=instance.cantidad,
            movimiento='Salida'
        )
