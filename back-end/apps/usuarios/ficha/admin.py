from django.contrib import admin
from apps.usuarios.ficha.models import Ficha

@admin.register(Ficha)
class FichaAdmin(admin.ModelAdmin):
    list_display = ('id', 'numero_ficha', 'nombre_ficha', 'fecha_inicio', 'fecha_salida', 'is_active')


