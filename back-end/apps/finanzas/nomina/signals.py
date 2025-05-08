from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal

from .models import Nomina
from apps.trazabilidad.programacion.models import Programacion
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.finanzas.salario.models import Salario

@receiver(post_save, sender=Programacion)
def crear_o_actualizar_nomina_programacion(sender, instance, **kwargs):
    """
    Crea o actualiza automáticamente una nómina cuando la programación cambia a estado 'Completada'.
    """
    if instance.estado.lower() == 'completada':
        salario = Salario.objects.filter(activo=True).first()

        if salario and salario.horas_por_jornal > 0:
            minutos_trabajados = instance.duracion
            horas_trabajadas = minutos_trabajados / 60.0
            jornales = horas_trabajadas / salario.horas_por_jornal
            pago_total = round(Decimal(jornales) * salario.precio_jornal, 2)

            nomina, created = Nomina.objects.get_or_create(
                fk_id_programacion=instance,
                defaults={
                    "fk_id_salario": salario,
                    "pago_total": pago_total
                }
            )

            if not created:
                nomina.fk_id_salario = salario
                nomina.pago_total = pago_total
                nomina.save()

@receiver(post_save, sender=Control_fitosanitario)
def crear_o_actualizar_nomina_control(sender, instance, **kwargs):
    """
    Crea o actualiza automáticamente una nómina cuando se crea o actualiza un control fitosanitario.
    """
    salario = Salario.objects.filter(activo=True).first()

    if salario and salario.horas_por_jornal > 0:
        minutos_trabajados = instance.duracion
        horas_trabajadas = minutos_trabajados / 60.0
        jornales = horas_trabajadas / salario.horas_por_jornal
        pago_total = round(Decimal(jornales) * salario.precio_jornal, 2)

        # Usamos fk_id_control_fitosanitario en lugar de fk_id_programacion
        nomina, created = Nomina.objects.get_or_create(
            fk_id_control_fitosanitario=instance,
            defaults={
                "fk_id_salario": salario,
                "pago_total": pago_total
            }
        )

        if not created:
            nomina.fk_id_salario = salario
            nomina.pago_total = pago_total
            nomina.save()