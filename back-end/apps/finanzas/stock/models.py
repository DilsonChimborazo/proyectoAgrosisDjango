from django.db import models
from apps.finanzas.produccion.models import Produccion
from apps.finanzas.venta.models import ItemVenta

class Stock(models.Model):
    MOVIMIENTO_CHOICES = [
        ('Entrada', 'Entrada'),
        ('Salida', 'Salida'),
    ]

    fk_id_produccion = models.ForeignKey(
        Produccion, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    fk_id_item_venta = models.ForeignKey(
        ItemVenta,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='movimientos_stock'
    )
    cantidad = models.DecimalField(max_digits=20, decimal_places=3)
    fecha = models.DateTimeField(auto_now_add=True)
    movimiento = models.CharField(max_length=10, choices=MOVIMIENTO_CHOICES)

    def __str__(self):
        if self.movimiento == 'Entrada':
            return f"Entrada de {self.cantidad} de {self.fk_id_produccion}"
        else:
            return f"Salida de {self.cantidad} por Venta #{self.fk_id_item_venta.venta.id if self.fk_id_item_venta else 'N/A'}"