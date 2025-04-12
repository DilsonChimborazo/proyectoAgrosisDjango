from rest_framework.serializers import ModelSerializer
from apps.finanzas.nomina.models import Salario  # Ajusta el import según tu estructura

class LeerSalarioSerializer(ModelSerializer):
    class Meta:
        model = Salario
        fields = '__all__'

class EscribirSalarioSerializer(ModelSerializer):
    class Meta:
        model = Salario
        fields = '__all__'
