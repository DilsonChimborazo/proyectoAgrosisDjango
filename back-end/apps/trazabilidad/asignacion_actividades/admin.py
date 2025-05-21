from django.contrib import admin
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from django import forms

class Asignacion_actividadesAdminForm(forms.ModelForm):
    class Meta:
        model = Asignacion_actividades
        fields = '__all__'
        widgets = {
            'fk_identificacion': forms.SelectMultiple,  # Soporte para seleccionar múltiples usuarios
        }

@admin.register(Asignacion_actividades)
class Asignacion_actividadesAdmin(admin.ModelAdmin):
    form = Asignacion_actividadesAdminForm
    list_display = ('fk_id_realiza', 'estado', 'fecha_programada', 'mostrar_usuarios')

    def mostrar_usuarios(self, obj):
        """
        Método personalizado para mostrar los nombres de los usuarios asignados.
        """
        usuarios = obj.fk_identificacion.all()
        return ", ".join([f"{usuario.nombre} {usuario.apellido}" for usuario in usuarios]) or "No asignado"

    mostrar_usuarios.short_description = "Usuarios Asignados"