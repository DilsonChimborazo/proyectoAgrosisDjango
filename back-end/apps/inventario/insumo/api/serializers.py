from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from apps.inventario.insumo.models import Insumo
from apps.inventario.unidadMedida.api.serilizers import UnidadMedidaSerializer
from apps.trazabilidad.actividad.models import Actividad
from django.db.models import Sum, F

class InsumoSerializer(ModelSerializer):
    fk_unidad_medida = UnidadMedidaSerializer(read_only=True)
    class Meta:
        model = Insumo
        fields = '__all__'

class InsumoCreateSerializer(ModelSerializer):
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
        total = Utiliza.objects.filter(
            fk_id_asignacion_actividad__fk_id_actividad=obj
        ).annotate(
            costo=F('cantidad') * F('fk_id_insumo__precio_unidad')
        ).aggregate(total=Sum('costo'))['total'] or 0

        return float(total)