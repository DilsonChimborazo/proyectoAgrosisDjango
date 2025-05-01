from django.contrib import admin
from apps.trazabilidad.cultivo.models import Cultivo

@admin.register(Cultivo)
class CultivoAdmin(admin.ModelAdmin):
    list_display = ('nombre_cultivo', 'fecha_plantacion', 'etapa_actual', 'get_kc_actual', 'fk_id_especie', 'fk_id_semillero')
    fields = (
        'nombre_cultivo', 'fecha_plantacion', 'descripcion',
        'kc_inicial', 'kc_desarrollo', 'kc_final',
        'etapa_actual', 'fk_id_especie', 'fk_id_semillero'
    )
    list_filter = ('etapa_actual', 'fk_id_especie')
    search_fields = ('nombre_cultivo', 'descripcion')