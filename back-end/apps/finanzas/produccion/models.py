from django.db import models
from apps.trazabilidad.cultivo.models import Cultivo

# Create your models here.

class Produccion(models.Model):
    id_produccion = models.AutoField(primary_key=True)
    nombre_produccion = models.CharField(max_length=100)
    fk_id_cultivo = models.ForeignKey(Cultivo, on_delete=models.SET_NULL, null=True)
    cantidad_produccion = models.DecimalField(null=True,max_digits=20,decimal_places=10)
    fecha = models.DateField() 

    def __str__(self):
        return f"Producción {self.nombre_produccion} - {self.cantidad_produccion} en {self.fecha}"