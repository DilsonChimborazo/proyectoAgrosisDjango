from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.inventario.insumo.models import Insumo
from apps.trazabilidad.actividad.models import Actividad
from apps.inventario.utiliza.models import Utiliza
from django.db.models import Sum, F

class InsumoSerializer(ModelSerializer):
    class Meta:
        model = Insumo
        fields = '__all__'


class ReporteEgresosSerializer(ModelSerializer):
    actividad = serializers.CharField(source='nombre_actividad')
    insumos = serializers.SerializerMethodField()
    costo_total = serializers.SerializerMethodField()

    class Meta:
        model = Actividad
        fields = ['actividad', 'insumos', 'costo_total']

    def get_insumos(self, obj):
        """
        Obtiene la lista de insumos utilizados en la actividad.
        Retorna:
        - Un diccionario con lista_insumos (nombres, cantidad y unidad) y lista_costos (precio unitario de cada insumo).
        """
        utilizaciones = Utiliza.objects.filter(
            fk_id_asignacion_actividad__fk_id_actividad=obj
        ).select_related('fk_id_insumo')

        insumos_data = []
        for utilizacion in utilizaciones:
            insumo = utilizacion.fk_id_insumo
            insumos_data.append({
                'nombre': insumo.nombre,
                'cantidad': utilizacion.cantidad,
                'unidad_medida': insumo.unidad_medida,
                'precio_unitario': float(insumo.precio_unidad)
            })

        # Formateo de datos para el reporte
        insumos_lista = ", ".join(
            [f"{i['nombre']} {i['cantidad']} {i['unidad_medida']}"
             for i in insumos_data]
        ) if insumos_data else "-"

        costos_lista = " + ".join(
            [str(i['precio_unitario']) for i in insumos_data]
        ) if insumos_data else "-"

        return {
            'lista_insumos': insumos_lista,
            'lista_costos': costos_lista
        }

    def get_costo_total(self, obj):
        """
        Calcula el costo total de los insumos utilizados en la actividad.
        """
        total = Utiliza.objects.filter(
            fk_id_asignacion_actividad__fk_id_actividad=obj
        ).annotate(
            costo=F('cantidad') * F('fk_id_insumo__precio_unidad')
        ).aggregate(total=Sum('costo'))['total'] or 0

        return float(total)  # Convertimos a float para evitar problemas con JSON
