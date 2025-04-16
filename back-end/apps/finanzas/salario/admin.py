from django.contrib import admin
from apps.finanzas.nomina.models import Salario 

# Register your models here.

@admin.register(Salario)
class SalarioAdmin(admin.ModelAdmin):
    list_display = ('jornal', 'precio_jornal')
