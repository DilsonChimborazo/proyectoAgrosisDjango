from django.contrib import admin
from apps.inventario.insumo.models import Insumo 

@admin.register(Insumo)
class InsumoAdmin(admin.ModelAdmin):
    list_display = ('nombre','tipo','precio_unidad','cantidad','fk_unidad_medida','fecha_vencimiento','img') 
    
