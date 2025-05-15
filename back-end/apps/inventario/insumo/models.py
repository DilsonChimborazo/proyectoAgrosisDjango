from django.db import models
from decimal import Decimal

from apps.inventario.unidadMedida.models import UnidadMedida

# Create your models here.
class Insumo (models.Model):
    nombre =  models.CharField(max_length=500)
    tipo = models.CharField(max_length=200)
    precio_unidad = models.DecimalField (max_digits=10, decimal_places=2)
    cantidad_insumo = models.IntegerField ()
    
    cantidad_en_base = models.DecimalField(
        max_digits=20,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="Cantidad convertida a la unidad base (g, ml, u)"
    )
    
    precio_por_base = models.DecimalField(
        max_digits=20,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="Precio por unidad base (gramo, ml, unidad)"
    )

    fk_unidad_medida = models.ForeignKey(
    UnidadMedida, 
    on_delete=models.PROTECT,  
    null=False,
    help_text="Unidad de medida del insumo"
)
    fecha_vencimiento = models.DateField()
    img = models.ImageField(upload_to='imagenes/')

    def save(self, *args, **kwargs):
        if self.fk_unidad_medida:
            self.cantidad_en_base = self.fk_unidad_medida.convertir_a_base(self.cantidad_insumo)

            if self.cantidad_en_base and self.cantidad_en_base > 0:
                total_precio = self.precio_unidad * self.cantidad_insumo
                self.precio_por_base = total_precio / self.cantidad_en_base

        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre