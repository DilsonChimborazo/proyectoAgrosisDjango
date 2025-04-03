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


from rest_framework import serializers

class ReporteTiemposSerializer(serializers.Serializer):
    actividad = serializers.CharField(source='fk_id_asignacion_actividad__fk_id_actividad__nombre_actividad')
    tiempo_total_minutos = serializers.IntegerField(source='tiempo_total')  # No necesita conversión
    veces_realizada = serializers.IntegerField()
    
    # Campos dinámicos para cada día del mes (day_1, day_2, ..., day_31)
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for day in range(1, 32):
            self.fields[f'day_{day}'] = serializers.IntegerField(default=0)
