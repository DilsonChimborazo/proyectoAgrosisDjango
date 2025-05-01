from rest_framework import serializers
from apps.iot.eras.models import Eras
from apps.iot.lote.api.serializers import leerLoteSerializer

class leerErasSerializer(serializers.ModelSerializer):
    fk_id_lote = leerLoteSerializer()
    id = serializers.IntegerField()  # Asegurar que siempre se envíe el ID

    class Meta:
        model = Eras
        fields = ['id','nombre', 'fk_id_lote', 'descripcion', 'estado']  # Agregado 'estado'

class escribirErasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Eras
        fields = '__all__'