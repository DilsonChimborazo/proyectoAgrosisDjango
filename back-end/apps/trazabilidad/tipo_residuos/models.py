from django.db import models

# Create your models here.
class Tipo_residuos(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField() 
    
    def __str__(self): 
        return self.nombre
