from django.db import models
from apps.trazabilidad.cultivo.models import Cultivo
from apps.trazabilidad.pea.models import Pea
from apps.inventario.insumo.models import Insumo

# Create your models here.
class Control_fitosanitario(models.Model):
    TIPOS_CONTROL = [
        ('Control Biológico', 'Control Biológico'),
        ('Control Físico', 'Control Físico'),
        ('Control Químico', 'Control Químico'),
        ('Control Cultural', 'Control Cultural'),
        ('Control Genético ', 'Control Genético')
    ]
    fecha_control = models.DateField()
    descripcion = models.CharField(max_length=300)
    tipo_control = models.CharField(max_length=20, choices=TIPOS_CONTROL, default='Control Biológico')
    fk_id_cultivo = models.ForeignKey(Cultivo, on_delete=models.SET_NULL, null=True)
    fk_id_pea = models.ForeignKey(Pea, on_delete=models.SET_NULL, null=True)
    fk_id_insumo = models.ForeignKey(Insumo, on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return f"Cultivo: {self.fk_id_cultivo.nombre_cultivo} pea: {self.fk_id_pea}" 

