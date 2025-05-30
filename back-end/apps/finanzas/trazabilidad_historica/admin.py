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
        total_actividades = datos.get('resumen', {}).get('total_actividades', 0)
        total_ventas = datos.get('resumen', {}).get('total_ventas', 0)
        return f"{datos.get('cultivo', '')} - Act: {total_actividades}, Ventas: {total_ventas}"
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
    list_display = ('id', 'plantacion_link', 'ultima_actualizacion', 'datos_resumen', 'precio_minimo_venta_acumulado', 'precio_minimo_venta_incremental')
    list_filter = ('plantacion', 'ultima_actualizacion')
    search_fields = ('plantacion__nombre', 'datos_actuales')
    readonly_fields = ('ultima_actualizacion', 'datos_formateados', 'precio_minimo_venta_acumulado', 'precio_minimo_venta_incremental')
    
    def plantacion_link(self, obj):
        return format_html('<a href="/admin/trazabilidad/plantacion/{}/change/">{}</a>',
                           obj.plantacion.id, obj.plantacion)
    plantacion_link.short_description = 'Plantación'
    plantacion_link.admin_order_field = 'plantacion'

    def datos_resumen(self, obj):
        datos = obj.datos_actuales
        balance = datos.get('resumen', {}).get('balance_acumulado', 0.0)
        return f"{datos.get('cultivo', '')} - Balance: ${balance:,.2f}"
    datos_resumen.short_description = 'Resumen Actual'

    def datos_formateados(self, obj):
        return format_html('<pre>{}</pre>', json.dumps(obj.datos_actuales, indent=2, ensure_ascii=False))
    datos_formateados.short_description = 'Datos Actuales (formateados)'

    def precio_minimo_venta_acumulado(self, obj):
        # Display the new field directly from the model instance (que es el acumulado guardado)
        if obj.precio_minimo_venta_por_unidad is not None:
            return f"${obj.precio_minimo_venta_por_unidad:,.4f}"
        return "N/A"
    precio_minimo_venta_acumulado.short_description = 'Precio Mínimo Acum./Unidad'
    precio_minimo_venta_acumulado.admin_order_field = 'precio_minimo_venta_por_unidad' # Sigue siendo el campo base

    def precio_minimo_venta_incremental(self, obj):
        # Acceder al campo incremental desde el JSONField 'datos_actuales'
        incremental_price = obj.datos_actuales.get('precio_minimo_incremental_ultima_cosecha')
        if incremental_price is not None:
            return f"${incremental_price:,.4f}"
        return "N/A"
    precio_minimo_venta_incremental.short_description = 'Precio Mínimo Increm./Unidad'


    fieldsets = (
        (None, {
            'fields': ('plantacion', 'ultima_actualizacion', 'precio_minimo_venta_acumulado', 'precio_minimo_venta_incremental')
        }),
        ('Datos Actuales', {
            'fields': ('datos_formateados',),
            'classes': ('collapse',)
        }),
    )

admin.site.register(SnapshotTrazabilidad, SnapshotTrazabilidadAdmin)
admin.site.register(ResumenTrazabilidad, ResumenTrazabilidadAdmin)