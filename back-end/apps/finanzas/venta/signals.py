from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.finanzas.venta.models import ItemVenta
from apps.finanzas.stock.models import Stock

@receiver(post_save, sender=ItemVenta)
def actualizar_stock_despues_venta(sender, instance, created, **kwargs):
    """
    Maneja el descuento de stock cuando se crea un ItemVenta
    Solo actúa en creación (created=True), no en actualizaciones
    """
    if not created:
        return

    produccion = instance.produccion
    cantidad_a_descontar = instance.cantidad_en_base or 0
    
    if cantidad_a_descontar <= 0:
        return

    # Verificar stock disponible
    if produccion.stock_disponible < cantidad_a_descontar:
        raise ValueError(
            f"No hay suficiente stock para {produccion.nombre_produccion}. "
            f"Disponible: {produccion.stock_disponible}, "
            f"Requerido: {cantidad_a_descontar}"
        )

    # Actualizar stock
    produccion.stock_disponible -= cantidad_a_descontar
    produccion.save(update_fields=["stock_disponible"])

    # Registrar movimiento de stock
    Stock.objects.create(
        fk_id_venta=instance.venta,
        fk_id_produccion=produccion,
        cantidad=cantidad_a_descontar,
        movimiento='Salida'
    )

@receiver(post_delete, sender=ItemVenta)
def revertir_stock_si_eliminado(sender, instance, **kwargs):
    """
    Revierte el stock cuando se elimina un ItemVenta
    """
    produccion = instance.produccion
    cantidad_a_revertir = instance.cantidad_en_base or 0
    
    if cantidad_a_revertir <= 0:
        return

    produccion.stock_disponible += cantidad_a_revertir
    produccion.save(update_fields=["stock_disponible"])

    Stock.objects.create(
        fk_id_venta=instance.venta,
        fk_id_produccion=produccion,
        cantidad=cantidad_a_revertir,
        movimiento='Entrada'
    )