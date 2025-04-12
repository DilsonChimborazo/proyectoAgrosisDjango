from django.db import models

class Lote(models.Model):
    dimencion = models.CharField(max_length=50)
    nombre_lote = models.CharField(max_length=50)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre_lote