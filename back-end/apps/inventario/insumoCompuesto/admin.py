from django.contrib import admin
from .models import InsumoCompuesto

@admin.register(InsumoCompuesto)
class InsumoCompuestoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'mostrar_insumos')

    def mostrar_insumos(self, obj):
        return ", ".join([
            detalle.insumo.nombre
            for detalle in obj.detalleinsumocompuesto_set.all()
        ])
    mostrar_insumos.short_description = 'Insumos'
