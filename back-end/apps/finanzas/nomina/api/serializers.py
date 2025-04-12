from rest_framework.serializers import ModelSerializer
from apps.finanzas.nomina.models import Nomina
from apps.finanzas.salario.models import Salario
from apps.finanzas.nomina.api.serializers import LeerSalarioSerializer  

class LeerNominaSerializer(ModelSerializer):
    fk_id_salario = LeerSalarioSerializer()

    class Meta:
        model = Nomina
        fields = '__all__'

class EscribirNominaSerializer(ModelSerializer):
    class Meta:
        model = Nomina
        fields = '__all__'
