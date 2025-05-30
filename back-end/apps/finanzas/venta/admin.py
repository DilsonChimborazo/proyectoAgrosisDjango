from django.contrib import admin
from apps.finanzas.venta.models import Venta, ItemVenta

class ItemVentaInline(admin.TabularInline):
    model = ItemVenta
    extra = 1
    fields = ['produccion', 'cantidad', 'unidad_medida', 'cantidad_en_base', 'precio_unidad', 'subtotal'] # Mantenemos el orden
    readonly_fields = ['subtotal', 'cantidad_en_base', 'precio_unidad'] # <-- CAMBIO AQUI

    def subtotal(self, instance):
        return instance.subtotal()
    subtotal.short_description = 'Subtotal'

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ['id', 'fecha', 'total', 'descuento_porcentaje', 'items_count']
    list_filter = ['fecha']
    search_fields = ['id', 'items__produccion__nombre_produccion']
    readonly_fields = ['total'] 
    inlines = [ItemVentaInline]

    # Para permitir la edición de descuento_porcentaje en el formulario de Venta
    fieldsets = (
        (None, {
            'fields': ('descuento_porcentaje',)
        }),
        ('Información de Venta', {
            'fields': ('fecha', 'total',)
        }),
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return self.readonly_fields + ('fecha',)
        return self.readonly_fields

    def items_count(self, obj):
        return obj.items.count()
    items_count.short_description = 'Items'

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        obj.actualizar_total() 