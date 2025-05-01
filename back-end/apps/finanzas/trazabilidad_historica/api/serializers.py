from rest_framework import serializers
from apps.finanzas.trazabilidad_historica.models import SnapshotTrazabilidad, ResumenTrazabilidad



class SnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = SnapshotTrazabilidad
        fields = ['id', 'fecha_registro', 'version', 'trigger', 'datos']
        read_only_fields = fields

class ResumenTrazabilidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumenTrazabilidad
        fields = ['ultima_actualizacion', 'datos_actuales']
        read_only_fields = fields