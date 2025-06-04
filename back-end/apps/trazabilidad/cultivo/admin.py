from django.contrib import admin
from .models import Cultivo
from apps.trazabilidad.plantacion.models import Plantacion
from datetime import date
from decimal import Decimal

kc_values = {
    'Hortalizas': {'inicial': Decimal('0.50'), 'desarrollo': Decimal('1.00'), 'final': Decimal('0.80')},
    'Cereales': {'inicial': Decimal('0.35'), 'desarrollo': Decimal('1.15'), 'final': Decimal('0.45')},
    'Leguminosas': {'inicial': Decimal('0.40'), 'desarrollo': Decimal('1.10'), 'final': Decimal('0.50')},
    'Árboles Frutales': {'inicial': Decimal('0.60'), 'desarrollo': Decimal('0.90'), 'final': Decimal('0.75')},
    'Tubérculos': {'inicial': Decimal('0.45'), 'desarrollo': Decimal('1.05'), 'final': Decimal('0.70')},
    'Cultivos Forrajeros': {'inicial': Decimal('0.40'), 'desarrollo': Decimal('1.20'), 'final': Decimal('0.85')}
}

etapas_dias = {
    'Hortalizas': {
        'inicial': (0, 20),
        'desarrollo': (20, 60),
        'final': (60, 120)
    },
    'Cereales': {
        'inicial': (0, 20),
        'desarrollo': (20, 65),
        'final': (65, 130)
    },
    'Leguminosas': {
        'inicial': (0, 15),
        'desarrollo': (15, 55),
        'final': (55, 100)
    },
    'Árboles Frutales': {
        'inicial': (0, 60),
        'desarrollo': (60, 240),
        'final': (240, 360)
    },
    'Tubérculos': {
        'inicial': (0, 25),
        'desarrollo': (25, 75),
        'final': (75, 140)
    },
    'Cultivos Forrajeros': {
        'inicial': (0, 20),
        'desarrollo': (20, 60),
        'final': (60, 100)
    }
}

@admin.register(Cultivo)
class CultivoAdmin(admin.ModelAdmin):
    list_display = ['id', 'nombre_cultivo', 'etapa_actual_display', 'kc_actual_display']
    list_filter = ['nombre_cultivo']

    def etapa_actual_display(self, obj):
        try:
            plantacion = Plantacion.objects.filter(fk_id_cultivo=obj).first()
            if not plantacion:
                return 'Sin plantaciones'
            dias_desde_plantacion = (date.today() - plantacion.fecha_plantacion).days
            tipo_cultivo = obj.nombre_cultivo
            etapas = etapas_dias.get(tipo_cultivo, {})
            if not etapas:
                return 'Cultivo no soportado'
            if dias_desde_plantacion < etapas['inicial'][1]:
                return 'Inicial'
            elif dias_desde_plantacion < etapas['desarrollo'][1]:
                return 'Desarrollo'
            else:
                return 'Final'
        except Exception as e:
            return f'Error: {str(e)}'
    etapa_actual_display.short_description = 'Etapa Actual'

    def kc_actual_display(self, obj):
        try:
            plantacion = Plantacion.objects.filter(fk_id_cultivo=obj).first()
            if not plantacion:
                return 'N/A'
            dias_desde_plantacion = (date.today() - plantacion.fecha_plantacion).days
            tipo_cultivo = obj.nombre_cultivo
            etapas = etapas_dias.get(tipo_cultivo, {})
            if not etapas:
                return 'N/A'
            if dias_desde_plantacion < etapas['inicial'][1]:
                etapa = 'inicial'
            elif dias_desde_plantacion < etapas['desarrollo'][1]:
                etapa = 'desarrollo'
            else:
                etapa = 'final'
            return kc_values.get(tipo_cultivo, {}).get(etapa, 'N/A')
        except Exception as e:
            return f'Error: {str(e)}'
    kc_actual_display.short_description = 'Kc Actual'