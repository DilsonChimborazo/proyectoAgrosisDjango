from django.contrib import admin
from apps.trazabilidad.plantacion.models import Plantacion 

@admin.register(Plantacion)
class PlantacionAdmin(admin.ModelAdmin):

    list_display = ('fk_id_eras','fk_id_cultivo','cantidad_transplante', 'fecha_plantacion','fk_id_semillero','latitud','longitud')

