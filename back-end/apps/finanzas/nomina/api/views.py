from rest_framework.viewsets import ModelViewSet
from apps.finanzas.nomina.models import Nomina
from rest_framework.permissions import IsAuthenticated
from apps.finanzas.nomina.api.serializers import (
    LeerNominaSerializer,
    EscribirNominaSerializer
)
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q, F, Case, When, Value, CharField, Count
from django.db.models.functions import Coalesce
from rest_framework import status
from django.utils import timezone
from datetime import datetime

class NominaViewSet(ModelViewSet):
    queryset = Nomina.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerNominaSerializer
        return EscribirNominaSerializer

    @action(detail=False, methods=['get'], url_path='reporte-por-persona')
    def reporte_por_persona(self, request):
        query = Q()
        if request.query_params.get('fecha_inicio'):
            query &= Q(fecha_pago__gte=request.query_params.get('fecha_inicio'))
        if request.query_params.get('fecha_fin'):
            query &= Q(fecha_pago__lte=request.query_params.get('fecha_fin'))
        if request.query_params.get('usuario_id'):
            query &= Q(fk_id_usuario__id=request.query_params.get('usuario_id'))
        if request.query_params.get('pagado') in ['true', 'false']:
            query &= Q(pagado=request.query_params.get('pagado') == 'true')

        resultados = Nomina.objects.filter(query).annotate(
            usuario_id=Coalesce(
                F('fk_id_usuario__id'),
                F('fk_id_control_fitosanitario__fk_identificacion__id')
            ),
            usuario_nombre=Coalesce(
                F('fk_id_usuario__nombre'),
                F('fk_id_control_fitosanitario__fk_identificacion__nombre')
            ),
            usuario_apellido=Coalesce(
                F('fk_id_usuario__apellido'),
                F('fk_id_control_fitosanitario__fk_identificacion__apellido')
            ),
            usuario_rol=Coalesce(
                F('fk_id_usuario__fk_id_rol__rol'),
                F('fk_id_control_fitosanitario__fk_identificacion__fk_id_rol__rol')
            ),
            actividad=Case(
                When(
                    fk_id_programacion__isnull=False,
                    then=F('fk_id_programacion__fk_id_asignacionActividades__fk_id_realiza__fk_id_actividad__nombre_actividad')
                ),
                When(
                    fk_id_control_fitosanitario__isnull=False,
                    then=F('fk_id_control_fitosanitario__tipo_control')
                ),
                default=Value('Desconocida'),
                output_field=CharField()
            )
        ).values(
            'usuario_id',
            'usuario_nombre',
            'usuario_apellido',
            'usuario_rol',
            'actividad'
        ).annotate(
            total_pagado=Sum('pago_total'),
            cantidad_actividades=Count('pk', distinct=True)
        ).order_by('usuario_apellido', 'usuario_nombre')

        return Response(resultados)

    @action(detail=False, methods=['get'], url_path='reporte-por-actividad')
    def reporte_por_actividad(self, request):
        resultados = Nomina.objects.annotate(
            actividad=Case(
                When(
                    fk_id_programacion__isnull=False,
                    then=F('fk_id_programacion__fk_id_asignacionActividades__fk_id_realiza__fk_id_actividad__nombre_actividad')
                ),
                When(
                    fk_id_control_fitosanitario__isnull=False,
                    then=F('fk_id_control_fitosanitario__tipo_control')
                ),
                default=Value('Desconocida'),
                output_field=CharField()
            ),
            actividad_tipo=Case(
                When(fk_id_programacion__isnull=False, then=Value('Programación')),
                When(fk_id_control_fitosanitario__isnull=False, then=Value('Control Fitosanitario')),
                default=Value('Otro'),
                output_field=CharField()
            )
        ).values(
            'actividad',
            'actividad_tipo'
        ).annotate(
            total_pagado=Sum('pago_total'),
            cantidad=Count('pk', distinct=True)
        ).order_by('actividad_tipo', 'actividad')

        return Response(resultados)

    @action(detail=False, methods=['get'], url_path='reporte-detallado')
    def reporte_detallado(self, request):
        query = Q()
        if request.query_params.get('fecha_inicio'):
            query &= Q(fecha_pago__gte=request.query_params.get('fecha_inicio'))
        if request.query_params.get('fecha_fin'):
            query &= Q(fecha_pago__lte=request.query_params.get('fecha_fin'))
        if request.query_params.get('usuario_id'):
            query &= Q(fk_id_usuario__id=request.query_params.get('usuario_id'))
        if request.query_params.get('pagado') in ['true', 'false']:
            query &= Q(pagado=request.query_params.get('pagado') == 'true')

        nominas = Nomina.objects.filter(query).select_related(
            'fk_id_programacion__fk_id_asignacionActividades__fk_id_realiza__fk_id_actividad',
            'fk_id_control_fitosanitario',
            'fk_id_salario',
            'fk_id_usuario__fk_id_rol',
            'fk_id_usuario__ficha'
        ).all()

        data = []
        for nomina in nominas:
            usuario = nomina.fk_id_usuario
            if usuario:
                usuarios_data = [
                    {'id': usuario.id, 'nombre': usuario.nombre, 'apellido': usuario.apellido}
                ]
            else:
                usuarios_data = [{'id': None, 'nombre': 'Usuario', 'apellido': 'Desconocido'}]

            if nomina.fk_id_programacion:
                actividad = nomina.fk_id_programacion.fk_id_asignacionActividades.fk_id_realiza.fk_id_actividad.nombre_actividad
                tipo = 'Programación'
            elif nomina.fk_id_control_fitosanitario:
                actividad = nomina.fk_id_control_fitosanitario.tipo_control
                tipo = 'Control Fitosanitario'
            else:
                actividad = "Desconocida"
                tipo = "Otro"

            data.append({
                'id': nomina.id,
                'fecha_pago': nomina.fecha_pago,
                'pagado': nomina.pagado,
                'pago_total': float(nomina.pago_total) if nomina.pago_total else 0,
                'actividad': actividad,
                'tipo_actividad': tipo,
                'usuarios': usuarios_data,
                'salario': {
                    'jornal': float(nomina.fk_id_salario.precio_jornal) if nomina.fk_id_salario and nomina.fk_id_salario.precio_jornal else None,
                    'horas_por_jornal': nomina.fk_id_salario.horas_por_jornal if nomina.fk_id_salario else None
                }
            })
        return Response(data)

    @action(
        detail=True,
        methods=['patch'],
        url_path='marcar-pagado',
        url_name='marcar_pagado'
    )
    def marcar_pagado(self, request, pk=None):
        try:
            nomina = self.get_object()
            
            if nomina.pagado:
                return Response(
                    {'error': 'Este pago ya fue marcado como completado anteriormente'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            nomina.pagado = True
            nomina.fecha_pago = timezone.now().date()
            nomina.save()
            
            return Response(
                {
                    'status': 'success',
                    'message': 'Pago marcado como completado',
                    'data': {
                        'id': nomina.id,
                        'fecha_pago': nomina.fecha_pago,
                        'pagado': nomina.pagado
                    }
                },
                status=status.HTTP_200_OK
            )
            
        except Nomina.DoesNotExist:
            return Response(
                {'error': f'Nómina con ID {pk} no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(
        detail=False,
        methods=['post'],
        url_path='marcar-pagado-por-usuario',
        url_name='marcar_pagado_por_usuario'
    )
    def marcar_pagado_por_usuario(self, request):
        usuario_id = request.data.get('usuario_id')
        fecha_inicio = request.data.get('fecha_inicio')
        fecha_fin = request.data.get('fecha_fin')

        if not usuario_id:
            return Response(
                {'error': 'El campo usuario_id es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Filtrar nóminas pendientes del usuario
            query = Q(fk_id_usuario__id=usuario_id, pagado=False)

            # Aplicar filtros de fecha si se proporcionan
            if fecha_inicio:
                try:
                    fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d').date()
                    query &= Q(fecha_pago__gte=fecha_inicio) | Q(fecha_pago__isnull=True)
                except ValueError:
                    return Response(
                        {'error': 'Formato de fecha_inicio inválido. Use YYYY-MM-DD'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            if fecha_fin:
                try:
                    fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d').date()
                    query &= Q(fecha_pago__lte=fecha_fin) | Q(fecha_pago__isnull=True)
                except ValueError:
                    return Response(
                        {'error': 'Formato de fecha_fin inválido. Use YYYY-MM-DD'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Actualizar nóminas
            nominas = Nomina.objects.filter(query)
            updated_count = nominas.update(
                pagado=True,
                fecha_pago=timezone.now().date()
            )

            return Response(
                {
                    'status': 'success',
                    'message': f'{updated_count} nóminas marcadas como pagadas',
                    'updated_count': updated_count
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )