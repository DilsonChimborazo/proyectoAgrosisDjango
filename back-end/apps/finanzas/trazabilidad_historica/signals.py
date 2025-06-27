from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.finanzas.venta.models import ItemVenta
from apps.finanzas.produccion.models import Produccion
from .services import TrazabilidadService
from .models import SnapshotTrazabilidad

def _convertir_fechas(datos):
    if not datos:
        return datos
    if datos.get('fecha_plantacion'):
        datos['fecha_plantacion'] = str(datos['fecha_plantacion'])
    if datos.get('detalle_actividades'):
        for actividad in datos['detalle_actividades']:
            if actividad.get('fecha_programada'):
                actividad['fecha_programada'] = str(actividad['fecha_programada'])
            if actividad.get('fecha_realizada'):
                actividad['fecha_realizada'] = str(actividad['fecha_realizada'])
    if datos.get('detalle_insumos'):
        for insumo in datos['detalle_insumos']:
            if insumo.get('fecha'):
                insumo['fecha'] = str(insumo['fecha'])
    if datos.get('detalle_ventas'):
        for venta in datos['detalle_ventas']:
            if venta.get('fecha'):
                venta['fecha'] = str(venta['fecha'])
    return datos

@receiver(post_save, sender=ItemVenta)
def actualizar_trazabilidad_itemventa(sender, instance, created, **kwargs):
    if not created:
        return
    try:
        if not instance.produccion:
            return
        plantacion = instance.produccion.fk_id_plantacion
        if not plantacion:
            return
        datos = TrazabilidadService.generar_datos_trazabilidad(plantacion.id)
        if not datos:
            return
        datos = _convertir_fechas(datos)
        from django.db import transaction
        with transaction.atomic():
            last_snapshot = SnapshotTrazabilidad.objects.filter(
                plantacion_id=plantacion.id
            ).order_by('-version').first()
            if last_snapshot:
                last_ingresos = last_snapshot.datos.get('ingresos_ventas_acumulado', 0)
                nuevos_ingresos = datos.get('ingresos_ventas_acumulado', 0)
                if abs(float(nuevos_ingresos) - float(last_ingresos)) < 0.001:
                    return
            TrazabilidadService.crear_snapshot(
                plantacion_id=plantacion.id,
                datos=datos,
                trigger='item_venta_registrado'
            )
    except Exception:
        pass

@receiver(post_save, sender=Produccion)
def crear_snapshot_por_produccion(sender, instance, created, **kwargs):
    if not created:
        return
    try:
        plantacion = instance.fk_id_plantacion
        if not plantacion:
            return
        datos = TrazabilidadService.generar_datos_trazabilidad(plantacion.id)
        if not datos:
            return
        datos = _convertir_fechas(datos)
        TrazabilidadService.crear_snapshot(
            plantacion_id=plantacion.id,
            datos=datos,
            trigger='produccion_registrada'
        )
    except Exception:
        pass