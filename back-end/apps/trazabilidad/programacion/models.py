from django.db import models
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.inventario.unidadMedida.models import UnidadMedida
from apps.inventario.bodega.models import Bodega  # Importación para manejar devoluciones
from apps.inventario.herramientas.models import Herramientas
from django.utils import timezone
import logging

# Configurar logging
logger = logging.getLogger(__name__)

class Programacion(models.Model): 
    ESTADOS = [
        ('Pendiente', 'Pendiente'),
        ('Completada', 'Completada'),
        ('Cancelada', 'Cancelada'),
        ('Reprogramada', 'Reprogramada'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Completada')
    fecha_realizada = models.DateField() 
    duracion = models.IntegerField(help_text="Duración en minutos")
    fk_id_asignacionActividades = models.ForeignKey(Asignacion_actividades, on_delete=models.SET_NULL, null=True)
    cantidad_insumo = models.IntegerField()
    img = models.ImageField(upload_to='imagenes/', null=True, blank=True)
    fk_unidad_medida = models.ForeignKey(UnidadMedida, on_delete=models.SET_NULL, null=True, blank=True)
    bodega_devolucion_id_bodget = models.IntegerField(null=True, blank=True, help_text="ID de la bodega donde se realiza la devolución")

    def __str__(self): 
        return f'{self.estado}'

    def save(self, *args, **kwargs):
        # Si el estado es 'Completada', registrar la devolución en Bodega (solo herramientas)
        if self.estado == 'Completada' and self.fk_id_asignacionActividades:
            from apps.inventario.bodega.models import Bodega
            asignacion = self.fk_id_asignacionActividades

            # Obtener las herramientas asignadas (IDs)
            herramientas_ids = asignacion.recursos_asignados.get('herramientas', [])
            herramientas_devueltas = {}

            # Validar y procesar cada ID de herramienta
            for herramienta_id in herramientas_ids:
                try:
                    herramienta_id = int(herramienta_id)  # Asegurarse de que sea un entero
                    cantidad = Bodega.objects.filter(
                        fk_id_herramientas_id=herramienta_id,
                        fk_id_asignacion=asignacion,
                        movimiento='Salida'
                    ).aggregate(models.Sum('cantidad_herramienta'))['cantidad_herramienta__sum'] or 0
                    if cantidad > 0:
                        herramientas_devueltas[herramienta_id] = cantidad
                except (ValueError, TypeError) as e:
                    logger.error(f"ID de herramienta inválido en recursos_asignados: {herramienta_id}, error: {str(e)}")
                    continue

            # Registrar devolución en Bodega para herramientas
            for herramienta_id, cantidad in herramientas_devueltas.items():
                try:
                    herramienta = Herramientas.objects.get(id=herramienta_id)
                    Bodega.objects.create(
                        fk_id_herramientas=herramienta,  # Usar el objeto Herramientas
                        fk_id_insumo=None,
                        fk_id_asignacion=asignacion,
                        cantidad_herramienta=cantidad,
                        movimiento='Entrada',
                        fk_unidad_medida=None,
                        fecha=timezone.now()
                    )
                    logger.info(f"Devolución registrada en Bodega: Herramienta ID {herramienta_id}, cantidad {cantidad}")
                except Herramientas.DoesNotExist:
                    logger.error(f"Herramienta con ID {herramienta_id} no encontrada")
                    continue
            asignacion.save()

        super().save(*args, **kwargs)