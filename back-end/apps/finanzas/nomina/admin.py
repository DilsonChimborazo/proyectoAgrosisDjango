from django.contrib import admin
from apps.finanzas.nomina.models import Nomina

# Register your models here.

@admin.register(Nomina)
class NominaAdmin(admin.ModelAdmin):
    list_display = ('fk_id_programacion', 'fk_id_salario', 'pago_total','fecha_pago', 'pagado')
