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
    Crea o actualiza automáticamente una nómina para cada usuario asignado cuando la programación cambia a estado 'Completada'.
    """
    if instance.estado.lower() == 'completada':
        asignacion = instance.fk_id_asignacionActividades
        usuarios = asignacion.fk_identificacion.all()

        if not usuarios:
            return  # No hay usuarios asignados, no se crea nómina

        minutos_trabajados_total = instance.duracion
        horas_trabajadas_total = Decimal(minutos_trabajados_total) / Decimal('60')

        # Obtener salarios de todos los usuarios
        salarios = {}
        for usuario in usuarios:
            salario = Salario.objects.filter(
                fk_id_rol=usuario.fk_id_rol,
                activo=True
            ).first()
            if salario and salario.horas_por_jornal > 0:
                salarios[usuario.id] = {
                    'salario': salario,
                    'precio_por_hora': Decimal(salario.precio_jornal) / Decimal(salario.horas_por_jornal)
                }

        if not salarios:
            return

        # Calcular el pago total basado en el salario más alto como referencia
        salario_maximo = max(salarios.values(), key=lambda x: x['precio_por_hora'])['precio_por_hora']
        pago_total_base = horas_trabajadas_total * salario_maximo  # Pago base usando el salario más alto

        # Distribuir proporcionalmente según el salario por hora de cada usuario
        for usuario in usuarios:
            if usuario.id in salarios:
                salario_data = salarios[usuario.id]
                salario = salario_data['salario']
                precio_por_hora = salario_data['precio_por_hora']
                proporcion = precio_por_hora / salario_maximo  # Proporción relativa al salario más alto
                pago_total = round(pago_total_base * proporcion, 2)

                nomina, created = Nomina.objects.get_or_create(
                    fk_id_programacion=instance,
                    fk_id_usuario=usuario,
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
    Solo considera al primer usuario del campo ManyToMany 'fk_identificacion'.
    """
    usuario = instance.fk_identificacion.first()  # Toma el primer usuario (si hay)
    if not usuario:
        return

    salario = Salario.objects.filter(activo=True, fk_id_rol=usuario.fk_id_rol).first()
    if salario and salario.horas_por_jornal > 0:
        minutos_trabajados = instance.duracion
        horas_trabajadas = minutos_trabajados / 60.0
        jornales = horas_trabajadas / salario.horas_por_jornal
        pago_total = round(Decimal(jornales) * salario.precio_jornal, 2)

        nomina, created = Nomina.objects.get_or_create(
            fk_id_control_fitosanitario=instance,
            fk_id_usuario=usuario,
            defaults={
                "fk_id_salario": salario,
                "pago_total": pago_total
            }
        )
        if not created:
            nomina.fk_id_salario = salario
            nomina.pago_total = pago_total
            nomina.save()