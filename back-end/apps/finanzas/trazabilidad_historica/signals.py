from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.trazabilidad.programacion.models import Programacion
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.finanzas.venta.models import Venta

from .services import TrazabilidadService

@receiver(post_save, sender=Programacion)
def actualizar_trazabilidad_programacion(sender, instance, **kwargs):
    if instance.estado == 'Completada':
        try:
            plantacion = instance.fk_id_asignacionActividades.fk_id_realiza.fk_id_plantacion
            TrazabilidadService.crear_snapshot(
                plantacion_id=plantacion.id,
                datos=_generar_datos_trazabilidad(plantacion),
                trigger='programacion_completada'
            )
        except Exception as e:
            print(f"Error al crear snapshot de programación: {str(e)}")

@receiver(post_save, sender=Control_fitosanitario)
def actualizar_trazabilidad_control(sender, instance, **kwargs):
    try:
        TrazabilidadService.crear_snapshot(
            plantacion_id=instance.fk_id_plantacion.id,
            datos=_generar_datos_trazabilidad(instance.fk_id_plantacion),
            trigger='control_fitosanitario'
        )
    except Exception as e:
        print(f"Error al crear snapshot de control: {str(e)}")

@receiver(post_save, sender=Venta)
def actualizar_trazabilidad_venta(sender, instance, **kwargs):
    try:
        plantacion = instance.fk_id_produccion.fk_id_plantacion
        TrazabilidadService.crear_snapshot(
            plantacion_id=plantacion.id,
            datos=_generar_datos_trazabilidad(plantacion),
            trigger='venta_registrada'
        )
    except Exception as e:
        print(f"Error al crear snapshot de venta: {str(e)}")

def _generar_datos_trazabilidad(plantacion):
    from .views import TrazabilidadPlantacionAPIView
    view = TrazabilidadPlantacionAPIView()
    response = view.get(request=None, plantacion_id=plantacion.id)
    
    # Convertir objetos date/datetime a strings
    data = response.data
    data['fecha_plantacion'] = str(data.get('fecha_plantacion'))  # Convertir fecha a string
    
    # También para fechas en objetos anidados
    if 'detalle_actividades' in data:
        for actividad in data['detalle_actividades']:
            actividad['fecha_programada'] = str(actividad.get('fecha_programada'))
            actividad['fecha_realizada'] = str(actividad.get('fecha_realizada'))
    
    if 'detalle_ventas' in data:
        for venta in data['detalle_ventas']:
            venta['fecha'] = str(venta.get('fecha'))
    
    return data