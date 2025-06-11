from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, F, Q
from decimal import Decimal
from datetime import datetime, timedelta
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated

from apps.trazabilidad.plantacion.models import Plantacion
from apps.trazabilidad.cultivo.models import Cultivo
from apps.trazabilidad.programacion.models import Programacion
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.trazabilidad.realiza.models import Realiza
from apps.trazabilidad.actividad.models import Actividad
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.finanzas.nomina.models import Nomina
from apps.finanzas.stock.models import Stock
from apps.finanzas.venta.models import Venta, ItemVenta
from apps.inventario.bodega.models import Bodega
from apps.finanzas.produccion.models import Produccion
from apps.finanzas.salario.models import Salario
from apps.finanzas.trazabilidad_historica.models import SnapshotTrazabilidad, ResumenTrazabilidad
from apps.finanzas.trazabilidad_historica.api.serializers import SnapshotSerializer, ResumenTrazabilidadSerializer
from apps.finanzas.trazabilidad_historica.services import TrazabilidadService

import logging

logger = logging.getLogger(__name__)

class CustomPagination(PageNumberPagination):
    permission_classes = [IsAuthenticated]
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'results': data
        })

class HistorialViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = SnapshotTrazabilidad.objects.all()
    serializer_class = SnapshotSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        plantacion_id = self.kwargs.get('plantacion_id')
        if plantacion_id:
            return SnapshotTrazabilidad.objects.filter(
                plantacion_id=plantacion_id
            ).order_by('-fecha_registro')
        return super().get_queryset()

class ResumenActualViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ResumenTrazabilidad.objects.all()
    serializer_class = ResumenTrazabilidadSerializer
    lookup_field = 'plantacion_id'
    lookup_url_kwarg = 'plantacion_id'

class TrazabilidadPlantacionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_detalle_actividades(self, programaciones, controles):
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
    
    def _get_detalle_insumos(self, asignaciones, controles):
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
    
    def _get_detalle_ventas(self, ventas):
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
    
    def _get_detalle_herramientas(self, programaciones):
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

    def _calcular_costo_mano_obra(self, programaciones_queryset, controles_queryset):
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

    def calcular_trazabilidad(self, plantacion_id):
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

            # --- CÁLCULO DE DATOS ACUMULADOS ---
            
            total_minutos_acumulado = programaciones_all.aggregate(total=Sum('duracion'))['total'] or 0
            tiempo_controles_acumulado = controles_all.aggregate(total=Sum('duracion'))['total'] or 0
            total_minutos_acumulado += tiempo_controles_acumulado
            total_horas_acumulado = round(Decimal(total_minutos_acumulado) / Decimal('60'), 2)
            
            salario_default = Salario.objects.filter(activo=True).first()
            horas_por_jornal = salario_default.horas_por_jornal if salario_default else 8
            jornales_acumulado = round(total_horas_acumulado / Decimal(horas_por_jornal), 2)
            
            costo_mano_obra_acumulado = self._calcular_costo_mano_obra(programaciones_all, controles_all)
            
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
            
            # --- CÁLCULOS PARA EL COSTO INCREMENTAL / ÚLTIMA COSECHA ---
            
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
                
                costo_mano_obra_incremental = self._calcular_costo_mano_obra(
                    programaciones_incremental, controles_incremental
                )
                
                egresos_bodega_incremental = Bodega.objects.filter(
                    fk_id_asignacion__in=programaciones_incremental.values_list('fk_id_asignacionActividades', flat=True),
                    movimiento='Salida',
                    fk_id_insumo__isnull=False,
                    fecha__gte=fecha_inicio_periodo_incremental,
                    fecha__lte=fecha_ultima_produccion
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
            
            # --- CÁLCULO: PRECIO MÍNIMO PARA RECUPERAR INVERSIÓN ---
            costo_a_cubrir_neto = max(Decimal('0'), costo_total_acumulado - ingresos_ventas_acumulado)
            stock_disponible_total = producciones_all.aggregate(total=Sum('stock_disponible'))['total'] or Decimal('0')

            precio_minimo_recuperar_inversion = Decimal('0')
            if stock_disponible_total > 0:
                precio_minimo_recuperar_inversion = round(costo_a_cubrir_neto / stock_disponible_total, 4)

            # --- OBTENER DETALLES ---
            detalle_actividades = self._get_detalle_actividades(programaciones_all, controles_all)
            detalle_insumos = self._get_detalle_insumos(asignaciones_all, controles_all)
            detalle_ventas = self._get_detalle_ventas(ventas_all)
            detalle_herramientas = self._get_detalle_herramientas(programaciones_all)
            
            return {
                "plantacion_id": plantacion.id,
                "cultivo": cultivo.nombre_cultivo if cultivo else None,
                "especie": cultivo.fk_id_especie.nombre_comun if cultivo and cultivo.fk_id_especie else None,
                "fecha_plantacion": plantacion.fecha_plantacion,
                "era": plantacion.fk_id_eras.descripcion if plantacion.fk_id_eras else None,
                "lote": plantacion.fk_id_eras.fk_id_lote.nombre_lote if plantacion.fk_id_eras and plantacion.fk_id_eras.fk_id_lote else None,
                
                # Datos Acumulados
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
                
                # Datos Incremental/Última Cosecha
                "costo_incremental_ultima_cosecha": float(costo_incremental_ultima_cosecha),
                "cantidad_incremental_ultima_cosecha": float(cantidad_incremental_ultima_cosecha),
                "precio_minimo_incremental_ultima_cosecha": float(precio_minimo_incremental_ultima_cosecha),

                # Precio Mínimo para Recuperar Inversión
                "precio_minimo_recuperar_inversion": float(precio_minimo_recuperar_inversion),
                "stock_disponible_total": float(stock_disponible_total),
                
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
            logger.error(f"Error en calcular_trazabilidad para plantación {plantacion_id}: {e}", exc_info=True)
            raise e

    def get(self, request, plantacion_id):
        try:
            resultado = self.calcular_trazabilidad(plantacion_id)
            
            if not resultado:
                return Response({"error": "Plantación no encontrada"}, status=status.HTTP_404_NOT_FOUND)

            return Response(resultado)
            
        except Plantacion.DoesNotExist:
            return Response({"error": "Plantación no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HistoricoTrazabilidadAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SnapshotSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        plantacion_id = self.kwargs['plantacion_id']
        return SnapshotTrazabilidad.objects.filter(
            plantacion_id=plantacion_id
        ).order_by('-fecha_registro')

class ResumenActualTrazabilidadAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, plantacion_id):
        try:
            resumen = ResumenTrazabilidad.objects.get(plantacion_id=plantacion_id)
            serializer = ResumenTrazabilidadSerializer(resumen)
            return Response(serializer.data)
            
        except ResumenTrazabilidad.DoesNotExist:
            return Response({"error": "No hay datos de trazabilidad para esta plantación"}, 
                            status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)