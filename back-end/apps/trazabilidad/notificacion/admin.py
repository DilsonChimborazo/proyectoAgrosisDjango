# apps/trazabilidad/notificacion/admin.py
from django.contrib import admin
from .models import Notificacion

@admin.register(Notificacion)
class NotificacionAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'mensaje', 'fecha_notificacion', 'leida']
    list_filter = ['leida']
    search_fields = ['titulo', 'mensaje']