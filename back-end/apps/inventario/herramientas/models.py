from django.db import models

# Create your models here.
class Herramientas (models.Model):
    estados = [
        ('Disponible', 'Disponible'),
        ('Prestado', 'Prestado'),
        ('En reparacion', 'En reparacion')
    ]
    nombre_h = models.CharField(max_length=500)
    cantidad_herramienta = models.IntegerField()
    estado = models.CharField(max_length=50 ,choices=estados, null=True)
    

    def __str__(self):
        return self.nombre_h