from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from apps.usuarios.usuario.models import Usuarios

@admin.register(Usuarios)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('password',)}),  # Eliminé 'username'
        ('Información personal', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'nombre', 'apellido', 'password1', 'password2'),
        }),
    )

    list_display = ('email', 'nombre', 'apellido', 'is_staff')
    search_fields = ('email', 'nombre', 'apellido')
    ordering = ('identificacion',)  # Se mantiene identificacion en lugar de username
