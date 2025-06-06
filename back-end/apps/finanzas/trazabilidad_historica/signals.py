from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.trazabilidad.programacion.models import Programacion
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.finanzas.venta.models import Venta, ItemVenta
from apps.finanzas.produccion.models import Produccion
from .services import TrazabilidadService
from .models import SnapshotTrazabilidad
import logging

logger = logging.getLogger(__name__)

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
    if 'detalle_insumos' in datos:
        for insumo in datos['detalle_insumos']:
            if 'fecha' in insumo:
                insumo['fecha'] = str(insumo['fecha'])
    if 'detalle_ventas' in datos:
        for venta in datos['detalle_ventas']:
            if 'fecha' in venta:
                venta['fecha'] = str(venta['fecha'])
    return datos

@receiver(post_save, sender=ItemVenta)
def actualizar_trazabilidad_itemventa(sender, instance, created, **kwargs):
    logger.info(f"Signal ItemVenta: instance.id={instance.id}, created={created}, instance_pk={instance.pk}")
    if not created:
        return
    try:
        plantacion = instance.produccion.fk_id_plantacion
        datos = TrazabilidadService.generar_datos_trazabilidad(plantacion.id)
        if datos:
            datos = _convertir_fechas(datos)
            # Verificar si el snapshot es necesario
            from django.db import transaction
            with transaction.atomic():
                last_snapshot = TrazabilidadService._obtener_proxima_version(plantacion.id) - 1
                if last_snapshot > 0:
                    last_data = SnapshotTrazabilidad.objects.get(plantacion_id=plantacion.id, version=last_snapshot).datos
                    if last_data.get('ingresos_ventas_acumulado') == datos.get('ingresos_ventas_acumulado'):
                        logger.info(f"No se crea snapshot para plantación {plantacion.id}: sin cambios en ingresos.")
                        return
                TrazabilidadService.crear_snapshot(
                    plantacion_id=plantacion.id,
                    datos=datos,
                    trigger='item_venta_registrado'
                )
        else:
            logger.warning(f"No se generaron datos de trazabilidad para la plantación {plantacion.id} tras item de venta registrado.")
    except Exception as e:
        logger.error(f"Error al crear snapshot por item de venta: {str(e)}", exc_info=True)

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