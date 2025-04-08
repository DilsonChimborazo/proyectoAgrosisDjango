from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, F
from apps.finanzas.venta.models import Venta
from apps.finanzas.produccion.models import Produccion
from apps.trazabilidad.cultivo.models import Cultivo
from apps.finanzas.venta.api.serializers import leerVentaSerializer, escribirVentaSerializer, ReporteVentasSerializer, ReporteRentabilidadSerializer
from django.db.models import Prefetch
from decimal import Decimal, ROUND_HALF_UP
from apps.trazabilidad.programacion.models import Programacion

class VentaViewSet(ModelViewSet):
    queryset = Venta.objects.all().order_by('-fecha')
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return leerVentaSerializer
        return escribirVentaSerializer

    @action(detail=False, methods=['get'], url_path='reporte-ingresos')
    def reporte_ingresos(self, request):
        """
        Endpoint para generar reporte de ingresos por ventas agrupados por producto
        """
        # Obtener todas las ventas con sus relaciones
        ventas = Venta.objects.select_related(
            'fk_id_produccion'
        ).prefetch_related(
            Prefetch(
                'fk_id_produccion',
                queryset=Produccion.objects.select_related('fk_id_cultivo')
            )
        ).all()

        # Agrupar por cultivo
        cultivos_data = {}
        for venta in ventas:
            if venta.fk_id_produccion and venta.fk_id_produccion.fk_id_cultivo:
                cultivo = venta.fk_id_produccion.fk_id_cultivo
                if cultivo.id not in cultivos_data:
                    cultivos_data[cultivo.id] = {
                        'nombre': cultivo.nombre_cultivo,
                        'ventas': [],
                        'total': Decimal('0.00')
                    }
                
                precio_unitario = Decimal(str(venta.precio_unidad))
                total_venta = Decimal(venta.cantidad) * precio_unitario
                
                cultivos_data[cultivo.id]['ventas'].append({
                    'cantidad': venta.cantidad,
                    'precio_unitario': float(precio_unitario),
                    'total_venta': float(total_venta)
                })
                cultivos_data[cultivo.id]['total'] += total_venta

        # Preparar datos para el serializador
        reporte_data = []
        for cultivo.id, data in cultivos_data.items():
            reporte_data.append({
                'producto': data['nombre'],
                'ventas': data['ventas'],
                'total': float(data['total'])
            })

        serializer = ReporteVentasSerializer(reporte_data, many=True)
        
        total_general = float(sum(Decimal(str(item['total'])) for item in serializer.data))
        
        return Response({
            'reporte': serializer.data,
            'total_general': total_general,
            'estructura': "PRODUCTO | INGRESOS POR VENTAS | TOTAL"
        })

    @action(detail=False, methods=['get'], url_path='datos-base-rentabilidad')
    def datos_base_rentabilidad(self, request):
        """
        Endpoint que devuelve los datos brutos para cálculos de rentabilidad:
        - Minutos trabajados totales
        - Ingresos totales por ventas
        - Egresos totales por insumos
        """
        try:
            # 1. Obtener minutos trabajados totales
            minutos_totales = Programacion.objects.aggregate(
                total=Sum('duracion')
            )['total'] or 0

            # 2. Obtener ingresos totales por ventas
            ingresos_totales = Venta.objects.aggregate(
                total=Sum(F('cantidad') * F('precio_unidad'))
            )['total'] or 0

            # 3. Obtener egresos totales por insumos
            egresos_insumos = ControlUsaInsumo.objects.aggregate(
                total=Sum(F('cantidad') * F('fk_id_insumo__precio_unidad'))
            )['total'] or 0

            return Response({
                'minutos_trabajados': minutos_totales,
                'ingresos_totales': float(ingresos_totales),
                'egresos_insumos': float(egresos_insumos),
                'unidades_referencia': {
                    'minutos_por_hora': 60,
                    'horas_por_jornal': 8.5
                }
            })
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    @action(detail=False, methods=['get'], url_path='reporte-rentabilidad')
    def reporte_rentabilidad(self, request):
        """
        Endpoint para calcular rentabilidad con parámetros configurables
        """
        try:
            # Obtener parámetros configurables
            horas_por_jornal = Decimal(request.query_params.get('horas_por_jornal', '8.5'))
            costo_por_jornal = Decimal(request.query_params.get('costo_por_jornal', '60000'))

            # 1. Obtener minutos trabajados totales (convertir timedelta a minutos)
            from django.db.models import Sum
            minutos_result = Programacion.objects.aggregate(
                total_minutos=Sum('duracion')
            )
            minutos_totales = Decimal(minutos_result['total_minutos'].total_seconds() / 60 if minutos_result['total_minutos'] else 0)

            # 2. Obtener ingresos totales por ventas
            ingresos_totales = Decimal(
                Venta.objects.aggregate(
                    total=Sum(F('cantidad') * F('precio_unidad'))
                )['total'] or 0
            )

            # 3. Obtener egresos totales por insumos
            egresos_insumos = Decimal(
                ControlUsaInsumo.objects.aggregate(
                    total=Sum(F('cantidad') * F('fk_id_insumo__precio_unidad'))
                )['total'] or 0
            )

            # Realizar cálculos
            horas = (minutos_totales / Decimal('60')).quantize(Decimal('0.00'))
            jornales = (horas / horas_por_jornal).quantize(Decimal('0.00'))
            egresos_mano_obra = (jornales * costo_por_jornal).quantize(Decimal('0'))
            egresos_totales = egresos_mano_obra + egresos_insumos
            utilidad = ingresos_totales - egresos_totales
            relacion_bc = (utilidad / egresos_totales).quantize(Decimal('0.00')) if egresos_totales > 0 else Decimal('0')

            # Preparar respuesta
            data = {
                'parametros': {
                    'horas_por_jornal': float(horas_por_jornal),
                    'costo_por_jornal': float(costo_por_jornal)
                },
                'calculos': {
                    'minutos_trabajados': float(minutos_totales),
                    'horas': float(horas),
                    'jornales': float(jornales),
                    'egresos_mano_obra': float(egresos_mano_obra),
                    'ingresos_totales': float(ingresos_totales),
                    'egresos_insumos': float(egresos_insumos),
                    'egresos_totales': float(egresos_totales),
                    'utilidad': float(utilidad),
                    'relacion_bc': float(relacion_bc)
                },
                'interpretacion': {
                    'rentabilidad': 'Positiva' if relacion_bc > Decimal('1') else 'Negativa',
                    'recomendacion': 'Aumentar productividad' if relacion_bc < Decimal('1.5') else 'Mantener estrategia'
                }
            }

            serializer = ReporteRentabilidadSerializer(data)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=400)