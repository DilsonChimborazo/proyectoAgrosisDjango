from rest_framework import serializers
from ..models import Notificacion

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = ['id', 'usuario', 'titulo', 'mensaje', 'fecha_notificacion', 'leida']
        read_only_fields = ['fecha_notificacion', 'usuario']