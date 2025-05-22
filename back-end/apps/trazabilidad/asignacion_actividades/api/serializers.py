from rest_framework import serializers
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.usuarios.usuario.models import Usuarios
from apps.trazabilidad.realiza.models import Realiza
from apps.trazabilidad.actividad.models import Actividad
from apps.trazabilidad.plantacion.models import Plantacion
from apps.trazabilidad.cultivo.models import Cultivo

# Serializador para Actividad
class ActividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividad
        fields = ['id', 'nombre_actividad']

# Serializador para Cultivo
class CultivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cultivo
        fields = ['id', 'nombre_cultivo']

# Serializador para Plantacion
class PlantacionSerializer(serializers.ModelSerializer):
    fk_id_cultivo = CultivoSerializer(read_only=True)

    class Meta:
        model = Plantacion
        fields = ['id', 'fk_id_cultivo']

# Serializador para Realiza
class RealizaSerializer(serializers.ModelSerializer):
    fk_id_actividad = ActividadSerializer(read_only=True)
    fk_id_plantacion = PlantacionSerializer(read_only=True)

    class Meta:
        model = Realiza
        fields = ['id', 'fk_id_actividad', 'fk_id_plantacion']

# Serializador para Usuarios
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ['id', 'nombre', 'apellido']

# Serializador para leer asignaciones
class LeerAsignacion_actividadesSerializer(serializers.ModelSerializer):
    fk_identificacion = serializers.SerializerMethodField()
    fk_id_realiza = RealizaSerializer(read_only=True)  # Cambiado a serializador anidado

    class Meta:
        model = Asignacion_actividades
        fields = ['id', 'fecha_programada', 'fk_id_realiza', 'fk_identificacion', 'estado', 'observaciones']

    def get_fk_identificacion(self, obj):
        return [
            {'id': usuario.id, 'nombre': f"{usuario.nombre} {usuario.apellido}"}
            for usuario in obj.fk_identificacion.all()
        ]

# Serializador para escribir asignaciones
class EscribirAsignacion_actividadesSerializer(serializers.ModelSerializer):
    fk_identificacion = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )

    class Meta:
        model = Asignacion_actividades
        fields = ['id', 'fecha_programada', 'fk_id_realiza', 'fk_identificacion', 'estado', 'observaciones']

    def create(self, validated_data):
        fk_identificacion_ids = validated_data.pop('fk_identificacion')
        asignacion = Asignacion_actividades.objects.create(**validated_data)
        asignacion.fk_identificacion.set(fk_identificacion_ids)
        return asignacion