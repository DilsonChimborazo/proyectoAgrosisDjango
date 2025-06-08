import logging
from django.db import models
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from apps.trazabilidad.realiza.models import Realiza
from apps.usuarios.usuario.models import Usuarios
from apps.inventario.insumo.models import Insumo
from apps.inventario.herramientas.models import Herramientas
from apps.trazabilidad.notificacion.models import Notificacion
from django.utils import timezone
from datetime import timedelta
from django.db import models  # Importación para JSONField

# Configurar logging
logger = logging.getLogger(__name__)

class Asignacion_actividades(models.Model):
    ESTADOS = [
        ('Pendiente', 'Pendiente'),
        ('Completada', 'Completada'),
        ('Cancelada', 'Cancelada'),
        ('Reprogramada', 'Reprogramada'),
    ]
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Pendiente')
    fecha_programada = models.DateField()
    observaciones = models.TextField()
    fk_id_realiza = models.ForeignKey(Realiza, on_delete=models.SET_NULL, null=True)
    fk_identificacion = models.ManyToManyField(Usuarios, related_name='asignaciones_actividades')
    # Campo auxiliar para almacenar temporalmente los recursos asignados
    recursos_asignados = models.JSONField(default=dict, blank=True, null=True)  # Usando JSONField estándar

    def __str__(self):
        return f'{self.fk_id_realiza} - Asignación con {self.fk_identificacion.count()} usuarios'

    def save(self, *args, **kwargs):
        # Guardar la asignación primero para asegurar que el objeto tenga un ID
        super(Asignacion_actividades, self).save(*args, **kwargs)

        # Verificar si hay usuarios asignados
        usuarios_asignados = self.fk_identificacion.all()
        logger.info(f"Guardando asignación {self.id} con {len(usuarios_asignados)} usuarios asignados")

        if not usuarios_asignados:
            logger.warning(f"No hay usuarios asignados para la asignación {self.id}")
            return

        # Obtener información relevante para las notificaciones
        actividad = self.fk_id_realiza.fk_id_actividad.nombre_actividad if self.fk_id_realiza and self.fk_id_realiza.fk_id_actividad else 'Desconocida'
        plantacion = self.fk_id_realiza.fk_id_plantacion if self.fk_id_realiza else None
        cultivo = plantacion.fk_id_cultivo.nombre_cultivo if plantacion and plantacion.fk_id_cultivo else 'Desconocido'
        era = plantacion.fk_id_eras.nombre if plantacion and plantacion.fk_id_eras else 'Desconocida'
        days_until = (self.fecha_programada - timezone.now().date()).days

        # Generar título y mensaje para la notificación
        titulo = f"Asignación: {actividad} en {cultivo}"
        mensaje = (f"Te han asignado la actividad '{actividad}' "
                   f"en el cultivo '{cultivo}' (Era: {era}) para el "
                   f"{self.fecha_programada.strftime('%Y-%m-%d')} "
                   f"(en {days_until} día(s)). Estado: {self.estado}. "
                   f"Observaciones: {self.observaciones}")

        # Incluir recursos asignados en la notificación si existen
        if self.recursos_asignados and (self.recursos_asignados.get('herramientas') or self.recursos_asignados.get('insumos')):
            herramientas_str = ', '.join(str(id) for id in self.recursos_asignados.get('herramientas', []))
            insumos_str = ', '.join(str(id) for id in self.recursos_asignados.get('insumos', []))
            mensaje += f"\nRecursos a reclamar en bodega: Herramientas (IDs: {herramientas_str}), Insumos (IDs: {insumos_str})."

        logger.info(f"Generando notificaciones para asignación {self.id}: {titulo}")

        # Iterar sobre los usuarios asignados y crear notificaciones
        for usuario in usuarios_asignados:
            if not Notificacion.objects.filter(
                usuario=usuario,
                titulo=titulo,
                mensaje=mensaje,
                leida=False
            ).exists():
                try:
                    notificacion = Notificacion.objects.create(
                        usuario=usuario,
                        titulo=titulo,
                        mensaje=mensaje
                    )
                    logger.info(f"Notificación creada con ID {notificacion.id} para el usuario {usuario.id}")
                except Exception as e:
                    logger.error(f"Error al crear notificación para el usuario {usuario.id}: {str(e)}")

    # Método para asignar recursos temporalmente (herramientas e insumos)
    def asignar_recursos(self, herramientas_ids, insumos_ids):
        self.recursos_asignados = {
            'herramientas': herramientas_ids,
            'insumos': insumos_ids
        }
        self.save()
        logger.info(f"Recursos asignados temporalmente a la asignación {self.id}: {herramientas_ids} herramientas, {insumos_ids} insumos")
        # Actualizar notificaciones para reflejar los recursos asignados
        self.save()  # Esto disparará la lógica de notificación con los nuevos recursos

    # Método para registrar la salida en bodega al reclamar (herramientas e insumos)
    def reclamar_recursos(self, herramientas_cantidades, insumos_cantidades):
        from apps.inventario.bodega.models import Bodega  # Importación local
        for herramienta_id, cantidad in herramientas_cantidades.items():
            Bodega.objects.create(
                fk_id_herramientas_id=Herramientas.objects.get(id=herramienta_id),
                fk_id_insumo=None,
                fk_id_asignacion=self,
                cantidad_herramienta=cantidad,
                movimiento='Salida',
                fk_unidad_medida=None  # Ajusta si las herramientas tienen unidad de medida
            )
        for insumo_id, cantidad in insumos_cantidades.items():
            insumo = Insumo.objects.get(id=insumo_id)
            Bodega.objects.create(
                fk_id_herramientas=None,
                fk_id_insumo=insumo,
                fk_id_asignacion=self,
                cantidad_insumo=cantidad,
                movimiento='Salida',
                fk_unidad_medida=insumo.fk_unidad_medida if insumo.fk_unidad_medida else None
            )
        self.recursos_asignados = {'herramientas': list(herramientas_cantidades.keys()), 'insumos': list(insumos_cantidades.keys())}  # Actualizar recursos reclamados
        self.save()
        logger.info(f"Recursos reclamados y registrados en bodega para asignación {self.id}: {herramientas_cantidades} herramientas, {insumos_cantidades} insumos")

    # Método para completar actividad
    def completar_actividad(self, duracion, bodega_devolucion_id=None):
        from apps.trazabilidad.programacion.models import Programacion  # Importación local
        self.estado = 'Completada'
        self.save()
        programacion = Programacion.objects.create(
            estado='Completada',
            fecha_realizada=timezone.now().date(),
            duracion=duracion,
            fk_id_asignacionActividades=self,
            cantidad_insumo=0,  # No aplica para devolución, se deja en 0
            img=None,
            fk_unidad_medida=None,
            bodega_devolucion_id_bodget=bodega_devolucion_id
        )
        logger.info(f"Actividad {self.id} completada. Programación registrada con ID {programacion.id}")

