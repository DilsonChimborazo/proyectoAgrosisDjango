from django.db import models

class Herramientas(models.Model):
    estados = [
        ('Disponible', 'Disponible'),
        ('Prestado', 'Prestado'),
        ('En reparacion', 'En reparacion')
    ]
    nombre_h = models.CharField(max_length=500)
    cantidad_herramienta = models.IntegerField()
    estado = models.CharField(max_length=50, choices=estados, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Precio original unitario de la herramienta")
    valor_actual = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Valor actual unitario de la herramienta tras depreciación")

    def save(self, *args, **kwargs):
        # Inicializar valor_actual con precio si es nulo
        if self.valor_actual is None and self.precio is not None:
            self.valor_actual = self.precio
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre_h