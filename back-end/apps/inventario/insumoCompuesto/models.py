from django.db import models
from apps.inventario.insumo.models import Insumo
from apps.inventario.unidadMedida.models import UnidadMedida

class InsumoCompuesto(models.Model):
    nombre = models.CharField(max_length=255)
    fk_unidad_medida = models.ForeignKey(UnidadMedida, on_delete=models.SET_NULL, null=True)
    cantidad_insumo = models.FloatField(default=0)

    def __str__(self):
        return self.nombre
    
    def crear_compuesto(self):
        """
        Método para descontar automáticamente las cantidades de los insumos base
        al crear este insumo compuesto.
        """
        for detalle in self.detalles.all():  # Usamos el related_name que configuramos antes
            insumo = detalle.insumo
            if insumo.cantidad_insumo >= detalle.cantidad_utilizada:
                insumo.cantidad_insumo -= detalle.cantidad_utilizada
                insumo.save()
            else:
                raise ValueError(f"No hay suficiente cantidad de {insumo.nombre} para crear el compuesto.")

    class Meta:
        verbose_name = "Insumo Compuesto"
        verbose_name_plural = "Insumos Compuestos"
