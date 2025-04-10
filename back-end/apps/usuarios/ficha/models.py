from django.db import models
from django.utils.timezone import now

class Ficha(models.Model):
    numero_ficha = models.CharField(max_length=20, unique=True)
    nombre_ficha = models.CharField(max_length=30)
    fecha_inicio = models.DateTimeField(default=now)
    fecha_salida = models.DateTimeField(default=now)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.numero_ficha