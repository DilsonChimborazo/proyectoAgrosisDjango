from rest_framework.serializers import ModelSerializer
from apps.inventario.insumo.models import Insumo
from apps.trazabilidad.actividad.models import Actividad
from apps.inventario.utiliza.models import Utiliza
from rest_framework import serializers

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
        # Obtener todas las utilizaciones de insumos para esta actividad
        utilizaciones = []
        for asignacion in obj.asignacion_actividades_set.all():
            utilizaciones.extend(asignacion.utiliza_set.all())
        
        insumos_data = []
        for utilizacion in utilizaciones:
            insumo = utilizacion.fk_id_insumo
            insumos_data.append({
                'nombre': insumo.nombre,
                'cantidad': utilizacion.cantidad,
                'unidad_medida': insumo.unidad_medida,
                'precio_unitario': float(insumo.precio_unidad)
            })
        
        # Formatear como en el ejemplo
        insumos_lista = ", ".join(
            [f"{i['nombre']} {i['cantidad']} {i['unidad_medida']}" 
             for i in insumos_data]
        )
        costos_lista = "+".join(
            [str(i['precio_unitario']) for i in insumos_data]
        )
        
        return {
            'lista_insumos': insumos_lista if insumos_lista else "-",
            'lista_costos': costos_lista if costos_lista else "-"
        }

    def get_costo_total(self, obj):
        # Calcular el costo total para esta actividad
        total = 0
        for asignacion in obj.asignacion_actividades_set.all():
            for utilizacion in asignacion.utiliza_set.all():
                total += utilizacion.cantidad * float(utilizacion.fk_id_insumo.precio_unidad)
        return total