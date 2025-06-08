from rest_framework import serializers
from apps.trazabilidad.programacion.models import Programacion
from apps.trazabilidad.asignacion_actividades.api.serializers import LeerAsignacion_actividadesSerializer
from apps.inventario.unidadMedida.models import UnidadMedida
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
import logging

logger = logging.getLogger(__name__)

class LeerProgramacionSerializer(serializers.ModelSerializer):
    fk_id_asignacionActividades = LeerAsignacion_actividadesSerializer()

    class Meta:
        model = Programacion
        fields = '__all__'

class EscribirProgramacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programacion
        fields = [
            'id', 'estado', 'fecha_realizada', 'duracion', 'fk_id_asignacionActividades',
            'cantidad_insumo', 'img', 'fk_unidad_medida', 'bodega_devolucion_id_bodget'
        ]

    def validate_fk_id_asignacionActividades(self, value):
        # Validar que el valor sea un ID numérico o una instancia válida
        if isinstance(value, Asignacion_actividades):
            return value
        try:
            return Asignacion_actividades.objects.get(id=int(value))
        except (ValueError, TypeError, Asignacion_actividades.DoesNotExist):
            logger.error(f"Asignación inválida: {value}")
            raise serializers.ValidationError("Asignación inválida")

    def validate_fk_unidad_medida(self, value):
        # Validar que fk_unidad_medida sea None o una instancia válida
        if value is None:
            return value
        if isinstance(value, UnidadMedida):
            return value
        try:
            return UnidadMedida.objects.get(id=int(value))
        except (ValueError, TypeError, UnidadMedida.DoesNotExist):
            logger.error(f"Unidad de medida inválida: {value}")
            raise serializers.ValidationError("Unidad de medida inválida")

    def validate(self, data):
        # Validar que los datos sean correctos
        data = data.copy()  # Crear una copia mutable de los datos
        if data.get('estado') == 'Completada' and not data.get('fk_id_asignacionActividades'):
            logger.error("Se requiere una asignación para completar la programación")
            raise serializers.ValidationError("Se requiere una asignación para completar la programación")
        # Asegurar que img sea None si no se proporciona
        if 'img' not in data or data['img'] is None:
            data['img'] = None
        return data

    def create(self, validated_data):
        try:
            instance = Programacion.objects.create(**validated_data)
            logger.info(f"Programación creada con ID {instance.id}")
            return instance
        except Exception as e:
            logger.error(f"Error al crear Programación: {str(e)}")
            raise serializers.ValidationError(f"No se pudo crear la programación: {str(e)}")

class ReporteTiemposSerializer(serializers.Serializer):
    actividad = serializers.CharField(source='fk_id_asignacion_actividad__fk_id_actividad__nombre_actividad')
    tiempo_total_minutos = serializers.IntegerField(source='tiempo_total')
    veces_realizada = serializers.IntegerField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for day in range(1, 32):
            self.fields[f'day_{day}'] = serializers.IntegerField(default=0)