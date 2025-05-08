from django.contrib import admin
from apps.finanzas.nomina.models import Salario 

# Register your models here.

@admin.register(Salario)
class SalarioAdmin(admin.ModelAdmin):
    list_display = ('precio_jornal', 'horas_por_jornal','fecha_inicio','fecha_fin','activo')
