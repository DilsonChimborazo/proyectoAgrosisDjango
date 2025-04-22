from django.contrib import admin
from apps.inventario.bodega.models import Bodega


@admin.register(Bodega)
class BodegaAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'fk_id_herramientas',
        'fk_id_insumo',
        'fk_id_asignacion',
        'fk_unidad_medida',
        'cantidad',
        'cantidad_en_base',
        'costo_insumo',  # 👉 Se añade aquí
        'movimiento',
        'fecha',
    )
    list_filter = ('movimiento', 'fecha', 'fk_id_insumo')
    search_fields = ('fk_id_herramientas__nombre', 'fk_id_insumo__nombre')
    ordering = ('-fecha',)
    date_hierarchy = 'fecha'
