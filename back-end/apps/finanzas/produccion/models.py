from django.db import models
from apps.trazabilidad.cultivo.models import Cultivo
from apps.inventario.unidadMedida.models import UnidadMedida

# Create your models here.

class Produccion(models.Model):
    nombre_produccion = models.CharField(max_length=100)
    cantidad_producida = models.DecimalField(null=True,max_digits=20,decimal_places=10)
    fecha = models.DateField() 
    fk_id_cultivo = models.ForeignKey(Cultivo, on_delete=models.SET_NULL, null=True)
    fk_unidad_medida = models.ForeignKey(UnidadMedida, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Producción {self.nombre_produccion} - {self.cantidad_produccion} en {self.fecha}"