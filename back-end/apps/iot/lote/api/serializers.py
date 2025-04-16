from rest_framework.serializers import ModelSerializer
from apps.iot.lote.models import Lote


class leerLoteSerializer(ModelSerializer):
    class Meta:
        model = Lote
        fields = '__all__'


class escribirLoteSerializer(ModelSerializer):
    class Meta:
        model = Lote
        fields = '__all__'

        

