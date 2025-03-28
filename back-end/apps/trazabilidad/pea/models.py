from django.db import models

# Create your models here.

class Pea(models.Model):
    TIPOS_PEA = [
        ('Plaga', 'Plaga'),
        ('Enfermedad', 'Enfermedad'),
        ('Arvense', 'Arvense'),
    ]
    nombre_pea = models.CharField(max_length=100)
    descripcion = models.TextField() 
    tipo_pea = models.CharField(max_length=20, choices=TIPOS_PEA, default='plaga')
    
    def __str__(self): return self.nombre_pea
