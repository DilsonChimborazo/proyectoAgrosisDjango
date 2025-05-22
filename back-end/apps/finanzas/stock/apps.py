from django.apps import AppConfig

class StockConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.finanzas.stock'

    def ready(self):
        import apps.finanzas.stock.signals 
