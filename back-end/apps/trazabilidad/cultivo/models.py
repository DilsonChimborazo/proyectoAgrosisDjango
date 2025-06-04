from django.db import models
from apps.trazabilidad.especie.models import Especie

class Cultivo(models.Model):
    # Opciones para la etapa del cultivo

    nombre_cultivo = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=300)
    fk_id_especie = models.ForeignKey(Especie, on_delete=models.SET_NULL, null=True)




    def _str_(self):
        return self.nombre_cultivo

