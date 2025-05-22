from django.contrib import admin
from apps.usuarios.ficha.models import Ficha

@admin.register(Ficha)
class FichaAdmin(admin.ModelAdmin):
    list_display = ('numero_ficha', 'nombre_ficha', 'abreviacion', 'fecha_inicio', 'fecha_salida', 'is_active')


