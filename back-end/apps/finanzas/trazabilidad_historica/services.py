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
            
            # Actualizar o crear el resumen de trazabilidad
            ResumenTrazabilidad.objects.update_or_create(
                plantacion_id=plantacion_id,
                defaults={
                    'datos_actuales': datos,
                    # Aquí pasamos el nuevo campo
                    'precio_minimo_venta_por_unidad': datos.get('precio_minimo_venta_por_unidad', 0.0) 
                }
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
        # Nota: En producción, es recomendable refactorizar calcular_trazabilidad a una función interna
        # para evitar dependencias HTTP para cálculos internos.
        response = client.get(f'/api/trazabilidad/plantacion/{plantacion_id}/')
        if response.status_code == 200:
            return response.data
        else:
            logger.error(f"Error al generar datos de trazabilidad para plantación {plantacion_id}: {response.status_code} - {response.content}")
            # Considera devolver un diccionario con valores por defecto o lanzar una excepción
            return {}