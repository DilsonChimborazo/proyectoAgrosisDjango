from django.contrib import admin
from apps.finanzas.produccion.models import Produccion 

@admin.register(Produccion)
class ProduccionAdmin(admin.ModelAdmin):
    list_display = (
        'nombre_produccion',
        'cantidad_producida',
        'cantidad_en_base',
        'stock_disponible',
        'precio_sugerido_venta', 
        'fecha',
        'fk_id_plantacion',
        'fk_unidad_medida'
    )
    readonly_fields = ('cantidad_en_base', 'stock_disponible',)