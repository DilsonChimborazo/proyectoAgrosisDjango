from rest_framework.serializers import ModelSerializer
from apps.finanzas.nomina.models import Nomina
from apps.finanzas.salario.api.serializers import LeerSalarioSerializer  
from apps.trazabilidad.programacion.api.serializers import LeerProgramacionSerializer

class LeerNominaSerializer(ModelSerializer):
    fk_id_salario = LeerSalarioSerializer()
    fk_id_programacion = LeerProgramacionSerializer()

    class Meta:
        model = Nomina
        fields = '__all__'

class EscribirNominaSerializer(ModelSerializer):
    class Meta:
        model = Nomina
        fields = '__all__'
