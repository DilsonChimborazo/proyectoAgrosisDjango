from django.db import models
from apps.finanzas.produccion.models import Produccion
from apps.finanzas.venta.models import Venta

# Create your models here.

class Stock(models.Model):
    MOVIMIENTO_CHOICES = [
        ('Entrada', 'Entrada'),
        ('Salida', 'Salida'),
    ]

    fk_id_produccion = models.ForeignKey(Produccion, on_delete=models.SET_NULL, null=True, blank=True)
    fk_id_venta = models.ForeignKey(Venta, on_delete=models.SET_NULL, null=True, blank=True)
    
    cantidad = models.PositiveIntegerField()
    fecha = models.DateTimeField(auto_now_add=True)
    movimiento = models.CharField(max_length=10, choices=MOVIMIENTO_CHOICES)

    def __str__(self):
        origen = "Producción" if self.fk_id_produccion else "Venta"
        return f"{origen} - {self.movimiento} - {self.cantidad}"
