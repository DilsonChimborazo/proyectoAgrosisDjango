from django.contrib import admin
from apps.trazabilidad.nombre_cultivo.models import Nombre_cultivo 

# Register your models here.


@admin.register(Nombre_cultivo)
class NombreCultivoAdmin(admin.ModelAdmin):
    list_display = ('nombre_cultivo', 'fk_id_especie', 'especie_nombre')
    list_filter = ('fk_id_especie',)
    search_fields = ('nombre_cultivo',)
    
    def especie_nombre(self, obj):
        return obj.fk_id_especie.nombre if obj.fk_id_especie else 'Sin especie'
    especie_nombre.short_description = 'Nombre de Especie'