from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import ItemVenta
from apps.finanzas.stock.models import Stock

@receiver(post_save, sender=ItemVenta)
def actualizar_stock_despues_venta(sender, instance, created, **kwargs):
    produccion = instance.produccion
    cantidad_a_descontar = instance.cantidad_en_base or 0
    
    if produccion.stock_disponible >= cantidad_a_descontar:
        produccion.stock_disponible -= cantidad_a_descontar
        produccion.save(update_fields=["stock_disponible"])

        Stock.objects.create(
            fk_id_venta=instance.venta,
            fk_id_produccion=produccion,
            cantidad=cantidad_a_descontar,
            movimiento='Salida'
        )
    else:
        raise ValueError(f"No hay suficiente stock para {produccion.nombre_produccion}")

@receiver(post_delete, sender=ItemVenta)
def revertir_stock_si_eliminado(sender, instance, **kwargs):
    produccion = instance.produccion
    cantidad_a_revertir = instance.cantidad_en_base or 0
    
    produccion.stock_disponible += cantidad_a_revertir
    produccion.save(update_fields=["stock_disponible"])

    Stock.objects.create(
        fk_id_venta=instance.venta,
        fk_id_produccion=produccion,
        cantidad=cantidad_a_revertir,
        movimiento='Entrada'
    )