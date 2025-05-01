from django.contrib import admin
from apps.trazabilidad.cultivo.models import Cultivo

@admin.register(Cultivo)
class CultivoAdmin(admin.ModelAdmin):


    list_display = ('nombre_cultivo', 'etapa_actual', 'get_kc_actual', 'fk_id_especie')
    fields = (
        'nombre_cultivo', 'descripcion',
        'kc_inicial', 'kc_desarrollo', 'kc_final',
        'etapa_actual', 'fk_id_especie'
    )
    list_filter = ('etapa_actual', 'fk_id_especie')
    search_fields = ('nombre_cultivo', 'descripcion') 

