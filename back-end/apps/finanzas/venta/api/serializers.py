from rest_framework.serializers import ModelSerializer
from apps.finanzas.venta.models import Venta 
from rest_framework import serializers
from apps.finanzas.produccion.api.serializers import ProduccionSerializer

class leerVentaSerializer(ModelSerializer):
    fk_id_produccion = ProduccionSerializer()
    class Meta:
        model = Venta
        fields = '__all__'

class escribirVentaSerializer(ModelSerializer):
    class Meta:
        model = Venta
        fields = '__all__'

class ReporteVentasSerializer(serializers.Serializer):
    producto = serializers.CharField()
    ventas = serializers.SerializerMethodField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2)

    def get_ventas(self, obj):
        # Formatear la descripción de ventas
        descripcion = []
        for v in obj['ventas']:
            cantidad = int(v['cantidad'])
            if cantidad == 1:
                descripcion.append("1 unidad")
            else:
                descripcion.append(f"{cantidad} unidades")
        
        # Formatear los ingresos individuales (asegurarse que son enteros)
        ingresos = []
        for v in obj['ventas']:
            if v['total_venta'] > 0:
                ingresos.append(str(int(round(v['total_venta']))))
        
        return {
            'descripcion': ", ".join(descripcion) if descripcion else "-",
            'ingresos': "+".join(ingresos) if ingresos else "-"
        }


class ReporteRentabilidadSerializer(serializers.Serializer):
    parametros = serializers.DictField(child=serializers.FloatField())
    calculos = serializers.DictField(child=serializers.FloatField())
    interpretacion = serializers.DictField(child=serializers.CharField())