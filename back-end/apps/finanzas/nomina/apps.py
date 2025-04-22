from django.apps import AppConfig


class NominaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.finanzas.nomina'

    def ready(self):
        import apps.finanzas.nomina.signals