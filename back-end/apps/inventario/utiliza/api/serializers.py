from rest_framework.serializers import ModelSerializer
from apps.inventario.utiliza.models import Utiliza
from apps.inventario.insumo.api.serializers import InsumoSerializer
from apps.trazabilidad.asignacion_actividades.api.serializers import LeerAsignacion_actividadesSerializer


class LeerUtilizaSerializer (ModelSerializer):
    fk_id_insumo = InsumoSerializer
    fk_id_asignacion_actividades =  LeerAsignacion_actividadesSerializer
    class Meta :
        model = Utiliza 
        fields = '__all__'

class UtilizaSerializer(ModelSerializer):
    class Meta:
        model = Utiliza
        fields = '__all__'  

        