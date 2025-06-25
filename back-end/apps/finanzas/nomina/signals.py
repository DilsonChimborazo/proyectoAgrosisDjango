from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from decimal import Decimal

# Importaciones de modelos
from .models import Nomina
from apps.trazabilidad.programacion.models import Programacion
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.finanzas.salario.models import Salario
from apps.usuarios.usuario.models import Usuarios

@receiver(post_save, sender=Programacion)
def crear_o_actualizar_nomina_programacion(sender, instance, **kwargs):
    """
    Crea o actualiza automáticamente una nómina para cada usuario asignado cuando la programación cambia a estado 'Completada'.
    Esta función se mantiene sin cambios, ya que funcionaba correctamente.
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

@receiver(m2m_changed, sender=Control_fitosanitario.fk_identificacion.through)
def crear_nomina_para_control_fitosanitario(sender, instance, action, pk_set, **kwargs):
    """
    Crea o actualiza una nómina para cada usuario cuando se añaden a un Control Fitosanitario.
    Esta señal se dispara después de que la relación ManyToMany se ha guardado,
    lo que soluciona el problema de que los usuarios no se encontraban.
    """
    if action == "post_add":
        if not pk_set:
            return  # No hay IDs de usuario en el conjunto, no hay nada que hacer.

        # Iteramos sobre el conjunto de claves primarias (pk_set) de los usuarios que fueron añadidos.
        for usuario_id in pk_set:
            try:
                usuario = Usuarios.objects.get(pk=usuario_id)
                salario = Salario.objects.filter(activo=True, fk_id_rol=usuario.fk_id_rol).first()

                if salario and salario.horas_por_jornal > 0:
                    minutos_trabajados = instance.duracion  # 'instance' es el objeto Control_fitosanitario
                    
                    # Usamos Decimal para los cálculos para evitar problemas de precisión
                    horas_trabajadas = Decimal(minutos_trabajados) / Decimal('60.0')
                    jornales = horas_trabajadas / Decimal(salario.horas_por_jornal)
                    pago_total = round(Decimal(jornales) * salario.precio_jornal, 2)
                    
                    # Usamos get_or_create para evitar duplicados si la señal se dispara accidentalmente más de una vez.
                    # La clave única es la combinación del control y el usuario.
                    nomina, created = Nomina.objects.get_or_create(
                        fk_id_control_fitosanitario=instance,
                        fk_id_usuario=usuario,
                        defaults={
                            "fk_id_salario": salario,
                            "pago_total": pago_total
                        }
                    )

                    # Si la nómina ya existía (no fue creada), actualizamos sus valores.
                    if not created:
                        nomina.fk_id_salario = salario
                        nomina.pago_total = pago_total
                        nomina.save()

            except Usuarios.DoesNotExist:
                continue  # Ignoramos usuarios no encontrados