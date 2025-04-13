from django.contrib import admin
from apps.inventario.bodega.models import Bodega

@admin.register(Bodega)
class BodegaAdmin(admin.ModelAdmin):
    list_display = ('fk_id_herramientas','fk_id_insumo','fk_id_asignacion','movimiento','fecha','cantidad') 
