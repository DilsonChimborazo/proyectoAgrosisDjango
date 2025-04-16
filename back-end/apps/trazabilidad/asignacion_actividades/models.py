from django.db import models
from apps.trazabilidad.actividad.models import Actividad
from apps.usuarios.usuario.models import Usuarios
from apps.inventario.insumo.models import Insumo
from apps.inventario.herramientas.models import Herramientas
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
import json

# Create your models here.
class Asignacion_actividades(models.Model):
    fecha = models.DateField()
    observaciones = models.TextField() 
    fk_id_actividad = models.ForeignKey(Actividad, on_delete=models.SET_NULL, null=True, related_name="asignaciones" )
    id_identificacion = models.ForeignKey(Usuarios, on_delete=models.SET_NULL, null=True)
    fk_id_insumo = models.ForeignKey(Insumo, on_delete=models.SET_NULL, null=True)
    fk_id_herramienta = models.ForeignKey(Herramientas, on_delete=models.SET_NULL, null=True)
    
    def _str_(self): 
        return f'{self.fk_id_actividad} - {self.id_identificacion}'