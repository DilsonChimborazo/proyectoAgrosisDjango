from django.contrib import admin
from apps.usuarios.rol.models import Rol 

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('rol','fecha_creacion') 
