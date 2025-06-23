from django.db import transaction
from .models import SnapshotTrazabilidad, ResumenTrazabilidad
from apps.trazabilidad.plantacion.models import Plantacion
from apps.trazabilidad.cultivo.models import Cultivo
from apps.trazabilidad.programacion.models import Programacion
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.trazabilidad.realiza.models import Realiza
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.finanzas.venta.models import Venta, ItemVenta
from apps.inventario.bodega.models import Bodega
from apps.finanzas.produccion.models import Produccion
from apps.finanzas.salario.models import Salario
from django.db.models import Sum, F, Q
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

class TrazabilidadService:
    
    @classmethod
    def crear_snapshot(cls, plantacion_id, datos, trigger=None):
        try:
            with transaction.atomic():
                snapshot = SnapshotTrazabilidad.objects.create(
                    plantacion_id=plantacion_id,
                    datos=datos,
                    version=cls._obtener_proxima_version(plantacion_id),
                    trigger=trigger
                )
                ResumenTrazabilidad.objects.update_or_create(
                    plantacion_id=plantacion_id,
                    defaults={
                        'datos_actuales': datos,
                        'precio_minimo_venta_por_unidad': datos.get('precio_minimo_venta_por_unidad_acumulado', 0.0)
                    }
                )
                logger.info(f"Snapshot creado: plantacion_id={plantacion_id}, version={snapshot.version}, trigger={trigger}")
                return snapshot
        except Exception as e:
            logger.error(f"Error al crear snapshot para plantacion_id={plantacion_id}: {str(e)}", exc_info=True)
            raise

    @classmethod
    def _obtener_proxima_version(cls, plantacion_id):
        ultimo = SnapshotTrazabilidad.objects.filter(
            plantacion_id=plantacion_id
        ).order_by('-version').first()
        return ultimo.version + 1 if ultimo else 1

    @classmethod
    def _calcular_costo_mano_obra(cls, programaciones_queryset, controles_queryset):
        costo_total = Decimal('0')
        for prog in programaciones_queryset:
            usuarios = prog.fk_id_asignacionActividades.fk_identificacion.all()
            if not usuarios:
                logger.warning(f"Programación {prog.id} sin usuarios asignados")
                continue
            horas = Decimal(prog.duracion) / Decimal('60')
            numero_usuarios = len(usuarios)
            horas_por_usuario = horas / numero_usuarios if numero_usuarios > 0 else horas
            for usuario in usuarios:
                if not usuario.fk_id_rol:
                    logger.error(f"Usuario {usuario.id} no tiene rol asignado")
                    continue
                salario = Salario.objects.filter(
                    fk_id_rol=usuario.fk_id_rol,
                    fecha_inicio__lte=prog.fecha_realizada,
                    activo=True
                ).order_by('-fecha_inicio').first()
                if salario and salario.horas_por_jornal > 0:
                    jornales = horas_por_usuario / Decimal(salario.horas_por_jornal)
                    costo_total += jornales * salario.precio_jornal
                else:
                    logger.warning(f"No se encontró salario activo para el rol {usuario.fk_id_rol.rol} en la fecha {prog.fecha_realizada}")
        for control in controles_queryset:
            usuarios = control.fk_identificacion.all()
            if not usuarios:
                logger.warning(f"Control fitosanitario {control.id} sin usuarios asignados")
                continue
            horas = Decimal(control.duracion) / Decimal('60')
            numero_usuarios = len(usuarios)
            horas_por_usuario = horas / numero_usuarios if numero_usuarios > 0 else horas
            for usuario in usuarios:
                if not usuario.fk_id_rol:
                    logger.error(f"Usuario {usuario.id} no tiene rol asignado")
                    continue
                salario = Salario.objects.filter(
                    fk_id_rol=usuario.fk_id_rol,
                    fecha_inicio__lte=control.fecha_control,
                    activo=True
                ).order_by('-fecha_inicio').first()
                if salario and salario.horas_por_jornal > 0:
                    jornales = horas_por_usuario / Decimal(salario.horas_por_jornal)
                    costo_total += jornales * salario.precio_jornal
                else:
                    logger.warning(f"No se encontró salario activo para el rol {usuario.fk_id_rol.rol} en la fecha {control.fecha_control}")
        return round(costo_total, 2)

    @classmethod
    def _get_detalle_actividades(cls, programaciones, controles):
        detalle = []
        for programacion in programaciones:
            asignacion = programacion.fk_id_asignacionActividades
            usuarios = asignacion.fk_identificacion.all()
            responsables = ", ".join(
                f"{usuario.nombre} {usuario.apellido}" for usuario in usuarios
            ) if usuarios else "Sin responsables"
            detalle.append({
                'id': asignacion.id,
                'estado': programacion.estado,
                'fecha_programada': asignacion.fecha_programada,
                'fecha_realizada': programacion.fecha_realizada,
                'actividad': asignacion.fk_id_realiza.fk_id_actividad.nombre_actividad,
                'responsable': responsables,
                'duracion_minutos': programacion.duracion,
                'observaciones': asignacion.observaciones
            })
        for control in controles:
            usuarios = control.fk_identificacion.all()
            responsables = ", ".join(
                f"{usuario.nombre} {usuario.apellido}" for usuario in usuarios
            ) if usuarios else "Sin responsables"
            detalle.append({
                'id': control.id,
                'estado': 'Completada',
                'fecha_programada': control.fecha_control,
                'fecha_realizada': control.fecha_control,
                'actividad': f"Control Fitosanitario ({control.get_tipo_control_display()})",
                'responsable': responsables,
                'duracion_minutos': control.duracion,
                'observaciones': control.descripcion,
                'tipo_control': control.tipo_control,
                'pea': control.fk_id_pea.nombre_pea if control.fk_id_pea else None
            })
        return detalle

    @classmethod
    def _get_detalle_insumos(cls, asignaciones, controles):
        detalle = []
        salidas_bodega = Bodega.objects.filter(
            fk_id_asignacion__in=asignaciones,
            movimiento='Salida',
            fk_id_insumo__isnull=False
        ).select_related(
            'fk_id_insumo',
            'fk_unidad_medida',
            'fk_id_asignacion__fk_id_realiza__fk_id_actividad'
        )
        for salida in salidas_bodega:
            detalle.append({
                'tipo': 'Actividad',
                'nombre': salida.fk_id_insumo.nombre if salida.fk_id_insumo else 'Sin nombre',
                'tipo_insumo': salida.fk_id_insumo.tipo if salida.fk_id_insumo else None,
                'cantidad': salida.cantidad_insumo or 0,
                'unidad_medida': salida.fk_unidad_medida.nombre_medida if salida.fk_unidad_medida else None,
                'cantidad_base': salida.cantidad_en_base or 0,
                'precio_por_base': salida.fk_id_insumo.precio_por_base if salida.fk_id_insumo and salida.fk_id_insumo.precio_por_base else None,
                'costo_total': salida.costo_insumo or 0,
                'fecha': salida.fecha,
                'actividad_asociada': (
                    salida.fk_id_asignacion.fk_id_realiza.fk_id_actividad.nombre_actividad
                    if salida.fk_id_asignacion and salida.fk_id_asignacion.fk_id_realiza and salida.fk_id_asignacion.fk_id_realiza.fk_id_actividad
                    else None
                )
            })
        for control in controles:
            if control.fk_id_insumo:
                detalle.append({
                    'tipo': 'Control Fitosanitario',
                    'nombre': control.fk_id_insumo.nombre,
                    'tipo_insumo': control.fk_id_insumo.tipo,
                    'cantidad': control.cantidad_insumo,
                    'unidad_medida': control.fk_unidad_medida.nombre_medida if control.fk_unidad_medida else None,
                    'cantidad_base': control.cantidad_en_base,
                    'precio_por_base': control.fk_id_insumo.precio_por_base if control.fk_id_insumo else None,
                    'costo_total': control.costo_insumo,
                    'fecha': control.fecha_control,
                    'actividad_asociada': f"Control {control.get_tipo_control_display()}",
                    'pea': control.fk_id_pea.nombre_pea if control.fk_id_pea else None
                })
        return detalle

    @classmethod
    def _get_detalle_ventas(cls, ventas):
        detalle = []
        items_venta = ItemVenta.objects.filter(
            venta__in=ventas
        ).select_related('venta', 'produccion', 'unidad_medida')
        for item in items_venta:
            detalle.append({
                'cantidad': item.cantidad,
                'precio_unidad_con_descuento': item.precio_unidad_con_descuento,
                'total': item.venta.total,
                'fecha': item.venta.fecha,
                'unidad_medida': item.unidad_medida.nombre_medida if item.unidad_medida else None,
                'produccion_asociada': item.produccion.nombre_produccion if item.produccion else None
            })
        return detalle

    @classmethod
    def _get_detalle_herramientas(cls, programaciones):
        detalle = []
        for programacion in programaciones:
            asignacion = programacion.fk_id_asignacionActividades
            actividad = (
                asignacion.fk_id_realiza.fk_id_actividad.nombre_actividad
                if asignacion and asignacion.fk_id_realiza and asignacion.fk_id_realiza.fk_id_actividad
                else "Sin actividad"
            )
            resultado_depreciacion = programacion.calcular_depreciacion()
            detalles_depreciacion = resultado_depreciacion.get("detalles", [])
            for detalle_depreciacion in detalles_depreciacion:
                detalle.append({
                    "herramienta": detalle_depreciacion["herramienta"],
                    "cantidad": detalle_depreciacion["cantidad"],
                    "depreciacion": detalle_depreciacion["depreciacion"],
                    "fecha": programacion.fecha_realizada,
                    "actividad_asociada": actividad,
                })
        return detalle

    @classmethod
    def generar_datos_trazabilidad(cls, plantacion_id):
        try:
            plantacion = Plantacion.objects.get(id=plantacion_id)
            cultivo = plantacion.fk_id_cultivo
            asignaciones_all = Asignacion_actividades.objects.filter(
                fk_id_realiza__fk_id_plantacion=plantacion
            ).select_related(
                'fk_id_realiza__fk_id_actividad'
            ).prefetch_related(
                'fk_identificacion'
            )
            programaciones_all = Programacion.objects.filter(
                fk_id_asignacionActividades__in=asignaciones_all,
                estado='Completada'
            ).select_related(
                'fk_id_asignacionActividades__fk_id_realiza__fk_id_actividad'
            ).prefetch_related(
                'fk_id_asignacionActividades__fk_identificacion'
            )
            controles_all = Control_fitosanitario.objects.filter(
                fk_id_plantacion=plantacion
            ).select_related(
                'fk_id_insumo',
                'fk_unidad_medida',
                'fk_id_pea'
            ).prefetch_related(
                'fk_identificacion'
            )
            producciones_all = Produccion.objects.filter(fk_id_plantacion=plantacion).order_by('fecha')

            # Obtener el nombre completo de la unidad base de la última producción
            unidad_base = None
            ultima_produccion = producciones_all.last()
            if ultima_produccion and ultima_produccion.fk_unidad_medida:
                unidad_base = ultima_produccion.fk_unidad_medida.get_unidad_base_display()

            # Cálculo de datos acumulados
            total_minutos_acumulado = programaciones_all.aggregate(total=Sum('duracion'))['total'] or 0
            tiempo_controles_acumulado = controles_all.aggregate(total=Sum('duracion'))['total'] or 0
            total_minutos_acumulado += tiempo_controles_acumulado
            total_horas_acumulado = round(Decimal(total_minutos_acumulado) / Decimal('60'), 2)
            salario_default = Salario.objects.filter(activo=True).first()
            horas_por_jornal = salario_default.horas_por_jornal if salario_default else 8
            jornales_acumulado = round(total_horas_acumulado / Decimal(horas_por_jornal), 2)
            costo_mano_obra_acumulado = cls._calcular_costo_mano_obra(programaciones_all, controles_all)
            egresos_bodega_acumulado = Bodega.objects.filter(
                fk_id_asignacion__in=asignaciones_all,
                movimiento='Salida',
                fk_id_insumo__isnull=False
            ).aggregate(total=Sum('costo_insumo'))['total'] or 0
            egresos_controles_acumulado = controles_all.aggregate(total=Sum('costo_insumo'))['total'] or 0
            egresos_insumos_acumulado = egresos_bodega_acumulado + egresos_controles_acumulado
            depreciacion_herramientas_acumulada = programaciones_all.aggregate(
                total=Sum('depreciacion_total', filter=Q(depreciacion_total__isnull=False))
            )['total'] or Decimal('0')
            total_cantidad_producida_base_acumulado = producciones_all.aggregate(
                total=Sum('cantidad_en_base')
            )['total'] or Decimal('0')
            ventas_all = Venta.objects.filter(
                items__produccion__in=producciones_all
            ).distinct()
            ingresos_ventas_acumulado = ItemVenta.objects.filter(
                venta__in=ventas_all
            ).aggregate(
                total=Sum(F('precio_unidad_con_descuento') * F('cantidad'))
            )['total'] or 0
            costo_total_acumulado = (
                costo_mano_obra_acumulado + 
                egresos_insumos_acumulado + 
                depreciacion_herramientas_acumulada
            )
            beneficio_costo_acumulado = (
                round((ingresos_ventas_acumulado / costo_total_acumulado), 2) 
                if costo_total_acumulado > 0 else 0
            )
            balance_acumulado = ingresos_ventas_acumulado - costo_total_acumulado
            precio_minimo_venta_por_unidad_acumulado = Decimal('0')
            if total_cantidad_producida_base_acumulado > 0:
                precio_minimo_venta_por_unidad_acumulado = round(
                    costo_total_acumulado / total_cantidad_producida_base_acumulado, 4
                )

            # Cálculos para el costo incremental / última cosecha
            costo_incremental_ultima_cosecha = Decimal('0')
            cantidad_incremental_ultima_cosecha = Decimal('0')
            precio_minimo_incremental_ultima_cosecha = Decimal('0')
            fecha_ultima_produccion = None
            if producciones_all.exists():
                ultima_produccion = producciones_all.last()
                fecha_ultima_produccion = ultima_produccion.fecha
                penultima_produccion = producciones_all.filter(fecha__lt=fecha_ultima_produccion).order_by('-fecha').first()
                fecha_inicio_periodo_incremental = plantacion.fecha_plantacion
                if penultima_produccion:
                    fecha_inicio_periodo_incremental = penultima_produccion.fecha
                programaciones_incremental = programaciones_all.filter(
                    fk_id_asignacionActividades__fecha_programada__gte=fecha_inicio_periodo_incremental,
                    fk_id_asignacionActividades__fecha_programada__lte=fecha_ultima_produccion 
                )
                controles_incremental = controles_all.filter(
                    fecha_control__gte=fecha_inicio_periodo_incremental,
                    fecha_control__lte=fecha_ultima_produccion 
                )
                costo_mano_obra_incremental = cls._calcular_costo_mano_obra(
                    programaciones_incremental, controles_incremental
                )
                asignaciones_incremental = Asignacion_actividades.objects.filter(
                    programacion__in=programaciones_incremental
                )
                egresos_bodega_incremental = Bodega.objects.filter(
                    fk_id_asignacion__in=asignaciones_incremental,
                    movimiento='Salida',
                    fk_id_insumo__isnull=False
                ).aggregate(total=Sum('costo_insumo'))['total'] or 0
                egresos_controles_incremental = controles_incremental.aggregate(total=Sum('costo_insumo'))['total'] or 0
                egresos_insumos_incremental = egresos_bodega_incremental + egresos_controles_incremental
                depreciacion_incremental_ultima_cosecha = programaciones_incremental.aggregate(
                    total=Sum('depreciacion_total', filter=Q(depreciacion_total__isnull=False))
                )['total'] or Decimal('0')
                costo_incremental_ultima_cosecha = (
                    costo_mano_obra_incremental + 
                    egresos_insumos_incremental + 
                    depreciacion_incremental_ultima_cosecha
                )
                cantidad_incremental_ultima_cosecha = ultima_produccion.cantidad_en_base or Decimal('0')
                if cantidad_incremental_ultima_cosecha > 0:
                    precio_minimo_incremental_ultima_cosecha = round(
                        costo_incremental_ultima_cosecha / cantidad_incremental_ultima_cosecha, 4
                    )

            # Cálculo: Precio mínimo para recuperar inversión
            costo_a_cubrir_neto = max(Decimal('0'), costo_total_acumulado - ingresos_ventas_acumulado)
            stock_disponible_total = producciones_all.aggregate(total=Sum('stock_disponible'))['total'] or Decimal('0')
            precio_minimo_recuperar_inversion = Decimal('0')
            if stock_disponible_total > 0:
                precio_minimo_recuperar_inversion = round(costo_a_cubrir_neto / stock_disponible_total, 4)

            # Obtener detalles
            detalle_actividades = cls._get_detalle_actividades(programaciones_all, controles_all)
            detalle_insumos = cls._get_detalle_insumos(asignaciones_all, controles_all)
            detalle_ventas = cls._get_detalle_ventas(ventas_all)
            detalle_herramientas = cls._get_detalle_herramientas(programaciones_all)
            
            return {
                "plantacion_id": plantacion.id,
                "cultivo": cultivo.nombre_cultivo if cultivo else None,
                "especie": cultivo.fk_id_especie.nombre_comun if cultivo and cultivo.fk_id_especie else None,
                "fecha_plantacion": plantacion.fecha_plantacion,
                "era": plantacion.fk_id_eras.descripcion if plantacion.fk_id_eras else None,
                "lote": plantacion.fk_id_eras.fk_id_lote.nombre_lote if plantacion.fk_id_eras and plantacion.fk_id_eras.fk_id_lote else None,
                "total_tiempo_minutos": total_minutos_acumulado,
                "total_horas": total_horas_acumulado,
                "jornales": jornales_acumulado,
                "costo_mano_obra_acumulado": float(costo_mano_obra_acumulado),
                "egresos_insumos_acumulado": float(egresos_insumos_acumulado),
                "depreciacion_herramientas_acumulada": float(depreciacion_herramientas_acumulada),
                "ingresos_ventas_acumulado": float(ingresos_ventas_acumulado),
                "beneficio_costo_acumulado": float(beneficio_costo_acumulado),
                "total_cantidad_producida_base_acumulado": float(total_cantidad_producida_base_acumulado),
                "precio_minimo_venta_por_unidad_acumulado": float(precio_minimo_venta_por_unidad_acumulado),
                "costo_incremental_ultima_cosecha": float(costo_incremental_ultima_cosecha),
                "cantidad_incremental_ultima_cosecha": float(cantidad_incremental_ultima_cosecha),
                "precio_minimo_incremental_ultima_cosecha": float(precio_minimo_incremental_ultima_cosecha),
                "precio_minimo_recuperar_inversion": float(precio_minimo_recuperar_inversion),
                "stock_disponible_total": float(stock_disponible_total),
                "unidad_base": unidad_base,  # Ahora contiene 'Gramo', 'Mililitro' o 'Unidad'
                "detalle_actividades": detalle_actividades,
                "detalle_insumos": detalle_insumos,
                "detalle_ventas": detalle_ventas,
                "detalle_herramientas": detalle_herramientas,
                "resumen": {
                    "total_actividades": len(detalle_actividades),
                    "total_controles": controles_all.count(),
                    "total_ventas": ventas_all.count(),
                    "total_insumos": len(detalle_insumos),
                    "total_herramientas": len(detalle_herramientas),
                    "costo_total_acumulado": float(costo_total_acumulado),
                    "balance_acumulado": float(balance_acumulado)
                }
            }
        except Plantacion.DoesNotExist:
            logger.warning(f"Plantación con ID {plantacion_id} no encontrada.")
            return {}
        except Exception as e:
            logger.error(f"Error en generar_datos_trazabilidad para plantación {plantacion_id}: {str(e)}", exc_info=True)
            return {}