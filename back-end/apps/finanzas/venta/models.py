from django.db import models
from apps.finanzas.produccion.models import Produccion
from apps.inventario.unidadMedida.models import UnidadMedida
# Create your models here.

class Venta(models.Model):
    precio_unidad = models.DecimalField(max_digits=10, decimal_places=2)  
    cantidad = models.IntegerField()
    fecha = models.DateField()  
    fk_id_produccion = models.ForeignKey(Produccion, on_delete=models.SET_NULL, null=True) 
    fk_unidad_medida = models.ForeignKey(UnidadMedida, on_delete=models.SET_NULL, null= True)

    # Cantidad convertida a unidad base (g, ml o unidad)
    cantidad_en_base = models.DecimalField(
        max_digits=20,
        decimal_places=10,
        null=True,
        blank=True,
        help_text="Cantidad vendida convertida a unidad base."
    )

    def save(self, *args, **kwargs):
        if self.fk_unidad_medida and self.cantidad:
            self.cantidad_en_base = self.fk_unidad_medida.convertir_a_base(self.cantidad)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Venta {self.id} - {self.fecha}"