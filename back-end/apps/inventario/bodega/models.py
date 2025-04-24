from django.db import models
from apps.inventario.herramientas.models import Herramientas
from apps.inventario.insumo.models import Insumo
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.inventario.unidadMedida.models import UnidadMedida
from decimal import Decimal


class Bodega(models.Model):
    movimientos =[
        ('Entrada', 'Entrada'),
        ('Salida', 'Salida'),
    ]
    fk_id_herramientas = models.ForeignKey(Herramientas, on_delete=models.SET_NULL, null=True)
    fk_id_insumo = models.ForeignKey(Insumo, on_delete=models.SET_NULL, null=True)
    fk_id_asignacion = models.ForeignKey(Asignacion_actividades, on_delete=models.SET_NULL, null=True)
    cantidad = models.PositiveIntegerField(default=1)
    fecha = models.DateTimeField(auto_now_add=True)
    movimiento =  models.CharField(max_length=20, choices=movimientos, default='Entrada')
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

    def save(self, *args, **kwargs):
        # Calcular la cantidad en base si hay unidad de medida
        if self.fk_unidad_medida:
            self.cantidad_en_base = self.fk_unidad_medida.convertir_a_base(self.cantidad)

        # Calcular el costo total del insumo usando el precio_por_base del insumo
        if self.fk_id_insumo:
            precio_por_base = self.fk_id_insumo.precio_por_base  
            if self.cantidad_en_base and precio_por_base:
                self.costo_insumo = Decimal(self.cantidad_en_base) * precio_por_base

        # Verificar si el movimiento es de tipo 'Salida' y si está asociada una herramienta
        if self.movimiento == 'Salida' and self.fk_id_herramientas:
            herramienta = self.fk_id_herramientas
            if herramienta.cantidad >= self.cantidad:
                herramienta.cantidad -= self.cantidad
                herramienta.save()
            else:
                raise ValueError("La cantidad a retirar excede la cantidad disponible en herramientas")

        # Si es una Entrada, puedes aumentar la cantidad también
        elif self.movimiento == 'Entrada' and self.fk_id_herramientas:
            herramienta = self.fk_id_herramientas
            herramienta.cantidad += self.cantidad
            herramienta.save()

        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.movimiento} - {self.cantidad} {self.fk_unidad_medida} - {self.fecha}"
