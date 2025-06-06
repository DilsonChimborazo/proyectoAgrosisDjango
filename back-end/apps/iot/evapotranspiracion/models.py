from django.db import models
from apps.trazabilidad.plantacion.models import Plantacion

class Evapotranspiracion(models.Model):
    fk_id_plantacion = models.ForeignKey(Plantacion, on_delete=models.CASCADE, related_name="evapotranspiraciones")
    fecha = models.DateField()
    eto = models.DecimalField(max_digits=8, decimal_places=2)  # Evapotranspiración de referencia (mm/día)
    etc = models.DecimalField(max_digits=8, decimal_places=2)  # Evapotranspiración del cultivo (mm/día)
    cantidad_agua = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  # Volumen de agua (litros)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Evapotranspiración"
        verbose_name_plural = "Evapotranspiraciones"

    def __str__(self):
        return f"ETo: {self.eto} mm/día | ETc: {self.etc} mm/día | Plantación: {self.fk_id_plantacion}"

    def calcular_cantidad_agua(self):
        """
        Calcula la cantidad de agua necesaria (en litros) para el lote basado en el ETc y la dimensión del lote.
        Supone que el modelo Plantacion tiene un campo fk_id_eras que referencia al modelo Eras,
        y que Eras tiene un campo fk_id_lote que referencia al modelo Lote con un campo dimencion (en metros cuadrados).
        """
        try:
            # Accede al lote a través de la plantación
            lote = self.fk_id_plantacion.fk_id_eras.fk_id_lote
            dimension = lote.dimencion  # Mantiene el nombre original
            # ETc está en mm/día, que es equivalente a litros/m²/día
            # cantidad_agua = ETc (mm) * dimensión (m²) = litros/día
            self.cantidad_agua = self.etc * dimension
            return self.cantidad_agua
        except AttributeError:
            raise ValueError("No se pudo acceder al lote o a la dimensión. Verifica las relaciones entre los modelos.")

    def save(self, *args, **kwargs):
        """
        Sobrescribe el método save para calcular automáticamente la cantidad de agua antes de guardar.
        """
        if self.cantidad_agua is None:
            self.calcular_cantidad_agua()
        super().save(*args, **kwargs)