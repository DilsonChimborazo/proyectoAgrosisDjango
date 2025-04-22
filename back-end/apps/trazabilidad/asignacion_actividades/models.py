from django.db import models
from apps.trazabilidad.realiza.models import Realiza
from apps.usuarios.usuario.models import Usuarios
from apps.inventario.insumo.models import Insumo
from apps.inventario.herramientas.models import Herramientas
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
import json

# Create your models here.
class Asignacion_actividades(models.Model):
    ESTADOS = [
        ('Pendiente', 'Pendiente'),
        ('Completada', 'Completada'),
        ('Cancelada', 'Cancelada'),
        ('Reprogramada', 'Reprogramada'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Pendiente')
    fecha_programada = models.DateField()
    observaciones = models.TextField() 
    fk_id_realiza = models.ForeignKey(Realiza, on_delete=models.SET_NULL, null=True)
    fk_identificacion = models.ForeignKey(Usuarios, on_delete=models.SET_NULL, null=True)
    
    def __str__(self): 
        return f'{self.fk_id_realiza} - {self.fk_identificacion}'