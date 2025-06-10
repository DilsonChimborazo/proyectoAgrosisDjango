from django.contrib import admin
from apps.finanzas.venta.models import Venta, ItemVenta

class ItemVentaInline(admin.TabularInline):
    model = ItemVenta
    extra = 1
    fields = ['produccion', 'cantidad', 'unidad_medida', 'cantidad_en_base', 
              'precio_unidad', 'descuento_porcentaje', 'precio_unidad_con_descuento', 'subtotal']
    readonly_fields = ['subtotal', 'cantidad_en_base', 'precio_unidad', 'precio_unidad_con_descuento']

    def subtotal(self, instance):
        return instance.subtotal()
    subtotal.short_description = 'Subtotal'

    def get_readonly_fields(self, request, obj=None):
        # Si el objeto ya existe, hacemos que descuento_porcentaje sea de solo lectura
        if obj:
            return self.readonly_fields + ('descuento_porcentaje',)
        return self.readonly_fields

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ['id', 'fecha', 'usuario', 'total', 'items_count']
    list_filter = ['fecha', 'usuario']
    search_fields = ['id', 'usuario__nombre', 'usuario__apellido', 'items__produccion__nombre_produccion']
    readonly_fields = ['total', 'usuario']
    inlines = [ItemVentaInline]
    autocomplete_fields = ['usuario']

    fieldsets = (
        ('Información de Venta', {
            'fields': ('fecha', 'usuario', 'total')
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
        if not obj.pk:  # Solo para nuevas ventas
            obj.usuario = request.user
        super().save_model(request, obj, form, change)
        obj.actualizar_total()

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(usuario=request.user)

    def has_change_permission(self, request, obj=None):
        if obj is not None and obj.usuario != request.user and not request.user.is_superuser:
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        if obj is not None and obj.usuario != request.user and not request.user.is_superuser:
            return False
        return super().has_delete_permission(request, obj)