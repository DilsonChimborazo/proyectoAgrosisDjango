# apps/iot/evapotranspiracion/apps.py
from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class EvapotranspiracionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.iot.evapotranspiracion'
