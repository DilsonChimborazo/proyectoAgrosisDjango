from rest_framework.viewsets import ModelViewSet
from apps.finanzas.nomina.models import Nomina
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from apps.finanzas.nomina.api.serializers import (
    LeerNominaSerializer,
    EscribirNominaSerializer
)
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import models  # Ya está importado, pero asegúrate de que incluya Count
from django.db.models import Sum, Q, F, Case, When, Value, CharField, Count  # Añadimos Count aquí
from django.db.models.functions import Coalesce
from rest_framework import status
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated

class NominaViewSet(ModelViewSet):
    queryset = Nomina.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerNominaSerializer
        return EscribirNominaSerializer

    @action(detail=False, methods=['get'], url_path='reporte-por-persona')
    def reporte_por_persona(self, request):
        resultados = Nomina.objects.annotate(
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
            'usuario_rol',  # Nuevo campo
            'actividad'
        ).annotate(
            total_pagado=Sum('pago_total'),
            cantidad_actividades=Count('pk', distinct=True)
        ).order_by('usuario_apellido', 'usuario_nombre')

        return Response(resultados)
    @action(detail=False, methods=['get'], url_path='reporte-por-actividad')
    def reporte_por_actividad(self, request):
        """
        Reporte de pagos agrupados por tipo de actividad
        """
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
            cantidad=Sum('pk', distinct=True)
        ).order_by('actividad_tipo', 'actividad')

        return Response(resultados)

    @action(detail=False, methods=['get'], url_path='reporte-detallado')
    def reporte_detallado(self, request):
        """
        Reporte detallado con todas las nóminas y su información relacionada.
        (Versión corregida para mostrar el usuario individual correcto)
        """
        nominas = Nomina.objects.select_related(
            'fk_id_programacion__fk_id_asignacionActividades__fk_id_realiza__fk_id_actividad',
            'fk_id_control_fitosanitario',
            'fk_id_salario',
            'fk_id_usuario__fk_id_rol',  # Incluimos el rol del usuario para eficiencia    
        ).all()

        data = []
        for nomina in nominas:
            # --- LÓGICA CORREGIDA ---
            # 1. Obtener el usuario directamente de la nómina.
            usuario = nomina.fk_id_usuario
            
            # 2. Preparar los datos del usuario. Siempre será una lista con un solo usuario.
            if usuario:
                usuarios_data = [
                    {'id': usuario.id, 'nombre': usuario.nombre, 'apellido': usuario.apellido}
                ]
            else:
                usuarios_data = [{'id': None, 'nombre': 'Usuario', 'apellido': 'Desconocido'}]

            # 3. Determinar la actividad y el tipo
            if nomina.fk_id_programacion:
                actividad = nomina.fk_id_programacion.fk_id_asignacionActividades.fk_id_realiza.fk_id_actividad.nombre_actividad
                tipo = 'Programación'
            elif nomina.fk_id_control_fitosanitario:
                actividad = nomina.fk_id_control_fitosanitario.tipo_control
                tipo = 'Control Fitosanitario'
            else:
                actividad = "Desconocida"
                tipo = "Otro"
                
            # 4. Construir el objeto de respuesta
            data.append({
                'id': nomina.id,
                'fecha_pago': nomina.fecha_pago,
                'pagado': nomina.pagado,
                'pago_total': float(nomina.pago_total) if nomina.pago_total else 0,
                'actividad': actividad,
                'tipo_actividad': tipo,
                'usuarios': usuarios_data, # Ahora 'usuarios' siempre contiene la persona correcta.
                'salario': {
                    'jornal': float(nomina.fk_id_salario.precio_jornal) if nomina.fk_id_salario and nomina.fk_id_salario.precio_jornal else None,
                    'horas_por_jornal': nomina.fk_id_salario.horas_por_jornal if nomina.fk_id_salario else None
                }
            })
        return Response(data)