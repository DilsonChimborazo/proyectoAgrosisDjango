from django.db import models
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades
from apps.inventario.unidadMedida.models import UnidadMedida
from apps.inventario.bodega.models import Bodega
from apps.inventario.herramientas.models import Herramientas
from django.utils import timezone
from django.db.models import F
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
    cantidad_insumo = models.IntegerField(null=True, blank=True)
    img = models.ImageField(upload_to='imagenes/')
    fk_unidad_medida = models.ForeignKey(UnidadMedida, on_delete=models.SET_NULL, null=True)
    bodega_devolucion_id_bodget = models.IntegerField(null=True, blank=True, help_text="ID de la bodega donde se realiza la devolución")
    depreciacion_total = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Depreciación total de las herramientas utilizadas en esta programación")

    def __str__(self): 
        return f'{self.estado}'

    def calcular_depreciacion(self):
        """
        Calcula la depreciación de las herramientas asignadas según la duración de la programación
        y actualiza el valor_actual de cada herramienta en Herramientas.
        Retorna un diccionario con el detalle de la depreciación por herramienta y el total.
        No guarda self para evitar recursión infinita.
        """
        VIDA_UTIL_MINUTOS = 5 * 365 * 24 * 60  # 5 años en minutos
        depreciacion_total = 0
        detalles_depreciacion = []

        if not self.fk_id_asignacionActividades:
            logger.warning("No hay asignación de actividades asociada.")
            return {"total": 0, "detalles": []}

        # Obtener las herramientas asignadas desde recursos_asignados
        herramientas_ids = self.fk_id_asignacionActividades.recursos_asignados.get('herramientas', [])
        
        for herramienta_id in herramientas_ids:
            try:
                herramienta_id = int(herramienta_id)
                herramienta = Herramientas.objects.get(id=herramienta_id)
                if not herramienta.precio:
                    logger.warning(f"Herramienta {herramienta.nombre_h} no tiene precio definido.")
                    continue

                # Obtener la cantidad de herramientas usadas (desde Bodega)
                cantidad = Bodega.objects.filter(
                    fk_id_herramientas_id=herramienta_id,
                    fk_id_asignacion=self.fk_id_asignacionActividades,
                    movimiento='Salida'
                ).aggregate(models.Sum('cantidad_herramienta'))['cantidad_herramienta__sum'] or 0

                if cantidad == 0:
                    logger.warning(f"No se encontró cantidad para la herramienta {herramienta.nombre_h} en Bodega. Verifica los registros de salida.")
                    continue

                # Calcular depreciación por minuto (usando precio original)
                depreciacion_por_minuto = float(herramienta.precio) / VIDA_UTIL_MINUTOS
                depreciacion_herramienta = depreciacion_por_minuto * self.duracion * cantidad

                # Descontar la depreciación del valor_actual por unidad
                depreciacion_por_unidad = depreciacion_por_minuto * self.duracion  # Depreciación por herramienta
                nuevo_valor = float(herramienta.valor_actual or herramienta.precio) - depreciacion_por_unidad
                if nuevo_valor < 0:
                    logger.warning(f"El valor_actual de {herramienta.nombre_h} no puede ser negativo. Estableciendo a 0.")
                    nuevo_valor = 0
                herramienta.valor_actual = round(nuevo_valor, 2)
                herramienta.save(update_fields=['valor_actual'])
                logger.info(f"Valor actual de {herramienta.nombre_h} actualizado a ${herramienta.valor_actual} tras depreciación de ${round(depreciacion_por_unidad, 2)} por unidad.")

                depreciacion_total += depreciacion_herramienta
                detalles_depreciacion.append({
                    "herramienta": herramienta.nombre_h,
                    "cantidad": cantidad,
                    "depreciacion": round(depreciacion_herramienta, 2)
                })

            except Herramientas.DoesNotExist:
                logger.error(f"Herramienta con ID {herramienta_id} no encontrada.")
                continue
            except (ValueError, TypeError) as e:
                logger.error(f"Error procesando herramienta ID {herramienta_id}: {str(e)}")
                continue

        return {
            "total": round(depreciacion_total, 2),
            "detalles": detalles_depreciacion
        }

    def save(self, *args, **kwargs):
        # Si el estado es 'Completada', registrar la devolución en Bodega y calcular depreciación
        if self.estado == 'Completada' and self.fk_id_asignacionActividades:
            asignacion = self.fk_id_asignacionActividades
            herramientas_ids = asignacion.recursos_asignados.get('herramientas', [])
            logger.info(f"Procesando devolución para asignación {asignacion.id} con herramientas: {herramientas_ids}")
            herramientas_devueltas = {}

            for herramienta_id in herramientas_ids:
                try:
                    herramienta_id = int(herramienta_id)
                    cantidad = Bodega.objects.filter(
                        fk_id_herramientas_id=herramienta_id,
                        fk_id_asignacion=asignacion,
                        movimiento='Salida'
                    ).aggregate(models.Sum('cantidad_herramienta'))['cantidad_herramienta__sum'] or 0
                    logger.debug(f"Herramienta ID {herramienta_id}: Cantidad encontrada en Bodega: {cantidad}")
                    if cantidad > 0:
                        herramientas_devueltas[herramienta_id] = cantidad
                    else:
                        logger.warning(f"No se encontró cantidad de salida para herramienta ID {herramienta_id} en asignación {asignacion.id}")
                except (ValueError, TypeError) as e:
                    logger.error(f"ID de herramienta inválido en recursos_asignados: {herramienta_id}, error: {str(e)}")
                    continue

            for herramienta_id, cantidad in herramientas_devueltas.items():
                try:
                    herramienta = Herramientas.objects.get(id=herramienta_id)
                    Bodega.objects.create(
                        fk_id_herramientas=herramienta,
                        fk_id_insumo=None,
                        fk_id_asignacion=asignacion,
                        cantidad_herramienta=cantidad,
                        movimiento='Entrada',
                        fk_unidad_medida=None,
                        fecha=timezone.now()
                    )
                    logger.info(f"Devolución registrada en Bodega: Herramienta ID {herramienta_id}, cantidad {cantidad}")
                    # Actualizar cantidad_herramienta en Herramientas
                    Herramientas.objects.filter(id=herramienta_id).update(
                        cantidad_herramienta=F('cantidad_herramienta') + cantidad
                    )
                    logger.info(f"Cantidad de herramienta ID {herramienta_id} actualizada a {Herramientas.objects.get(id=herramienta_id).cantidad_herramienta}")
                except Herramientas.DoesNotExist:
                    logger.error(f"Herramienta con ID {herramienta_id} no encontrada")
                    continue
                except Exception as e:
                    logger.error(f"Error al crear devolución o actualizar cantidad para herramienta ID {herramienta_id}: {str(e)}")
                    continue

            # Calcular la depreciación y actualizar depreciacion_total
            resultado_depreciacion = self.calcular_depreciacion()
            self.depreciacion_total = resultado_depreciacion['total']
            asignacion.save()

        super().save(*args, **kwargs)

