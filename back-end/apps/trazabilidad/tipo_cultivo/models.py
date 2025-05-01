from django.db import models

# Create your models here.
class Tipo_cultivo(models.Model):
    CICLO = [
        ('Perennes', 'Perennes'),
        ('Semiperennes', 'Semiperennes'),
        ('Transitorios', 'Transitorios'),
    ]
    ciclo_duracion = models.CharField(max_length=20, choices=CICLO, default='Transitorios')
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()

    def __str__(self):
        return self.nombre

