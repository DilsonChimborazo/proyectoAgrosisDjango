from django.contrib import admin
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades 

@admin.register(Asignacion_actividades)
class Asignacion_actividadesAdmin(admin.ModelAdmin):
    list_display = ('fecha_programada', 'observaciones','fk_id_realiza','fk_identificacion','estado') 