@receiver(m2m_changed, sender=Asignacion_actividades.fk_identificacion.through)
def asignacion_actividades_usuarios_changed(sender, instance, action, pk_set, **kwargs):
    if action in ['post_add', 'post_remove']:
        logger.info(f"Cambio en usuarios asignados para la asignación {instance.id}: {action}, usuarios: {pk_set}")
        usuarios_asignados = instance.fk_identificacion.all()

        if not usuarios_asignados:
            logger.warning(f"No hay usuarios asignados para la asignación {instance.id} después de {action}")
            return

        # Obtener información relevante para las notificaciones
        actividad = instance.fk_id_realiza.fk_id_actividad.nombre_actividad if instance.fk_id_realiza and instance.fk_id_realiza.fk_id_actividad else 'Desconocida'
        plantacion = instance.fk_id_realiza.fk_id_plantacion if instance.fk_id_realiza else None
        cultivo = plantacion.fk_id_cultivo.nombre_cultivo if plantacion and plantacion.fk_id_cultivo else 'Desconocido'
        era = plantacion.fk_id_eras.nombre if plantacion and plantacion.fk_id_eras else 'Desconocida'
        days_until = (instance.fecha_programada - timezone.now().date()).days

        # Generar título y mensaje para la notificación
        titulo = f"Asignación: {actividad} en {cultivo}"
        mensaje = (f"Te han asignado la actividad '{actividad}' "
                   f"en el cultivo '{cultivo}' (Era: {era}) para el "
                   f"{instance.fecha_programada.strftime('%Y-%m-%d')} "
                   f"(en {days_until} día(s)). Estado: {instance.estado}. "
                   f"Observaciones: {instance.observaciones}")

        # Incluir recursos asignados en la notificación si existen
        if instance.recursos_asignados and (instance.recursos_asignados.get('herramientas') or instance.recursos_asignados.get('insumos')):
            herramientas_str = ', '.join(str(id) for id in instance.recursos_asignados.get('herramientas', []))
            insumos_str = ', '.join(str(id) for id in instance.recursos_asignados.get('insumos', []))
            mensaje += f"\nRecursos a reclamar en bodega: Herramientas (IDs: {herramientas_str}), Insumos (IDs: {insumos_str})."

        logger.info(f"Generando notificaciones para asignación {instance.id}: {titulo}")

        # Iterar sobre los usuarios afectados por el cambio
        for usuario_id in pk_set:
            usuario = Usuarios.objects.get(id=usuario_id)
            if not Notificacion.objects.filter(
                usuario=usuario,
                titulo=titulo,
                mensaje=mensaje,
                leida=False
            ).exists():
                try:
                    notificacion = Notificacion.objects.create(
                        usuario=usuario,
                        titulo=titulo,
                        mensaje=mensaje
                    )
                    logger.info(f"Notificación creada con ID {notificacion.id} para el usuario {usuario.id}")
                except Exception as e:
                    logger.error(f"Error al crear notificación para el usuario {usuario.id}: {str(e)}")