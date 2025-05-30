from django.contrib import admin
from apps.finanzas.salario.models import Salario 

@admin.register(Salario)
class SalarioAdmin(admin.ModelAdmin):
    list_display = ('fk_id_rol', 'precio_jornal', 'horas_por_jornal', 'fecha_inicio', 'fecha_fin', 'activo')
    list_filter = ('fk_id_rol', 'activo', 'fecha_inicio')
    search_fields = ('fk_id_rol__rol', 'precio_jornal')
    list_editable = ('precio_jornal', 'horas_por_jornal', 'activo')
    date_hierarchy = 'fecha_inicio'
    ordering = ('-fecha_inicio',)

    # Personalizar el formulario para mostrar el campo fk_id_rol de forma más amigable
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'fk_id_rol':
            kwargs['queryset'] = db_field.related_model.objects.all().order_by('rol')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    # Mostrar el nombre del rol en la lista
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('fk_id_rol')