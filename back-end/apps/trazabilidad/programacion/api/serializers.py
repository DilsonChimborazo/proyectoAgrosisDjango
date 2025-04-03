from rest_framework.serializers import ModelSerializer
from apps.trazabilidad.programacion.models import Programacion
from apps.trazabilidad.asignacion_actividades.api.serializers import LeerAsignacion_actividadesSerializer
from apps.trazabilidad.calendario_lunar.api.serializers import LeerCalendario_lunarSerializer
from rest_framework import serializers
from django.utils.dateparse import parse_duration

class LeerProgramacionSerializer(ModelSerializer):
    fk_id_asignacionActividades = LeerAsignacion_actividadesSerializer()
    fk_id_calendario = LeerCalendario_lunarSerializer()

    class Meta:
        model = Programacion
        fields = '__all__'

class EscribirProgramacionSerializer(ModelSerializer):
    class Meta:
        model = Programacion
        fields = '__all__'


class ReporteTiemposSerializer(serializers.Serializer):
    actividad = serializers.CharField(source='fk_id_asignacionActividades__fk_id_actividad__nombre_actividad')
    tiempo_total_minutos = serializers.SerializerMethodField()
    veces_realizada = serializers.IntegerField()
    
    def get_tiempo_total_minutos(self, obj):
        # Convertir DurationField a minutos
        return obj['tiempo_total'].total_seconds() / 60