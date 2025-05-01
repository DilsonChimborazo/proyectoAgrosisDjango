# apps/finanzas/trazabilidad_historica/services.py
from django.db import transaction
from .models import SnapshotTrazabilidad, ResumenTrazabilidad
import json

class TrazabilidadService:
    
    @classmethod
    def crear_snapshot(cls, plantacion_id, datos, trigger=None):
        with transaction.atomic():
            # Crear el snapshot histórico
            snapshot = SnapshotTrazabilidad.objects.create(
                plantacion_id=plantacion_id,
                datos=datos,
                version=cls._obtener_proxima_version(plantacion_id),
                trigger=trigger
            )
            
            # Actualizar o crear el resumen actual
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