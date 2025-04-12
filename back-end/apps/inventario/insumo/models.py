from django.db import models
from apps.inventario.unidadMedida.models import UnidadMedida

# Create your models here.
class Insumo (models.Model):
    nombre =  models.CharField(max_length=500)
    tipo = models.CharField(max_length=200)
    precio_unidad = models.DecimalField (max_digits=10, decimal_places=2)
    cantidad = models.IntegerField ()
    fk_unidad_medida = models.ForeignKey(UnidadMedida, on_delete=models.SET_NULL, null=True)
    fecha_vencimiento = models.DateField()
    img = models.CharField(max_length=255)

    def _str_(self):
        return self.nombre