from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.finanzas.produccion.models import Produccion
from apps.finanzas.venta.models import Venta
from apps.finanzas.stock.models import Stock

@receiver(post_save, sender=Venta)
def registrar_salida_stock(sender, instance, created, **kwargs):
    if created:
        produccion = instance.fk_id_produccion
        if produccion:
            cantidad_a_descontar = instance.cantidad_en_base or 0
            if produccion.stock_disponible >= cantidad_a_descontar:
                produccion.stock_disponible -= cantidad_a_descontar
                produccion.save(update_fields=["stock_disponible"])

                Stock.objects.create(
                    fk_id_venta=instance,
                    cantidad=cantidad_a_descontar,
                    movimiento='Salida'
                )
            else:
                print(f"⚠️ No hay suficiente stock disponible en la producción {produccion.id}")
