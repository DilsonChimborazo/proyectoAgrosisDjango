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

    def calcular_costo_salida_insumo(self):
        """
        Calcula el costo total de un movimiento de salida de insumo.
        La cantidad ya está en unidad base. Se calcula el precio por unidad base
        dividiendo el precio_unidad por la cantidad_base del insumo.
        """
        if self.fk_id_insumo and self.movimiento == 'Salida':
            precio_unidad = self.fk_id_insumo.precio_unidad
            cantidad_base = self.fk_id_insumo.cantidad_en_base

            if precio_unidad and cantidad_base:
                precio_base = Decimal(precio_unidad) / Decimal(cantidad_base)
                return Decimal(self.cantidad_insumo) * precio_base

        return Decimal('0.0')

    @property
    def cantidad(self):
        """Propiedad para compatibilidad con código existente que usa 'cantidad'"""
        return self.cantidad_herramienta if self.fk_id_herramientas else self.cantidad_insumo

    def save(self, *args, **kwargs):
        # Calcular la cantidad en base si hay unidad de medida (solo para insumos)
        if self.fk_id_insumo and self.cantidad_insumo and self.fk_unidad_medida:
            self.cantidad_en_base = self.fk_unidad_medida.convertir_a_base(self.cantidad_insumo)
        else:
            self.cantidad_en_base = None

        # Calcular el costo total del insumo (solo para entradas o salidas de insumos)
        if self.fk_id_insumo and self.cantidad_insumo:
            if self.movimiento == 'Entrada':
                precio_unidad = self.fk_id_insumo.precio_unidad
                if precio_unidad:
                    self.costo_insumo = Decimal(self.cantidad_insumo) * Decimal(precio_unidad)
                else:
                    self.costo_insumo = None
            elif self.movimiento == 'Salida':
                precio_por_base = self.fk_id_insumo.precio_por_base
                if precio_por_base:
                    self.costo_insumo = Decimal(self.cantidad_insumo) * Decimal(precio_por_base)
                else:
                    self.costo_insumo = None

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

        # Manejo de movimientos de insumos (solo salidas o entradas, sin devolución)
        if self.fk_id_insumo and self.cantidad_insumo:
            insumo = self.fk_id_insumo
            if self.movimiento == 'Salida':
                cantidad_en_base = self.fk_unidad_medida.convertir_a_base(self.cantidad_insumo) if self.fk_unidad_medida else Decimal(self.cantidad_insumo)
                if insumo.cantidad_en_base is None:
                    insumo.cantidad_en_base = Decimal('0')
                if insumo.cantidad_en_base >= cantidad_en_base:
                    insumo.cantidad_en_base -= cantidad_en_base
                    if insumo.fk_unidad_medida and insumo.fk_unidad_medida.factor_conversion:
                        insumo.cantidad_insumo = int(insumo.cantidad_en_base / insumo.fk_unidad_medida.factor_conversion)
                    else:
                        insumo.cantidad_insumo -= self.cantidad_insumo
                    insumo.save()
                else:
                    raise ValueError(f"La cantidad a retirar ({cantidad_en_base} {self.fk_unidad_medida.unidad_base if self.fk_unidad_medida else 'unidades'}) excede la cantidad disponible ({insumo.cantidad_en_base} {insumo.fk_unidad_medida.unidad_base if insumo.fk_unidad_medida else 'unidades'})")
            elif self.movimiento == 'Entrada':
                cantidad_en_base = self.fk_unidad_medida.convertir_a_base(self.cantidad_insumo) if self.fk_unidad_medida else Decimal(self.cantidad_insumo)
                if insumo.cantidad_en_base is None:
                    insumo.cantidad_en_base = Decimal('0')
                insumo.cantidad_en_base += cantidad_en_base
                if insumo.fk_unidad_medida and insumo.fk_unidad_medida.factor_conversion:
                    insumo.cantidad_insumo = int(insumo.cantidad_en_base / insumo.fk_unidad_medida.factor_conversion)
                else:
                    insumo.cantidad_insumo += self.cantidad_insumo
                insumo.save()

        super().save(*args, **kwargs)

    def __str__(self):
        cantidad = self.cantidad_en_base or self.cantidad
        unidad = self.fk_unidad_medida.unidad_base if self.fk_unidad_medida else "sin unidad"
        return f"{self.movimiento} - {cantidad} {unidad} - {self.fecha.strftime('%Y-%m-%d %H:%M')}"