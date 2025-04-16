from rest_framework.serializers import ModelSerializer
from apps.inventario.bodega.models import Bodega
from apps.inventario.herramientas.api.serializers import HerramientasSerializer
from apps.inventario.insumo.api.serializers import InsumoSerializer
from apps.trazabilidad.asignacion_actividades.api.serializers import LeerAsignacion_actividadesSerializer

class leerBodegaSerializer(ModelSerializer):
    fk_id_herramientas = HerramientasSerializer()
    fk_id_insumo = InsumoSerializer()
    fk_id_asignacion = LeerAsignacion_actividadesSerializer()
    class Meta:
        model = Bodega
        fields = '__all__'


class escribirBodegaSerializer(ModelSerializer):
    class Meta:
        model = Bodega
        fields = '__all__'

        

