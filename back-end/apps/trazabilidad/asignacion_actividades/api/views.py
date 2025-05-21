from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.trazabilidad.asignacion_actividades.api.serializers import (
    LeerAsignacion_actividadesSerializer,
    EscribirAsignacion_actividadesSerializer
)

class Asignacion_actividadesModelViewSet(ModelViewSet):
    queryset = Asignacion_actividades.objects.select_related(
        'fk_id_realiza__fk_id_plantacion__fk_id_cultivo',
        # 'fk_identificacion' ya no es necesario aquí porque es ManyToMany
    ).prefetch_related('fk_identificacion').all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerAsignacion_actividadesSerializer
        return EscribirAsignacion_actividadesSerializer

    @action(detail=False, methods=['get'], url_path='reporte-asignaciones')
    def reporte_asignaciones(self, request):
        """
        Reporte personalizado que muestra la fecha programada, plantación, usuarios, actividad, estado y observaciones.
        """
        reporte = []

        for asignacion in self.get_queryset():
            plantacion = (
                asignacion.fk_id_realiza.fk_id_plantacion.fk_id_cultivo.nombre_cultivo
                if asignacion.fk_id_realiza and asignacion.fk_id_realiza.fk_id_plantacion and asignacion.fk_id_realiza.fk_id_plantacion.fk_id_cultivo
                else "No especificado"
            )
            # Manejo de múltiples usuarios
            usuarios = [
                f"{usuario.nombre} {usuario.apellido}"
                for usuario in asignacion.fk_identificacion.all()
            ] if asignacion.fk_identificacion.exists() else ["No especificado"]
            actividad = (
                asignacion.fk_id_realiza.fk_id_actividad.nombre_actividad
                if asignacion.fk_id_realiza and asignacion.fk_id_realiza.fk_id_actividad
                else "No especificado"
            )
            fecha_programada = asignacion.fecha_programada.strftime('%Y-%m-%d') if asignacion.fecha_programada else "No especificado"
            estado = asignacion.estado if asignacion.estado else "No especificado"
            observaciones = asignacion.observaciones if asignacion.observaciones else "No especificado"

            reporte.append({
                "fecha_programada": fecha_programada,
                "plantacion": plantacion,
                "usuarios": usuarios,  # Ahora es una lista de usuarios
                "actividad": actividad,
                "estado": estado,
                "observaciones": observaciones,
            })

        return Response({
            "reporte": reporte,
            "estructura": "FECHA PROGRAMADA | PLANTACIÓN | USUARIOS | ACTIVIDAD | ESTADO | OBSERVACIONES"
        })