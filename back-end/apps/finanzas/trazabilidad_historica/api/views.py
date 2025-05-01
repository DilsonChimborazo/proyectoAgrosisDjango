from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, F, Q
from decimal import Decimal
from datetime import datetime, timedelta
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView

from apps.trazabilidad.plantacion.models import Plantacion
from apps.trazabilidad.cultivo.models import Cultivo
from apps.trazabilidad.programacion.models import Programacion
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.trazabilidad.realiza.models import Realiza
from apps.trazabilidad.actividad.models import Actividad
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.finanzas.nomina.models import Nomina
from apps.finanzas.stock.models import Stock
from apps.finanzas.venta.models import Venta
from apps.inventario.bodega.models import Bodega
from apps.finanzas.produccion.models import Produccion

from apps.finanzas.trazabilidad_historica.models import SnapshotTrazabilidad, ResumenTrazabilidad
from apps.finanzas.trazabilidad_historica.api.serializers import SnapshotSerializer, ResumenTrazabilidadSerializer
from apps.finanzas.trazabilidad_historica.services import TrazabilidadService

class CustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

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
    queryset = ResumenTrazabilidad.objects.all()
    serializer_class = ResumenTrazabilidadSerializer
    lookup_field = 'plantacion_id'
    lookup_url_kwarg = 'plantacion_id'

