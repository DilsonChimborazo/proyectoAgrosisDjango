from django.contrib import admin
from .models import SnapshotTrazabilidad, ResumenTrazabilidad
from django.utils.html import format_html
import json

class SnapshotTrazabilidadAdmin(admin.ModelAdmin):
    list_display = ('id', 'plantacion_link', 'version', 'fecha_registro', 'trigger', 'datos_resumen')
    list_filter = ('plantacion', 'trigger', 'fecha_registro')
    search_fields = ('plantacion__nombre', 'datos')
    readonly_fields = ('fecha_registro', 'version', 'datos_formateados')
    ordering = ('-fecha_registro',)
    date_hierarchy = 'fecha_registro'

    def plantacion_link(self, obj):
        return format_html('<a href="/admin/trazabilidad/plantacion/{}/change/">{}</a>',
                          obj.plantacion.id, obj.plantacion)
    plantacion_link.short_description = 'Plantación'
    plantacion_link.admin_order_field = 'plantacion'

    def datos_resumen(self, obj):
        datos = obj.datos
        return f"{datos.get('cultivo', '')} - Act: {datos['resumen']['total_actividades']}, Ventas: {datos['resumen']['total_ventas']}"
    datos_resumen.short_description = 'Resumen'

    def datos_formateados(self, obj):
        return format_html('<pre>{}</pre>', json.dumps(obj.datos, indent=2, ensure_ascii=False))
    datos_formateados.short_description = 'Datos (formateados)'

    fieldsets = (
        (None, {
            'fields': ('plantacion', 'version', 'fecha_registro', 'trigger')
        }),
        ('Datos de Trazabilidad', {
            'fields': ('datos_formateados',),
            'classes': ('collapse',)
        }),
    )

class ResumenTrazabilidadAdmin(admin.ModelAdmin):
    list_display = ('id', 'plantacion_link', 'ultima_actualizacion', 'datos_resumen')
    list_filter = ('plantacion', 'ultima_actualizacion')
    search_fields = ('plantacion__nombre', 'datos_actuales')
    readonly_fields = ('ultima_actualizacion', 'datos_formateados')

    def plantacion_link(self, obj):
        return format_html('<a href="/admin/trazabilidad/plantacion/{}/change/">{}</a>',
                          obj.plantacion.id, obj.plantacion)
    plantacion_link.short_description = 'Plantación'
    plantacion_link.admin_order_field = 'plantacion'

    def datos_resumen(self, obj):
        datos = obj.datos_actuales
        return f"{datos.get('cultivo', '')} - Balance: ${datos['resumen']['balance']:,.2f}"
    datos_resumen.short_description = 'Resumen Actual'

    def datos_formateados(self, obj):
        return format_html('<pre>{}</pre>', json.dumps(obj.datos_actuales, indent=2, ensure_ascii=False))
    datos_formateados.short_description = 'Datos Actuales (formateados)'

    fieldsets = (
        (None, {
            'fields': ('plantacion', 'ultima_actualizacion')
        }),
        ('Datos Actuales', {
            'fields': ('datos_formateados',),
            'classes': ('collapse',)
        }),
    )

admin.site.register(SnapshotTrazabilidad, SnapshotTrazabilidadAdmin)
admin.site.register(ResumenTrazabilidad, ResumenTrazabilidadAdmin)