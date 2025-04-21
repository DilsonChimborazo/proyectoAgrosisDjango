from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from apps.finanzas.stock.models import Stock
from apps.finanzas.stock.api.serializers import (
    LeerStockSerializer,
    EscribirStockSerializer
)

class StockViewSet(ModelViewSet):
    #permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Stock.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerStockSerializer
        return EscribirStockSerializer
