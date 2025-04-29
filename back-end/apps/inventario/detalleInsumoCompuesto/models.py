from django.db import models
from apps.inventario.insumo.models import Insumo
from apps.inventario.insumoCompuesto.models import InsumoCompuesto

class DetalleInsumoCompuesto(models.Model):
    insumo_compuesto = models.ForeignKey(InsumoCompuesto, on_delete=models.CASCADE, related_name='detalles')
    insumo = models.ForeignKey(Insumo, on_delete=models.CASCADE)
    cantidad_utilizada = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.cantidad_utilizada} de {self.insumo.nombre} en {self.insumo_compuesto.nombre}"
