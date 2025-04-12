from django.db import models
from django.utils.timezone import now

class Rol(models.Model):
    rol = models.CharField(max_length=20, unique=True)
    fecha_creacion = models.DateField()

    def __str__(self):
        return self.rol