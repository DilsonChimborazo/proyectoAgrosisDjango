# apps/finanzas/nomina/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from decimal import Decimal

from .models import Nomina
from apps.trazabilidad.programacion.models import Programacion
from apps.finanzas.salario.models import Salario

@receiver(post_save, sender=Programacion)
def crear_o_actualizar_nomina(sender, instance, **kwargs):
    """
    Crea o actualiza automáticamente una nómina cuando la programación cambia a estado 'Completada'.
    """
    if instance.estado == 'Completada':
        salario = Salario.objects.first()  # Puedes personalizar la lógica para elegir el salario correcto

        if salario and salario.jornal > 0:
            # Calculamos jornales y pago total
            minutos_trabajados = instance.duracion
            jornales = minutos_trabajados / 60.0 / salario.jornal
            pago_total = round(Decimal(jornales) * salario.precio_jornal, 2)

            # Buscar o crear la nómina asociada
            nomina, created = Nomina.objects.get_or_create(
                fk_id_programacion=instance,
                defaults={
                    "fk_id_salario": salario,
                    "pago_total": pago_total
                }
            )

            # Si ya existía, actualizamos la info
            if not created:
                nomina.fk_id_salario = salario
                nomina.pago_total = pago_total
                nomina.save()