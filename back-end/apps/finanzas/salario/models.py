from django.db import models
from datetime import timedelta

# Create your models here.


class Salario(models.Model):
    precio_jornal = models.DecimalField(max_digits=10, decimal_places=2)
    horas_por_jornal = models.IntegerField(default=8)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        # Si este salario está activo, desactivar otros
        if self.activo:
            # Obtener el salario activo anterior (si existe)
            salario_anterior = Salario.objects.filter(activo=True).exclude(id=self.id).first()
            if salario_anterior:
                # Asignar fecha_fin = día anterior al nuevo salario
                salario_anterior.fecha_fin = self.fecha_inicio - timedelta(days=1)
                salario_anterior.activo = False
                salario_anterior.save(update_fields=['fecha_fin', 'activo'])
        super().save(*args, **kwargs)