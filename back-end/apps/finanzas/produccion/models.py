from django.db import models
from django.core.validators import MinValueValidator
from apps.trazabilidad.plantacion.models import Plantacion
from apps.inventario.unidadMedida.models import UnidadMedida

class Produccion(models.Model):
    nombre_produccion = models.CharField(max_length=100)
    cantidad_producida = models.DecimalField(
        max_digits=20, 
        decimal_places=3,
        validators=[MinValueValidator(0.001)]
    )
    fecha = models.DateField()
    stock_disponible = models.DecimalField(
        max_digits=20, 
        decimal_places=3,
        default=0
    )
    fk_id_plantacion = models.ForeignKey(
        Plantacion, 
        on_delete=models.SET_NULL, 
        null=True,
        related_name='producciones'
    )
    fk_unidad_medida = models.ForeignKey(
        UnidadMedida, 
        on_delete=models.PROTECT,
        related_name='producciones'
    )
    cantidad_en_base = models.DecimalField(
        max_digits=20,
        decimal_places=3,
        null=True,
        blank=True,
        help_text="Cantidad convertida a la unidad base (g, ml o u)."
    )
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ['-fecha']
        verbose_name_plural = 'Producciones'

    def __str__(self):
        return f"{self.nombre_produccion} - {self.cantidad_producida} {self.fk_unidad_medida}"

    def save(self, *args, **kwargs):
        # Conversión a unidad base
        if self.fk_unidad_medida and self.cantidad_producida:
            self.cantidad_en_base = self.fk_unidad_medida.convertir_a_base(
                self.cantidad_producida
            )
            
            # Solo actualizar stock si es nueva producción
            if not self.pk:
                self.stock_disponible = self.cantidad_en_base

        super().save(*args, **kwargs)

    def actualizar_stock(self, nueva_cantidad):
        """Método para ajustes manuales de stock"""
        diferencia = nueva_cantidad - self.stock_disponible
        self.stock_disponible = nueva_cantidad
        self.save(update_fields=['stock_disponible'])
        return diferencia