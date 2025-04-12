from django.contrib import admin
from apps.inventario.unidadMedida.models import UnidadMedida

@admin.register(UnidadMedida)
class UnidadMedidaAdmin(admin.ModelAdmin):
    list_display = ('nombre_medida', 'abreviatura') 
