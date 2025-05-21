from django.db import models
from apps.finanzas.produccion.models import Produccion
from apps.inventario.unidadMedida.models import UnidadMedida
from django.core.validators import MinValueValidator

class Venta(models.Model):
    fecha = models.DateField(auto_now_add=True)
    total = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        default=0,
        validators=[MinValueValidator(0)]
    )
    
    def __str__(self):
        return f"Venta #{self.id} - {self.fecha} - ${self.total}"

    def calcular_total(self):
        return sum(item.subtotal() for item in self.items.all())

    def actualizar_total(self):
        self.total = self.calcular_total()
        self.save(update_fields=['total'])

class ItemVenta(models.Model):
    venta = models.ForeignKey(
        Venta, 
        on_delete=models.CASCADE, 
        related_name='items'
    )
    produccion = models.ForeignKey(
        Produccion, 
        on_delete=models.PROTECT,
        related_name='ventas'
    )
    precio_unidad = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    cantidad = models.DecimalField(
        max_digits=20, 
        decimal_places=3,
        validators=[MinValueValidator(0)]
    )
    unidad_medida = models.ForeignKey(
        UnidadMedida,
        on_delete=models.PROTECT
    )
    cantidad_en_base = models.DecimalField(
        max_digits=20,
        decimal_places=3,
        null=True,
        blank=True,
        help_text="Cantidad vendida convertida a unidad base."
    )

    def subtotal(self):
        return self.precio_unidad * self.cantidad

    def precio_por_unidad_de_medida(self):
        return self.precio_unidad / self.cantidad if self.cantidad else 0
    
    def precio_por_unidad_base(self):
        return self.precio_unidad / self.cantidad_en_base if self.cantidad_en_base else 0

    def save(self, *args, **kwargs):
        if self.unidad_medida and self.cantidad:
            self.cantidad_en_base = self.unidad_medida.convertir_a_base(self.cantidad)
        super().save(*args, **kwargs)
        self.venta.actualizar_total()

    def delete(self, *args, **kwargs):
        venta = self.venta
        super().delete(*args, **kwargs)
        venta.actualizar_total()