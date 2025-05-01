from django.apps import AppConfig


class TrazabilidadHistoricaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.finanzas.trazabilidad_historica'

    def ready(self):
        import apps.finanzas.trazabilidad_historica.signals