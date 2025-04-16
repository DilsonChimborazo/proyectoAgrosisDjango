from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.trazabilidad.control_fitosanitario.api.serializers import (
    LeerControl_fitosanitarioSerializer,
    escribirControl_fitosanitarioSerializer
)


class Control_fitosanitarioViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Control_fitosanitario.objects.select_related(
        'fk_id_cultivo', 'fk_id_pea'
    ).all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerControl_fitosanitarioSerializer
        return escribirControl_fitosanitarioSerializer

    @action(detail=False, methods=['get'], url_path='reporte-controles')
    def reporte_controles(self, request):
        """
        Reporte personalizado que muestra el cultivo tratado, el PEA relacionado y el tipo de control realizado.
        """
        reporte = []

        for control in self.get_queryset():
            cultivo_nombre = control.fk_id_cultivo.nombre_cultivo if control.fk_id_cultivo else "No especificado"
            pea_nombre = control.fk_id_pea.nombre_pea if control.fk_id_pea else "No especificado"
            tipo_control = control.tipo_control

            reporte.append({
                "cultivo": cultivo_nombre,
                "pea": pea_nombre,
                "tipo_control": tipo_control,
            })

        return Response({
            "reporte": reporte,
            "estructura": "CULTIVO | PEA | TIPO DE CONTROL"
        })
