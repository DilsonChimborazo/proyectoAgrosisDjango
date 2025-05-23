from rest_framework import serializers
from apps.iot.controlRiego.models import ControlRiego

class ControlRiegoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlRiego
        fields = ['id', 'fk_id_plantacion', 'estado', 'etc', 'fecha']