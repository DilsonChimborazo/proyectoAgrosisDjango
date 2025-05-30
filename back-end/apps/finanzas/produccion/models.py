from django.db import models
from apps.trazabilidad.plantacion.models import Plantacion
from apps.inventario.unidadMedida.models import UnidadMedida

class Produccion(models.Model):
    nombre_produccion = models.CharField(max_length=100)
    cantidad_producida = models.DecimalField(null=True, max_digits=20, decimal_places=3)
    fecha = models.DateField()
    stock_disponible = models.DecimalField(max_digits=20, decimal_places=0, default=0)
    precio_sugerido_venta = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Precio sugerido por la unidad de medida de esta producción (ej: por Kg, por unidad)." # <-- CAMBIO AQUI
    )
    fk_id_plantacion = models.ForeignKey(Plantacion, on_delete=models.SET_NULL, null=True)
    fk_unidad_medida = models.ForeignKey(UnidadMedida, on_delete=models.SET_NULL, null=True)

    cantidad_en_base = models.DecimalField(
        max_digits=20,
        decimal_places=3,
        null=True,
        blank=True,
        help_text="Cantidad convertida a la unidad base (g, ml o u)."
    )

    def save(self, *args, **kwargs):
        if self.fk_unidad_medida and self.cantidad_producida:
            self.cantidad_en_base = self.fk_unidad_medida.convertir_a_base(self.cantidad_producida)
            if not self.pk:  # Solo para nuevas producciones
                self.stock_disponible = self.cantidad_en_base
        super().save(*args, **kwargs)
    def __str__(self):
        return f"Producción {self.nombre_produccion} - {self.cantidad_producida} {self.fk_unidad_medida} en {self.fecha}"