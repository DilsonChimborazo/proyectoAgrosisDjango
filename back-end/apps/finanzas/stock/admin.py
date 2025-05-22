from django.contrib import admin
from apps.finanzas.stock.models import Stock


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'movimiento',
        'cantidad',
        'fecha',
        'fk_id_produccion',
        'fk_id_item_venta',
    )
    list_filter = ('movimiento', 'fecha')
    search_fields = ('movimiento',)
    readonly_fields = ('fecha',)

    def has_add_permission(self, request):
        # Solo permitir agregar desde señales o scripts, no manualmente
        return False

    def has_change_permission(self, request, obj=None):
        # Prevenir cambios manuales
        return False
