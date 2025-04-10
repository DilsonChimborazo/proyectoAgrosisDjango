from django.contrib import admin
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario 

@admin.register(Control_fitosanitario)
class Control_fitosanitarioAdmin(admin.ModelAdmin):
    list_display = ('fecha_control', 'descripcion','tipo_control','fk_id_cultivo', 'fk_id_pea','fk_id_insumo','cantidad_insumo' ) 
