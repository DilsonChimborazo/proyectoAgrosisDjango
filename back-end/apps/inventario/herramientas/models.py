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
    precio = models.DecimalField(max_digits=10,decimal_places=2,null=True, blank=True,)
    

    def __str__(self):
        return self.nombre_h