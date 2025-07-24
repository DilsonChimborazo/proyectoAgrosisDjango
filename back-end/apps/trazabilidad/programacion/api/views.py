from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.trazabilidad.programacion.models import Programacion
from rest_framework.permissions import IsAuthenticated
from apps.trazabilidad.programacion.api.serializers import (
    LeerProgramacionSerializer,
    EscribirProgramacionSerializer
)
from datetime import datetime
from django.db.models import Sum, Case, When, IntegerField, ExpressionWrapper, F, Func

# Función para convertir INTERVAL a segundos en PostgreSQL
class ExtractEpoch(Func):
    function = "EXTRACT"
    template = "%(function)s(EPOCH FROM %(expressions)s)"

class ProgramacionModelViewSet(ModelViewSet):
    queryset = Programacion.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerProgramacionSerializer
        return EscribirProgramacionSerializer

    @action(detail=False, methods=['get'], url_path='reporte-detallado')
    def reporte_detallado(self, request):
        # Obtener año y mes desde los parámetros
        year = request.query_params.get('year', datetime.today().year)
        month = request.query_params.get('month', datetime.today().month)

        # Filtrar por año y mes
        queryset = Programacion.objects.filter(
            fecha_programada__year=year,
            fecha_programada__month=month
        )

        # Convertir `duracion` de INTERVAL a minutos
        duracion_en_minutos = ExpressionWrapper(
            ExtractEpoch(F('duracion')) / 60, output_field=IntegerField()
        )

        # Generar las columnas dinámicas de días
        dias = range(1, 32)
        day_cases = {
            f"day_{day}": Sum(
                Case(
                    When(fecha_programada__day=day, then=duracion_en_minutos),
                    default=0,
                    output_field=IntegerField()
                )
            )
            for day in dias
        }

        # Agrupar por actividad y sumar minutos por día
        resultados = queryset.values(
            'fk_id_asignacionActividades__fk_id_actividad__nombre_actividad'
        ).annotate(
            **day_cases,
            total=Sum(duracion_en_minutos)
        ).order_by('-total')

        return Response(resultados)
