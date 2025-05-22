from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.finanzas.venta.models import ItemVenta
from apps.finanzas.stock.models import Stock

@receiver(post_save, sender=ItemVenta)
def actualizar_stock_despues_venta(sender, instance, created, **kwargs):
    if not created:
        return

    produccion = instance.produccion
    cantidad_a_descontar = instance.cantidad_en_base or 0
    
    if cantidad_a_descontar <= 0:
        return

    if produccion.stock_disponible < cantidad_a_descontar:
        raise ValueError(
            f"No hay suficiente stock para {produccion.nombre_produccion}. "
            f"Disponible: {produccion.stock_disponible}, "
            f"Requerido: {cantidad_a_descontar}"
        )

    produccion.stock_disponible -= cantidad_a_descontar
    produccion.save(update_fields=["stock_disponible"])

    Stock.objects.create(
        fk_id_item_venta=instance,
        fk_id_produccion=produccion,
        cantidad=cantidad_a_descontar,
        movimiento='Salida'
    )

@receiver(post_delete, sender=ItemVenta)
def revertir_stock_si_eliminado(sender, instance, **kwargs):
    produccion = instance.produccion
    cantidad_a_revertir = instance.cantidad_en_base or 0
    
    if cantidad_a_revertir <= 0:
        return

    produccion.stock_disponible += cantidad_a_revertir
    produccion.save(update_fields=["stock_disponible"])

    Stock.objects.create(
        fk_id_item_venta=instance,
        fk_id_produccion=produccion,
        cantidad=cantidad_a_revertir,
        movimiento='Entrada'
    )