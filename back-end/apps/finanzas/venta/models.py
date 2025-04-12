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

    def __str__(self):
        return f"Venta {self.id_venta} - {self.fecha}"