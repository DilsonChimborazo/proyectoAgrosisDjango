from django.db import models
from apps.inventario.herramientas.models import Herramientas
from apps.inventario.insumo.models import Insumo
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.inventario.unidadMedida.models import UnidadMedida
from decimal import Decimal


class Bodega(models.Model):
    movimientos = [
        ('Entrada', 'Entrada'),
        ('Salida', 'Salida'),
    ]
    fk_id_herramientas = models.ForeignKey(Herramientas, on_delete=models.SET_NULL, null=True)
    fk_id_insumo = models.ForeignKey(Insumo, on_delete=models.SET_NULL, null=True)
    fk_id_asignacion = models.ForeignKey(Asignacion_actividades, on_delete=models.SET_NULL, null=True)
    cantidad_herramienta = models.PositiveIntegerField(default=0, null=True, blank=True)
    cantidad_insumo = models.PositiveIntegerField(default=0, null=True, blank=True)
    fecha = models.DateTimeField(auto_now_add=True)
    movimiento = models.CharField(max_length=20, choices=movimientos, default='Entrada')
    fk_unidad_medida = models.ForeignKey(UnidadMedida, on_delete=models.SET_NULL, null=True)
    
    cantidad_en_base = models.DecimalField(
        max_digits=20,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="Cantidad convertida a la unidad base"
    )

    costo_insumo = models.DecimalField(
        max_digits=20,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="Costo total del insumo en base a la cantidad base y precio por base"
    )

    @property
    def cantidad(self):
        """Propiedad para compatibilidad con código existente que usa 'cantidad'"""
        return self.cantidad_herramienta if self.fk_id_herramientas else self.cantidad_insumo

    def save(self, *args, **kwargs):
        # Calcular la cantidad en base si hay unidad de medida
        cantidad = self.cantidad
        if self.fk_unidad_medida and cantidad:
            self.cantidad_en_base = self.fk_unidad_medida.convertir_a_base(cantidad)

        # Calcular el costo total del insumo
        if self.fk_id_insumo and self.cantidad_insumo:
            precio = self.fk_id_insumo.precio_unidad
            if precio:
                self.costo_insumo = Decimal(self.cantidad_insumo) * precio

        # Manejo de movimientos de herramientas
        if self.fk_id_herramientas and self.cantidad_herramienta:
            herramienta = self.fk_id_herramientas
            if self.movimiento == 'Salida':
                if herramienta.cantidad_herramienta >= self.cantidad_herramienta:
                    herramienta.cantidad_herramienta -= self.cantidad_herramienta
                    herramienta.save()
                else:
                    raise ValueError("La cantidad a retirar excede la cantidad disponible en herramientas")
            elif self.movimiento == 'Entrada':
                herramienta.cantidad_herramienta += self.cantidad_herramienta
                herramienta.save()

        super().save(*args, **kwargs)

    def __str__(self):
        cantidad = self.cantidad
        unidad = self.fk_unidad_medida.nombre if self.fk_unidad_medida else "sin unidad"
        return f"{self.movimiento} - {cantidad} {unidad} - {self.fecha.strftime('%Y-%m-%d %H:%M')}"
