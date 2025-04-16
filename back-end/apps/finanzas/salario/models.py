from django.db import models

# Create your models here.

class Salario(models.Model):
    jornal = models.IntegerField()
    precio_jornal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.jornal} jornales - {self.precio_jornal} cada uno"