from django.contrib import admin
from apps.trazabilidad.cultivo.models import Cultivo 

@admin.register(Cultivo)
class CultivoAdmin(admin.ModelAdmin):

    list_display = (
        'nombre_cultivo', 
        'fecha_plantacion_formateada', 
        'descripcion_corta',
        'semillero_info'
    )
    list_filter = ('fk_nombre_cultivo', 'fk_id_semillero')
    search_fields = ('descripcion', 'fk_nombre_cultivo__nombre_cultivo')
    date_hierarchy = 'fecha_plantacion'
    
    def nombre_cultivo(self, obj):
        return obj.fk_nombre_cultivo.nombre_cultivo if obj.fk_nombre_cultivo else 'Sin nombre'
    nombre_cultivo.short_description = 'Nombre del Cultivo'
    
    def fecha_plantacion_formateada(self, obj):
        return obj.fecha_plantacion.strftime('%d/%m/%Y') if obj.fecha_plantacion else ''
    fecha_plantacion_formateada.short_description = 'Fecha Plantación'
    fecha_plantacion_formateada.admin_order_field = 'fecha_plantacion'
    
    def descripcion_corta(self, obj):
        return f"{obj.descripcion[:50]}..." if len(obj.descripcion) > 50 else obj.descripcion
    descripcion_corta.short_description = 'Descripción'
    
    def semillero_info(self, obj):
        return str(obj.fk_id_semillero) if obj.fk_id_semillero else 'Sin semillero'
    semillero_info.short_description = 'Semillero'

