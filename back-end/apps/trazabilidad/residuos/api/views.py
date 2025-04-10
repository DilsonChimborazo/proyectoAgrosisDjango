from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from apps.trazabilidad.residuos.models import Residuos
from apps.trazabilidad.residuos.api.serializers import LeerResiduosSerializer, escribirResiduosSerializer

class ResiduosViewSet(ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]  # Corregí el nombre del atributo (era 'permissions_clases')
    queryset = Residuos.objects.select_related('fk_id_cultivo', 'fk_id_tipo_residuo').all()
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerResiduosSerializer
        return escribirResiduosSerializer

    @action(detail=False, methods=['get'], url_path='reporte-residuos')
    def reporte_residuos(self, request):
        """
        Reporte personalizado que muestra la fecha, el tipo de residuo y el cultivo relacionado.
        """
        reporte = []

        for residuo in self.get_queryset():
            cultivo_nombre = residuo.fk_id_cultivo.nombre_cultivo if residuo.fk_id_cultivo else "No especificado"
            tipo_residuo = residuo.fk_id_tipo_residuo.nombre_tipo_residuo if residuo.fk_id_tipo_residuo else "No especificado"
            fecha = residuo.fecha

            reporte.append({
                "fecha": fecha,
                "tipo_residuo": tipo_residuo,
                "cultivo": cultivo_nombre,
            })

        return Response({
            "reporte": reporte,
            "estructura": "FECHA | TIPO DE RESIDUO | CULTIVO"
        })