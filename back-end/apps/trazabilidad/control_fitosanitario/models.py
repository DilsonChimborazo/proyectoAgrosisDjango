from django.db import models
from apps.trazabilidad.cultivo.models import Cultivo
from apps.trazabilidad.pea.models import Pea
from apps.inventario.insumo.models import Insumo
from apps.usuarios.usuario.models import Usuarios

# Create your models here.
class Control_fitosanitario(models.Model):
    TIPOS_CONTROL = [
        ('Control Biologico', 'Control Biologico'),
        ('Control Fisico', 'Control Fisico'),
        ('Control Quimico', 'Control Quimico'),
        ('Control Cultural', 'Control Cultural'),
        ('Control Genetico', 'Control Genetico')
    ]
    fecha_control = models.DateField()
    duracion = models.IntegerField(help_text="Duración en minutos")
    descripcion = models.CharField(max_length=300)
    tipo_control = models.CharField(max_length=20, choices=TIPOS_CONTROL, default='Control Biológico')
    fk_id_cultivo = models.ForeignKey(Cultivo, on_delete=models.SET_NULL, null=True)
    fk_id_pea = models.ForeignKey(Pea, on_delete=models.SET_NULL, null=True)
    fk_id_insumo = models.ForeignKey(Insumo, on_delete=models.SET_NULL, null=True)
    cantidad_insumo = models.IntegerField()
    fk_identificacion = models.ForeignKey(Usuarios, on_delete=models.SET_NULL, null=True)
    img = models.ImageField(upload_to='imagenes/')
    
    def _str_(self):
        return f"Cultivo: {self.fk_id_cultivo.nombre_cultivo} pea: {self.fk_id_pea}"