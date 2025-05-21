from django.contrib import admin
from apps.finanzas.venta.models import Venta, ItemVenta

class ItemVentaInline(admin.TabularInline):
    model = ItemVenta
    extra = 1
    fields = ['produccion', 'precio_unidad', 'cantidad', 'unidad_medida', 'cantidad_en_base', 'subtotal']
    readonly_fields = ['subtotal', 'cantidad_en_base']
    
    def subtotal(self, instance):
        return instance.subtotal()
    subtotal.short_description = 'Subtotal'

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ['id', 'fecha', 'total', 'items_count']
    list_filter = ['fecha']  # Formato corregido
    search_fields = ['id', 'items__produccion__nombre_produccion']
    readonly_fields = ['total']  # Formato corregido
    inlines = [ItemVentaInline]
    
    def items_count(self, obj):
        return obj.items.count()
    items_count.short_description = 'Items'