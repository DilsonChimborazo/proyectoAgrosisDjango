from django.db import models
from django.utils import timezone
from datetime import timedelta
from apps.usuarios.rol.models import Rol

class Salario(models.Model):
    fk_id_rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, related_name='salarios')
    precio_jornal = models.DecimalField(max_digits=10, decimal_places=2)
    horas_por_jornal = models.IntegerField(default=8)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        # Establecer fecha_inicio automáticamente solo si no se proporciona
        if not self.pk and not self.fecha_inicio:
            self.fecha_inicio = timezone.now().date()

        # Si este salario está activo, desactivar otros salarios para el mismo rol
        if self.activo:
            salario_anterior = Salario.objects.filter(
                activo=True,
                fk_id_rol=self.fk_id_rol
            ).exclude(id=self.id).first()

            if salario_anterior:
                salario_anterior.fecha_fin = self.fecha_inicio  # Usar la fecha_inicio del nuevo salario
                salario_anterior.activo = False
                salario_anterior.save(update_fields=['fecha_fin', 'activo'])

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Salario para {self.fk_id_rol} - ${self.precio_jornal}/jornal"