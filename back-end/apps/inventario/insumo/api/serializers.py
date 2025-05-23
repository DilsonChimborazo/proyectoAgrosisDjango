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

