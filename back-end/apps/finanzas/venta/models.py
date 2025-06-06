from django.db import models
from apps.finanzas.produccion.models import Produccion
from apps.inventario.unidadMedida.models import UnidadMedida
from django.core.validators import MinValueValidator, MaxValueValidator

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
        return sum(item.subtotal_con_descuento() for item in self.items.all())

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
        validators=[MinValueValidator(0)],
    )
    precio_unidad_con_descuento = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        null=True,
        blank=True,
        help_text="Precio por unidad después de aplicar el descuento."
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
    descuento_porcentaje = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Porcentaje de descuento aplicado al ítem (0-100)"
    )

    def subtotal(self):
        return self.precio_unidad * self.cantidad

    def subtotal_con_descuento(self):
        subtotal = self.subtotal()
        if self.descuento_porcentaje > 0:
            descuento_monto = subtotal * (self.descuento_porcentaje / 100)
            return subtotal - descuento_monto
        return subtotal

    def precio_por_unidad_de_medida(self):
        return self.precio_unidad 

    def precio_por_unidad_base(self):
        if self.cantidad_en_base and self.cantidad_en_base > 0:
            return self.subtotal() / self.cantidad_en_base
        return 0

    def save(self, *args, **kwargs):
        if self.unidad_medida and self.cantidad:
            self.cantidad_en_base = self.unidad_medida.convertir_a_base(self.cantidad)
        else:
            self.cantidad_en_base = 0 
        if self.produccion and self.produccion.precio_sugerido_venta is not None:
            produccion_unit = self.produccion.fk_unidad_medida
            if produccion_unit and self.unidad_medida:
                precio_por_base_desde_produccion = self.produccion.precio_sugerido_venta / produccion_unit.factor_conversion
                self.precio_unidad = precio_por_base_desde_produccion * self.unidad_medida.factor_conversion
            else:
                self.precio_unidad = 0 
        else:
            self.precio_unidad = 0
        # Calcular precio_unidad_con_descuento
        if self.descuento_porcentaje > 0:
            self.precio_unidad_con_descuento = self.precio_unidad * (1 - self.descuento_porcentaje / 100)
        else:
            self.precio_unidad_con_descuento = self.precio_unidad
        super().save(*args, **kwargs)
        self.venta.actualizar_total()

    def delete(self, *args, **kwargs):
        venta = self.venta
        super().delete(*args, **kwargs)
        venta.actualizar_total()