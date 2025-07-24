from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from apps.trazabilidad.residuos.models import Residuos
from apps.trazabilidad.residuos.api.serializers import LeerResiduosSerializer, escribirResiduosSerializer

class ResiduosViewSet(ModelViewSet):
    queryset = Residuos.objects.select_related('fk_id_cultivo', 'fk_id_tipo_residuo').all()
    permissions_clases = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerResiduosSerializer
        return escribirResiduosSerializer

    @action(detail=False, methods=['get'], url_path='reporte-residuos')
    def reporte_residuos(self, request):
        """
        Reporte personalizado que muestra la fecha, el cultivo relacionado y el nombre del residuo.
        """
        reporte = []

        for residuo in self.get_queryset():
            cultivo_nombre = residuo.fk_id_cultivo.nombre_cultivo if residuo.fk_id_cultivo else "No especificado"
            nombre_residuo = residuo.nombre if residuo.nombre else "No especificado"
            fecha = residuo.fecha.strftime('%Y-%m-%d') if residuo.fecha else "No especificado"

            reporte.append({
                "fecha": fecha,
                "cultivo": cultivo_nombre,
                "residuo": nombre_residuo,
            })

        return Response({
            "reporte": reporte,
            "estructura": "FECHA | CULTIVO | RESIDUO"
        })