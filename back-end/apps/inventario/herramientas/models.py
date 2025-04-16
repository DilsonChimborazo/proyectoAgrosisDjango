from django.db import models

# Create your models here.
class Herramientas (models.Model):
    estados = [
        ('Disponible', 'Disponible'),
        ('Prestado', 'Prestado'),
        ('En reparación', 'En reparación')
    ]
    nombre_h = models.CharField(max_length=500)
    cantidad = models.IntegerField()
    estado = models.CharField(max_length=50 ,choices=estados, null=True)

    def _str_(self):
        return self.nombre_h