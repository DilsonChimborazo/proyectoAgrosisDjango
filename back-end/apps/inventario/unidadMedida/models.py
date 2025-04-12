from django.db import models

# Create your models here.
class UnidadMedida (models.Model):
    nombre_medida = models.CharField(max_length=50, unique=True)
    abreviatura = models.CharField(max_length=20)

    def __str__(self):
        return self.nombre_medida, self.abreviatura