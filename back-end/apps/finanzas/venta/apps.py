from django.apps import AppConfig


class VentaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.finanzas.venta'

    def ready(self):
        import apps.finanzas.venta.signals 
