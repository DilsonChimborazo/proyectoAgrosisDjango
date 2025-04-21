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
            if produccion.stock_disponible >= instance.cantidad:
                produccion.stock_disponible -= instance.cantidad
                produccion.save(update_fields=["stock_disponible"])
                
                Stock.objects.create(
                    fk_id_venta=instance,
                    cantidad=instance.cantidad,
                    movimiento='Salida'
                )
            else:
                # Opcional: manejar el error si la venta excede el stock disponible
                print(f"⚠️ No hay suficiente stock disponible en la producción {produccion.id}")
