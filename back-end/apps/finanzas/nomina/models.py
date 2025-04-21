from django.db import models
from apps.finanzas.salario.models import Salario 
from apps.trazabilidad.programacion.models import Programacion 


# Create your models here.

class Nomina(models.Model):
    fk_id_programacion = models.ForeignKey(Programacion, on_delete=models.SET_NULL, null=True)
    fk_id_salario = models.ForeignKey(Salario, on_delete=models.SET_NULL, null=True)
    pago_total = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"Nómina #{self.id} - Pago total: {self.pago_total}"
