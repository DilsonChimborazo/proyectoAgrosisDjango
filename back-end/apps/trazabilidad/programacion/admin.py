from django.contrib import admin
from apps.trazabilidad.programacion.models import Programacion 

@admin.register(Programacion)
class ProgramacionAdmin(admin.ModelAdmin):
    list_display = ('estado', 'fecha_realizada', 'duracion','fk_id_asignacionActividades','cantidad_insumo','img','fk_unidad_medida') 
