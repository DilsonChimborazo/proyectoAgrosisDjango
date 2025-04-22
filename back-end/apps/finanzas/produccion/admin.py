from django.contrib import admin
from apps.finanzas.produccion.models import Produccion 

@admin.register(Produccion)
class ProduccionAdmin(admin.ModelAdmin):
    list_display = ('nombre_produccion','cantidad_producida','cantidad_en_base','fecha','fk_id_cultivo','fk_unidad_medida') 
    
