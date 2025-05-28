from rest_framework.serializers import ModelSerializer
from apps.finanzas.nomina.models import Nomina
from apps.finanzas.salario.api.serializers import LeerSalarioSerializer  
from apps.trazabilidad.programacion.api.serializers import LeerProgramacionSerializer
from apps.trazabilidad.control_fitosanitario.api.serializers import LeerControl_fitosanitarioSerializer

class LeerNominaSerializer(ModelSerializer):
    fk_id_salario = LeerSalarioSerializer()
    fk_id_programacion = LeerProgramacionSerializer()
    fk_id_control_fitosanitario = LeerControl_fitosanitarioSerializer()
    

    class Meta:
        model = Nomina
        fields = '__all__'

class EscribirNominaSerializer(ModelSerializer):
    class Meta:
        model = Nomina
        fields = '__all__'
