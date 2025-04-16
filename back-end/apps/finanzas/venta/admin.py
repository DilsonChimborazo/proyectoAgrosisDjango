from django.contrib import admin
from apps.finanzas.venta.models import Venta 

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = ('fk_id_produccion','precio_unidad','cantidad','fecha', 'fk_unidad_medida') 
    
