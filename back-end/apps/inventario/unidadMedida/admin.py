from django.contrib import admin
from apps.inventario.unidadMedida.models import UnidadMedida

@admin.register(UnidadMedida)
class UnidadMedidaAdmin(admin.ModelAdmin):
    list_display = ('nombre_medida', 'unidad_base', 'factor_conversion')
    list_filter = ('unidad_base',)
    search_fields = ('nombre_medida',)