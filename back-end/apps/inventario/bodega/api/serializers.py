from rest_framework import serializers
from apps.inventario.bodega.models import Bodega
from apps.inventario.herramientas.api.serializers import HerramientasSerializer
from apps.inventario.insumo.api.serializers import InsumoSerializer
from apps.trazabilidad.asignacion_actividades.api.serializers import LeerAsignacion_actividadesSerializer
from django.db import transaction

class MovimientoHerramientaSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    cantidad = serializers.IntegerField(min_value=1)

class MovimientoInsumoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    cantidad = serializers.IntegerField(min_value=1)

class LeerBodegaSerializer(serializers.ModelSerializer):
    fk_id_herramientas = HerramientasSerializer()
    fk_id_insumo = InsumoSerializer()
    fk_id_asignacion = LeerAsignacion_actividadesSerializer()
    
    class Meta:
        model = Bodega
        fields = '__all__'

class EscribirBodegaSerializer(serializers.ModelSerializer):
    herramientas = MovimientoHerramientaSerializer(many=True, required=False)
    insumos = MovimientoInsumoSerializer(many=True, required=False)
    
    class Meta:
        model = Bodega
        fields = ['herramientas', 'insumos', 'fk_id_asignacion', 'fecha', 'movimiento']

    def validate(self, data):
        if not data.get('herramientas') and not data.get('insumos'):
            raise serializers.ValidationError("Debe proporcionar al menos una herramienta o un insumo")
        return data

    @transaction.atomic
    def create(self, validated_data):
        herramientas_data = validated_data.pop('herramientas', [])
        insumos_data = validated_data.pop('insumos', [])
        movimientos = []
        
        # Crear movimientos para herramientas
        for h in herramientas_data:
            movimiento = Bodega.objects.create(
                fk_id_herramientas_id=h['id'],
                cantidad_herramienta=h['cantidad'],
                **validated_data
            )
            movimientos.append(movimiento)
        
        # Crear movimientos para insumos
        for i in insumos_data:
            movimiento = Bodega.objects.create(
                fk_id_insumo_id=i['id'],
                cantidad_insumo=i['cantidad'],
                **validated_data
            )
            movimientos.append(movimiento)
            
        return movimientos[0] if movimientos else None