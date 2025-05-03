from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.trazabilidad.programacion.models import Programacion
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.finanzas.venta.models import Venta
import logging
from .services import TrazabilidadService

logger = logging.getLogger(__name__)

def _convertir_fechas(datos):
    """Helper function para convertir fechas a strings"""
    if 'fecha_plantacion' in datos:
        datos['fecha_plantacion'] = str(datos['fecha_plantacion'])
    
    if 'detalle_actividades' in datos:
        for actividad in datos['detalle_actividades']:
            if 'fecha_programada' in actividad:
                actividad['fecha_programada'] = str(actividad['fecha_programada'])
            if 'fecha_realizada' in actividad:
                actividad['fecha_realizada'] = str(actividad['fecha_realizada'])
    
    if 'detalle_ventas' in datos:
        for venta in datos['detalle_ventas']:
            if 'fecha' in venta:
                venta['fecha'] = str(venta['fecha'])
    
    return datos

@receiver(post_save, sender=Programacion)
def actualizar_trazabilidad_programacion(sender, instance, **kwargs):
    if instance.estado == 'Completada':
        try:
            plantacion = instance.fk_id_asignacionActividades.fk_id_realiza.fk_id_plantacion
            datos = TrazabilidadService.generar_datos_trazabilidad(plantacion.id)
            datos = _convertir_fechas(datos)
            
            TrazabilidadService.crear_snapshot(
                plantacion_id=plantacion.id,
                datos=datos,
                trigger='programacion_completada'
            )
        except Exception as e:
            logger.error(f"Error al crear snapshot de programación: {str(e)}", exc_info=True)

@receiver(post_save, sender=Control_fitosanitario)
def actualizar_trazabilidad_control(sender, instance, **kwargs):
    try:
        plantacion = instance.fk_id_plantacion
        datos = TrazabilidadService.generar_datos_trazabilidad(plantacion.id)
        datos = _convertir_fechas(datos)
        
        TrazabilidadService.crear_snapshot(
            plantacion_id=plantacion.id,
            datos=datos,
            trigger='control_fitosanitario'
        )
    except Exception as e:
        logger.error(f"Error al crear snapshot de control: {str(e)}", exc_info=True)

@receiver(post_save, sender=Venta)
def actualizar_trazabilidad_venta(sender, instance, **kwargs):
    try:
        plantacion = instance.fk_id_produccion.fk_id_plantacion
        datos = TrazabilidadService.generar_datos_trazabilidad(plantacion.id)
        datos = _convertir_fechas(datos)
        
        TrazabilidadService.crear_snapshot(
            plantacion_id=plantacion.id,
            datos=datos,
            trigger='venta_registrada'
        )
    except Exception as e:
        logger.error(f"Error al crear snapshot de venta: {str(e)}", exc_info=True)