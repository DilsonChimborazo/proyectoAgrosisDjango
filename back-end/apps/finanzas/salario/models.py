from django.db import models

# Create your models here.

class Salario(models.Model):
    precio_jornal = models.DecimalField(max_digits=10, decimal_places=2)
    horas_por_jornal = models.IntegerField(default=8)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ['-fecha_inicio']

    def save(self, *args, **kwargs):
        # Desactivar otros salarios activos al crear uno nuevo
        if self.activo:
            Salario.objects.filter(activo=True).update(activo=False)
        super().save(*args, **kwargs)