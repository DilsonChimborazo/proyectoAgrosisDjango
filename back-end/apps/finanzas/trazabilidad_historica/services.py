from django.db import transaction
from .models import SnapshotTrazabilidad, ResumenTrazabilidad
import logging
from django.test import RequestFactory
from django.urls import reverse
from django.http import HttpRequest
from rest_framework.test import APIRequestFactory

logger = logging.getLogger(__name__)

class TrazabilidadService:
    
    @classmethod
    def crear_snapshot(cls, plantacion_id, datos, trigger=None):
        with transaction.atomic():
            snapshot = SnapshotTrazabilidad.objects.create(
                plantacion_id=plantacion_id,
                datos=datos,
                version=cls._obtener_proxima_version(plantacion_id),
                trigger=trigger
            )
            
            ResumenTrazabilidad.objects.update_or_create(
                plantacion_id=plantacion_id,
                defaults={'datos_actuales': datos}
            )
            return snapshot
    
    @classmethod
    def _obtener_proxima_version(cls, plantacion_id):
        ultimo = SnapshotTrazabilidad.objects.filter(
            plantacion_id=plantacion_id
        ).order_by('-version').first()
        return ultimo.version + 1 if ultimo else 1

    @classmethod
    def generar_datos_trazabilidad(cls, plantacion_id):
        """Nueva implementación que usa el cliente HTTP para evitar import circular"""
        from django.test import Client
        client = Client()
        response = client.get(f'/api/trazabilidad/plantacion/{plantacion_id}/')
        return response.data