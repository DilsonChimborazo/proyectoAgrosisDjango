from rest_framework.serializers import ModelSerializer
from apps.finanzas.salario.models import Salario  

class LeerSalarioSerializer(ModelSerializer):
    class Meta:
        model = Salario
        fields = '__all__'

class EscribirSalarioSerializer(ModelSerializer):
    class Meta:
        model = Salario
        fields = '__all__'
