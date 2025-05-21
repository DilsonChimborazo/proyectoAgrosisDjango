# stock/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from apps.finanzas.stock.models import Stock
from apps.finanzas.stock.api.serializers import LeerStockSerializer, EscribirStockSerializer

class StockViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Stock.objects.select_related(
        'fk_id_produccion',
        'fk_id_venta'
    ).all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerStockSerializer
        return EscribirStockSerializer