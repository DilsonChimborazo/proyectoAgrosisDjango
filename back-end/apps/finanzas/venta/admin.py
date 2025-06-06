from django.contrib import admin
from apps.finanzas.venta.models import Venta, ItemVenta

class ItemVentaInline(admin.TabularInline):
    model = ItemVenta
    extra = 1
    fields = ['produccion', 'cantidad', 'unidad_medida', 'cantidad_en_base', 'precio_unidad', 'descuento_porcentaje', 'precio_unidad_con_descuento', 'subtotal']
    readonly_fields = ['subtotal', 'cantidad_en_base', 'precio_unidad', 'precio_unidad_con_descuento']

    def subtotal(self, instance):
        return instance.subtotal()
    subtotal.short_description = 'Subtotal'

    def get_readonly_fields(self, request, obj=None):
        # Si el objeto ya existe, hacemos que descuento_porcentaje sea de solo lectura para evitar modificaciones inconsistentes
        if obj:
            return self.readonly_fields + ('descuento_porcentaje',)
        return self.readonly_fields

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ['id', 'fecha', 'total', 'items_count']
    list_filter = ['fecha']
    search_fields = ['id', 'items__produccion__nombre_produccion']
    readonly_fields = ['total']
    inlines = [ItemVentaInline]

    fieldsets = (
        ('Información de Venta', {
            'fields': ('fecha', 'total')
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