from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.trazabilidad.programacion.models import Programacion
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.finanzas.venta.models import Venta, ItemVenta # Importar Venta aquí
from apps.finanzas.produccion.models import Produccion
from .services import TrazabilidadService
import logging

logger = logging.getLogger(__name__)

# Log para verificar cuántas veces se importa este archivo
logger.info("Initializing traceability signals module.")

def _convertir_fechas(datos):
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

# --- SIGNALS DESHABILITADOS TEMPORALMENTE (COMENTADOS) ---
# @receiver(post_save, sender=Programacion)
# def actualizar_trazabilidad_programacion(sender, instance, **kwargs):
#     logger.info(f"Signal Programacion: instance.id={instance.id}, created={kwargs.get('created', False)}")
#     if instance.estado == 'Completada':
#         try:
#             plantacion = instance.fk_id_asignacionActividades.fk_id_realiza.fk_id_plantacion
#             datos = TrazabilidadService.generar_datos_trazabilidad(plantacion.id)
#             if datos:
#                 datos = _convertir_fechas(datos)
#                 TrazabilidadService.crear_snapshot(
#                     plantacion_id=plantacion.id,
#                     datos=datos,
#                     trigger='programacion_completada'
#                 )
#             else:
#                 logger.warning(f"No se generaron datos de trazabilidad para la plantación {plantacion.id} tras programación completada.")
#         except Exception as e:
#             logger.error(f"Error al crear snapshot de programación: {str(e)}", exc_info=True)

# @receiver(post_save, sender=Control_fitosanitario)
# def actualizar_trazabilidad_control(sender, instance, **kwargs):
#     logger.info(f"Signal Control_fitosanitario: instance.id={instance.id}, created={kwargs.get('created', False)}")
#     try:
#         plantacion = instance.fk_id_plantacion
#         datos = TrazabilidadService.generar_datos_trazabilidad(plantacion.id)
#         if datos:
#             datos = _convertir_fechas(datos)
#             TrazabilidadService.crear_snapshot(
#                 plantacion_id=plantacion.id,
#                 datos=datos,
#                 trigger='control_fitosanitario'
#             )
#         else:
#             logger.warning(f"No se generaron datos de trazabilidad para la plantación {plantacion.id} tras control fitosanitario.")
#     except Exception as e:
#         logger.error(f"Error al crear snapshot de control: {str(e)}", exc_info=True)

# --- OPCIÓN 1: SIGNAL PARA ITEMVENTA (Si quieres un snapshot por cada item creado) ---
# Si esta opción está activa, los comentarios anteriores sobre ItemVenta.save() deben ser aplicados
@receiver(post_save, sender=ItemVenta)
def actualizar_trazabilidad_itemventa(sender, instance, created, **kwargs):
    logger.info(f"Signal ItemVenta: instance.id={instance.id}, created={created}, instance_pk={instance.pk}")
    if not created: # Solo si el item es NUEVO (no una actualización del mismo item)
        return
    try:
        plantacion = instance.produccion.fk_id_plantacion
        datos = TrazabilidadService.generar_datos_trazabilidad(plantacion.id)
        if datos:
            datos = _convertir_fechas(datos)
            TrazabilidadService.crear_snapshot(
                plantacion_id=plantacion.id,
                datos=datos,
                trigger='item_venta_registrado'
            )
        else:
            logger.warning(f"No se generaron datos de trazabilidad para la plantación {plantacion.id} tras item de venta registrado.")
    except Exception as e:
        logger.error(f"Error al crear snapshot por item de venta: {str(e)}", exc_info=True)

# --- OPCIÓN 2: SIGNAL PARA VENTA (Si quieres UN snapshot por cada operación de Venta completa) ---
# Si esta opción está activa, DESHABILITA el signal de ItemVenta de arriba.
# @receiver(post_save, sender=Venta)
# def actualizar_trazabilidad_venta_completa(sender, instance, created, **kwargs):
#     logger.info(f"Signal Venta: instance.id={instance.id}, created={created}, instance_pk={instance.pk}")
#     # Puedes decidir si quieres un snapshot solo en la creación o también en la actualización
#     # if not created: return
#     try:
#         plantacion = None
#         if instance.items.exists():
#             primer_item = instance.items.first()
#             if primer_item and primer_item.produccion:
#                 plantacion = primer_item.produccion.fk_id_plantacion
#         
#         if plantacion:
#             datos = TrazabilidadService.generar_datos_trazabilidad(plantacion.id)
#             if datos:
#                 datos = _convertir_fechas(datos)
#                 TrazabilidadService.crear_snapshot(
#                     plantacion_id=plantacion.id,
#                     datos=datos,
#                     trigger='venta_completa_registrada_o_actualizada'
#                 )
#             else:
#                 logger.warning(f"No se generaron datos de trazabilidad para la plantación {plantacion.id} tras venta completa.")
#         else:
#             logger.warning(f"Venta {instance.id} registrada/actualizada sin plantación asociada para generar snapshot.")
#     except Exception as e:
#         logger.error(f"Error al crear snapshot de venta completa: {str(e)}", exc_info=True)


# --- SIGNAL PARA PRODUCCION (Se mantiene activo) ---
@receiver(post_save, sender=Produccion)
def actualizar_trazabilidad_produccion(sender, instance, **kwargs):
    logger.info(f"Signal Produccion: instance.id={instance.id}, instance_pk={instance.pk}, created={kwargs.get('created', False)}")
    try:
        plantacion = instance.fk_id_plantacion
        if plantacion:
            datos = TrazabilidadService.generar_datos_trazabilidad(plantacion.id)
            if datos:
                datos = _convertir_fechas(datos)
                TrazabilidadService.crear_snapshot(
                    plantacion_id=plantacion.id,
                    datos=datos,
                    trigger='produccion_registrada_o_actualizada'
                )
            else:
                logger.warning(f"No se generaron datos de trazabilidad para la plantación {plantacion.id} tras producción.")
    except Exception as e:
        logger.error(f"Error al crear snapshot por producción: {str(e)}", exc_info=True)