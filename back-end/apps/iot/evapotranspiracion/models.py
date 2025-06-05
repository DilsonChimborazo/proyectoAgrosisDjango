from django.db import models
from apps.trazabilidad.plantacion.models import Plantacion


class Evapotranspiracion(models.Model):
    fk_id_plantacion = models.ForeignKey(Plantacion, on_delete=models.CASCADE, related_name="evapotranspiraciones")
    fecha = models.DateField()
    eto = models.DecimalField(max_digits=8, decimal_places=2)
    etc = models.DecimalField(max_digits=8, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        pass

    def __str__(self):
        return f"ETo: {self.eto} mm/día | ETc: {self.etc} mm/día | Plantación: {self.fk_id_plantacion}"