class TrazabilidadPlantacionAPIView(APIView):
    def get(self, request, plantacion_id):
        try:
            plantacion = Plantacion.objects.get(id=plantacion_id)
            cultivo = plantacion.fk_id_cultivo
            
            # 1. Obtener todas las asignaciones de actividades
            asignaciones = Asignacion_actividades.objects.filter(
                fk_id_realiza__fk_id_plantacion=plantacion
            ).select_related(
                'fk_id_realiza__fk_id_actividad',
                'fk_identificacion'
            )
            
            # 2. Obtener programaciones COMPLETADAS
            programaciones = Programacion.objects.filter(
                fk_id_asignacionActividades__in=asignaciones,
                estado='Completada'
            ).select_related(
                'fk_id_asignacionActividades__fk_id_realiza__fk_id_actividad',
                'fk_id_asignacionActividades__fk_identificacion'
            )
            
            # 3. Calcular tiempos totales
            total_minutos = programaciones.aggregate(total=Sum('duracion'))['total'] or 0
            total_horas = round(total_minutos / 60, 2)
            jornales = round(total_horas / 8, 2)
            
            # 4. Costos de mano de obra
            nominas = Nomina.objects.filter(
                fk_id_programacion__in=programaciones
            ).select_related('fk_id_salario')
            
            costo_mano_obra = nominas.aggregate(total=Sum('pago_total'))['total'] or 0
            
            # 5. Controles fitosanitarios
            controles = Control_fitosanitario.objects.filter(
                fk_id_plantacion=plantacion
            ).select_related(
                'fk_id_insumo',
                'fk_unidad_medida',
                'fk_id_pea'
            )
            
            # Sumar tiempo de controles
            tiempo_controles = controles.aggregate(total=Sum('duracion'))['total'] or 0
            total_minutos += tiempo_controles
            total_horas = round(total_minutos / 60, 2)
            jornales = round(total_horas / 8, 2)
            
            # 6. Egresos de insumos
            egresos_bodega = Bodega.objects.filter(
                fk_id_asignacion__in=asignaciones,
                movimiento='Salida',
                fk_id_insumo__isnull=False
            ).aggregate(total=Sum('costo_insumo'))['total'] or 0
            
            egresos_controles = controles.aggregate(total=Sum('costo_insumo'))['total'] or 0
            egresos_insumos = egresos_bodega + egresos_controles
            
            # 7. Ingresos por ventas
            producciones = Produccion.objects.filter(fk_id_plantacion=plantacion)
            ventas = Venta.objects.filter(
                fk_id_produccion__in=producciones
            ).annotate(ingreso_total=F('precio_unidad') * F('cantidad'))
            
            ingresos_ventas = ventas.aggregate(total=Sum('ingreso_total'))['total'] or 0
            
            # 8. Preparar datos detallados
            detalle_actividades = self._get_detalle_actividades(programaciones, controles)
            detalle_insumos = self._get_detalle_insumos(asignaciones, controles)
            detalle_ventas = self._get_detalle_ventas(ventas)
            
            # 9. Calcular relación beneficio/costo
            costo_total = costo_mano_obra + egresos_insumos
            beneficio_costo = round((ingresos_ventas / costo_total), 2) if costo_total > 0 else 0
            
            # Estructura final de resultados
            resultado = {
                "plantacion_id": plantacion.id,
                "cultivo": cultivo.nombre_cultivo if cultivo else None,
                "especie": cultivo.fk_id_especie.nombre_comun if cultivo and cultivo.fk_id_especie else None,
                "fecha_plantacion": plantacion.fecha_plantacion,
                "era": plantacion.fk_id_eras.descripcion if plantacion.fk_id_eras else None,
                "lote": plantacion.fk_id_eras.fk_id_lote.nombre_lote if plantacion.fk_id_eras and plantacion.fk_id_eras.fk_id_lote else None,
                "total_tiempo_minutos": total_minutos,
                "total_horas": total_horas,
                "jornales": jornales,
                "costo_mano_obra": costo_mano_obra,
                "egresos_insumos": egresos_insumos,
                "ingresos_ventas": ingresos_ventas,
                "beneficio_costo": beneficio_costo,
                "detalle_actividades": detalle_actividades,
                "detalle_insumos": detalle_insumos,
                "detalle_ventas": detalle_ventas,
                "resumen": {
                    "total_actividades": len(detalle_actividades),
                    "total_controles": controles.count(),
                    "total_ventas": ventas.count(),
                    "total_insumos": len(detalle_insumos),
                    "costo_total": costo_total,
                    "balance": ingresos_ventas - costo_total
                }
            }
            
            # Guardar snapshot si se solicita
            if request.query_params.get('save', 'false').lower() == 'true':
                snapshot = TrazabilidadService.crear_snapshot(
                    plantacion_id=plantacion.id,
                    datos=resultado,
                    trigger='consulta_manual'
                )
                resultado['snapshot_id'] = snapshot.id
            
            return Response(resultado)
        
        except Plantacion.DoesNotExist:
            return Response({"error": "Plantación no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_detalle_actividades(self, programaciones, controles):
        detalle = []
        for programacion in programaciones:
            asignacion = programacion.fk_id_asignacionActividades
            detalle.append({
                'id': asignacion.id,
                'estado': programacion.estado,
                'fecha_programada': asignacion.fecha_programada,
                'fecha_realizada': programacion.fecha_realizada,
                'actividad': asignacion.fk_id_realiza.fk_id_actividad.nombre_actividad,
                'responsable': f"{asignacion.fk_identificacion.nombre} {asignacion.fk_identificacion.apellido}",
                'duracion_minutos': programacion.duracion,
                'observaciones': asignacion.observaciones
            })
        
        for control in controles:
            detalle.append({
                'id': control.id,
                'estado': 'Completada',
                'fecha_programada': control.fecha_control,
                'fecha_realizada': control.fecha_control,
                'actividad': f"Control Fitosanitario ({control.get_tipo_control_display()})",
                'responsable': f"{control.fk_identificacion.nombre} {control.fk_identificacion.apellido}" if control.fk_identificacion else None,
                'duracion_minutos': control.duracion,
                'observaciones': control.descripcion,
                'tipo_control': control.tipo_control,
                'pea': control.fk_id_pea.nombre_pea if control.fk_id_pea else None
            })
        
        return detalle
    
    def _get_detalle_insumos(self, asignaciones, controles):
        detalle = []
        # Insumos de bodega
        salidas_bodega = Bodega.objects.filter(
            fk_id_asignacion__in=asignaciones,
            movimiento='Salida',
            fk_id_insumo__isnull=False
        ).select_related('fk_id_insumo', 'fk_unidad_medida')
        
        for salida in salidas_bodega:
            detalle.append({
                'tipo': 'Actividad',
                'nombre': salida.fk_id_insumo.nombre,
                'tipo_insumo': salida.fk_id_insumo.tipo,
                'cantidad': salida.cantidad,
                'unidad_medida': salida.fk_unidad_medida.nombre_medida if salida.fk_unidad_medida else None,
                'cantidad_base': salida.cantidad_en_base,
                'precio_por_base': salida.fk_id_insumo.precio_por_base if salida.fk_id_insumo else None,
                'costo_total': salida.costo_insumo,
                'fecha': salida.fecha,
                'actividad_asociada': salida.fk_id_asignacion.fk_id_realiza.fk_id_actividad.nombre_actividad if salida.fk_id_asignacion else None
            })
        
        # Insumos de controles fitosanitarios
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
        for venta in ventas:
            detalle.append({
                'cantidad': venta.cantidad,
                'precio_unidad': venta.precio_unidad,
                'ingreso_total': venta.precio_unidad * venta.cantidad,
                'fecha': venta.fecha,
                'unidad_medida': venta.fk_unidad_medida.nombre_medida if venta.fk_unidad_medida else None,
                'produccion_asociada': venta.fk_id_produccion.nombre_produccion if venta.fk_id_produccion else None
            })
        return detalle

class HistoricoTrazabilidadAPIView(ListAPIView):
    serializer_class = SnapshotSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        plantacion_id = self.kwargs['plantacion_id']
        return SnapshotTrazabilidad.objects.filter(
            plantacion_id=plantacion_id
        ).order_by('-fecha_registro')

class ResumenActualTrazabilidadAPIView(APIView):
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