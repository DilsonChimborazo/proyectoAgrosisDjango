from rest_framework import serializers
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.trazabilidad.plantacion.api.serializers import LeerPlantacionSerializer
from apps.trazabilidad.pea.api.serializers import LeerPeaSerializer
from apps.inventario.insumo.api.serializers import InsumoSerializer
from apps.usuarios.usuario.api.serializer import LeerUsuarioSerializer
from apps.inventario.unidadMedida.api.serilizers import UnidadMedidaSerializer

class LeerControl_fitosanitarioSerializer(serializers.ModelSerializer):
    fk_id_plantacion = LeerPlantacionSerializer()
    fk_id_pea = LeerPeaSerializer()
    fk_id_insumo = InsumoSerializer()
    fk_identificacion = serializers.SerializerMethodField()
    fk_unidad_medida = UnidadMedidaSerializer()

    class Meta:
        model = Control_fitosanitario
        fields = '__all__'

    def get_fk_identificacion(self, obj):
        return [
            {
                'id': usuario.id,
                'nombre': usuario.nombre,
                'apellido': usuario.apellido,
                'identificacion': usuario.identificacion
            }
            for usuario in obj.fk_identificacion.all()
        ]

class escribirControl_fitosanitarioSerializer(serializers.ModelSerializer):
    fk_identificacion = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )

    class Meta:
        model = Control_fitosanitario
        fields = [
            'fecha_control', 'duracion', 'descripcion', 'tipo_control',
            'fk_id_plantacion', 'fk_id_pea', 'fk_id_insumo', 'cantidad_insumo',
            'fk_unidad_medida', 'fk_identificacion', 'img', 'costo_insumo',
            'cantidad_en_base'
        ]

    def validate_fk_identificacion(self, value):
        if len(value) < 1:
            raise serializers.ValidationError("Debes seleccionar al menos 1 usuarios.")
        return value

    def create(self, validated_data):
        fk_identificacion_ids = validated_data.pop('fk_identificacion')
        control = Control_fitosanitario(**validated_data)
        control.save()
        control.fk_identificacion.set(fk_identificacion_ids)
        return control