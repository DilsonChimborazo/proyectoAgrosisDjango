from django.db import models
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.inventario.unidadMedida.models import UnidadMedida

# Create your models here.
class Programacion(models.Model): 
    ESTADOS = [
        ('Pendiente', 'Pendiente'),
        ('Completada', 'Completada'),
        ('Cancelada', 'Cancelada'),
        ('Reprogramada', 'Reprogramada'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='completada')
    fecha_realizada = models.DateField() 
    duracion = models.IntegerField(help_text="Duración en minutos")
    fk_id_asignacionActividades = models.ForeignKey(Asignacion_actividades, on_delete=models.SET_NULL, null=True)
    cantidad_insumo = models.IntegerField(null=True, blank=True)
    img = models.ImageField(upload_to='imagenes/')
    fk_unidad_medida = models.ForeignKey(UnidadMedida, on_delete=models.SET_NULL, null=True)
    
    def __str__(self): 
        return f'{self.estado}'