from django.contrib import admin
from apps.trazabilidad.notificacion.models import Notificacion 

@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'mensaje', 'creado']  # Campos que sí existen en el modelo
    list_filter = ['creado']  # Opcional: para filtrar por fecha
    search_fields = ['titulo', 'mensaje']  # Opcional: para buscar por título o mensaje