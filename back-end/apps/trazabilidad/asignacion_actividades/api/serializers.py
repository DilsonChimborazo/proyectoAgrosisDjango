# apps/trazabilidad/asignacion_actividades/api/serializers.py
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

from rest_framework import serializers

class AsignarRecursosSerializer(serializers.Serializer):
    herramientas_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
        default=[],
        help_text="Lista de IDs de herramientas a asignar"
    )
    insumos_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        required=False,
        default=[],
        help_text="Lista de IDs de insumos a asignar"
    )

    def validate_herramientas_ids(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Debe ser una lista de IDs")
        return value

    def validate_insumos_ids(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Debe ser una lista de IDs")
        return value

# Serializador para leer asignaciones
class LeerAsignacion_actividadesSerializer(serializers.ModelSerializer):
    fk_identificacion = serializers.SerializerMethodField()
    fk_id_realiza = RealizaSerializer(read_only=True)
    recursos_asignados = serializers.JSONField(read_only=True)

    class Meta:
        model = Asignacion_actividades
        fields = ['id', 'fecha_programada', 'fk_id_realiza', 'fk_identificacion', 
                 'estado', 'observaciones', 'recursos_asignados']

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

    def validate_fk_identificacion(self, value):
        # Validar que los usuarios asignados todos
        for user_id in value:
            try:
                usuario = Usuarios.objects.get(id=user_id)
                if usuario.fk_id_rol.rol not in ['Pasante', 'Aprendiz', "Operario", "Administrador","Instructor"]:
                    raise serializers.ValidationError(
                        f"El usuario {usuario.nombre} {usuario.apellido} no es un Pasante o Aprendiz."
                    )
            except Usuarios.DoesNotExist:
                raise serializers.ValidationError(f"El usuario con ID {user_id} no existe.")
        return value

    def create(self, validated_data):
        fk_identificacion_ids = validated_data.pop('fk_identificacion')
        asignacion = Asignacion_actividades.objects.create(**validated_data)
        asignacion.fk_identificacion.set(fk_identificacion_ids)
        return asignacion