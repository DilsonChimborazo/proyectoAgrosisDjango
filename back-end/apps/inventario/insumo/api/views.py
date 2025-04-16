from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.inventario.insumo.models import Insumo
from apps.inventario.insumo.api.serializers import InsumoSerializer
from apps.trazabilidad.actividad.models import Actividad
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario


class InsumoViewSet(ModelViewSet):
    queryset = Insumo.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = InsumoSerializer
    
    @action(detail=False, methods=['get'], url_path='reporte-egresos')
    def reporte_egresos(self, request):
        """
        Endpoint para generar reporte de egresos por insumos agrupados por actividad y control fitosanitario.
        """
        reporte = []
        total_general = 0

        # -------------------- EGRESOS POR ACTIVIDADES --------------------
        actividades = Actividad.objects.prefetch_related('asignaciones__utiliza_set__fk_id_insumo').all()

        for actividad in actividades:
            asignaciones = actividad.asignaciones.all()
            insumos_por_actividad = {}

            for asignacion in asignaciones:
                for uso in asignacion.utiliza_set.all():
                    insumo = uso.fk_id_insumo
                    if insumo.nombre not in insumos_por_actividad:
                        insumos_por_actividad[insumo.nombre] = {
                            "cantidad": 0,
                            "costo_total": 0
                        }
                    insumos_por_actividad[insumo.nombre]["cantidad"] += uso.cantidad
                    insumos_por_actividad[insumo.nombre]["costo_total"] += insumo.precio_unidad * uso.cantidad
                    
            costo_total_actividad = sum(i["costo_total"] for i in insumos_por_actividad.values())
            total_general += costo_total_actividad

            reporte.append({
                "tipo": "Actividad",
                "nombre": actividad.nombre_actividad,
                "insumos": ", ".join(insumos_por_actividad.keys()) if insumos_por_actividad else "-",
                "costos": " + ".join(str(i["costo_total"]) for i in insumos_por_actividad.values()) if insumos_por_actividad else "-",
                "total": costo_total_actividad
            })

        # -------------------- EGRESOS POR CONTROL FITOSANITARIO --------------------
        controles = Control_fitosanitario.objects.prefetch_related('controlusainsumo_set__fk_id_insumo').all()

        for control in controles:
            insumos_por_control = {}

            for uso in control.controlusainsumo_set.all():
                insumo = uso.fk_id_insumo
                if insumo.nombre not in insumos_por_control:
                    insumos_por_control[insumo.nombre] = {
                        "cantidad": 0,
                        "costo_total": 0
                    }
                insumos_por_control[insumo.nombre]["cantidad"] += uso.cantidad
                insumos_por_control[insumo.nombre]["costo_total"] += insumo.precio_unidad * uso.cantidad

            costo_total_control = sum(i["costo_total"] for i in insumos_por_control.values())
            total_general += costo_total_control

            reporte.append({
                "tipo": "Control Fitosanitario",
                "nombre": control.descripcion,  # Se usa la descripción en lugar de nombre_fitosanitario
                "insumos": ", ".join(insumos_por_control.keys()) if insumos_por_control else "-",
                "costos": " + ".join(str(i["costo_total"]) for i in insumos_por_control.values()) if insumos_por_control else "-",
                "total": costo_total_control
            })

        return Response({
            "reporte": reporte,
            "total_general": total_general,
            "estructura": "TIPO | NOMBRE | EGRESOS POR INSUMOS | TOTAL"
        })
