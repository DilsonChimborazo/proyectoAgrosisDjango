# apps/iot/mide/models.py
from django.db import models
from apps.iot.sensores.models import Sensores
from apps.trazabilidad.plantacion.models import Plantacion
from datetime import date
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

# Definir kc_values y etapas_dias
kc_values = {
    'Cereales': {'inicial': Decimal('0.35'), 'desarrollo': Decimal('1.15'), 'final': Decimal('0.45')},
    'Hortalizas': {'inicial': Decimal('0.50'), 'desarrollo': Decimal('1.00'), 'final': Decimal('0.80')},
    'Leguminosas': {'inicial': Decimal('0.40'), 'desarrollo': Decimal('1.10'), 'final': Decimal('0.50')},
    'Árboles Frutales': {'inicial': Decimal('0.60'), 'desarrollo': Decimal('0.90'), 'final': Decimal('0.75')},
    'Tubérculos': {'inicial': Decimal('0.45'), 'desarrollo': Decimal('1.05'), 'final': Decimal('0.70')},
    'Cultivos Forrajeros': {'inicial': Decimal('0.40'), 'desarrollo': Decimal('1.20'), 'final': Decimal('0.85')}
}

etapas_dias = {
    'Cereales': {'inicial': (0, 20), 'desarrollo': (20, 65), 'final': (65, 130)},
    'Hortalizas': {'inicial': (0, 20), 'desarrollo': (20, 60), 'final': (60, 120)},
    'Leguminosas': {'inicial': (0, 15), 'desarrollo': (15, 55), 'final': (55, 100)},
    'Árboles Frutales': {'inicial': (0, 60), 'desarrollo': (60, 240), 'final': (240, 360)},
    'Tubérculos': {'inicial': (0, 25), 'desarrollo': (25, 75), 'final': (75, 140)},
    'Cultivos Forrajeros': {'inicial': (0, 20), 'desarrollo': (20, 60), 'final': (60, 100)}
}

class Mide(models.Model):
    fk_id_sensor = models.ForeignKey(Sensores, on_delete=models.SET_NULL, null=True, related_name="mediciones")
    fk_id_plantacion = models.ForeignKey(Plantacion, on_delete=models.SET_NULL, null=True, related_name="mediciones")
    valor_medicion = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_medicion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Nombre del sensor: {self.fk_id_sensor.nombre_sensor if self.fk_id_sensor else 'Desconocido'} | Plantación: {self.fk_id_plantacion}"

    def save(self, *args, **kwargs):
        super(Mide, self).save(*args, **kwargs)
        
        try:
            from apps.iot.evapotranspiracion.models import Evapotranspiracion
            from apps.iot.evapotranspiracion.api.utils import calcular_eto

            # Verificar si el sensor es de temperatura y la plantación existe
            # Esto asegura que solo procesemos mediciones de temperatura
            if not (self.fk_id_sensor and self.fk_id_sensor.tipo_sensor == 'TEMPERATURA' and self.fk_id_plantacion):
                logger.info(f"No se calcula ETo/ETc: Sensor no es TEMPERATURA o falta plantación (sensor: {self.fk_id_sensor}, plantacion: {self.fk_id_plantacion})")
                return

            # Usar SOLO la medición actual de temperatura para calcular ETo
            # 'self' es la medición actual, que ya sabemos que es de tipo TEMPERATURA
            mediciones = [self]
            logger.info(f"Procesando medición de temperatura: {self.id}, valor: {self.valor_medicion}")

            # Calcular ETo usando solo esta medición de temperatura
            eto = calcular_eto(mediciones)
            logger.info(f"Valor calculado de ETo: {eto}")

            # Verificar si la plantación tiene un cultivo asociado
            if not self.fk_id_plantacion.fk_id_cultivo:
                logger.error("La plantación no tiene un cultivo asociado")
                return

            # Calcular días desde la plantación
            dias_desde_plantacion = (date.today() - self.fk_id_plantacion.fecha_plantacion).days
            logger.info(f"Días desde plantación: {dias_desde_plantacion}")

            # Obtener el tipo de cultivo
            tipo_cultivo = self.fk_id_plantacion.fk_id_cultivo.fk_id_especie.fk_id_tipo_cultivo.nombre
            logger.info(f"Tipo de cultivo: {tipo_cultivo}")
            if tipo_cultivo not in kc_values:
                logger.error(f"Tipo de cultivo no encontrado en kc_values: {tipo_cultivo}")
                return

            # Determinar la etapa del cultivo
            etapas = etapas_dias.get(tipo_cultivo)
            if not etapas:
                logger.error(f"Rangos de días no definidos para el cultivo: {tipo_cultivo}")
                return

            if etapas['inicial'][0] <= dias_desde_plantacion < etapas['inicial'][1]:
                etapa = 'inicial'
            elif etapas['desarrollo'][0] <= dias_desde_plantacion < etapas['desarrollo'][1]:
                etapa = 'desarrollo'
            else:
                etapa = 'final'
            logger.info(f"Etapa de crecimiento calculada: {etapa} para cultivo {tipo_cultivo}")

            # Obtener el valor de kc
            kc = kc_values[tipo_cultivo][etapa]
            logger.info(f"Valor de kc usado: {kc}")

            # Calcular ETc
            eto_decimal = Decimal(str(eto))
            etc = eto_decimal * kc
            logger.info(f"Cálculo de etc: ETo ({eto_decimal}) * kc ({kc}) = {etc}")

            # Guardar en el modelo Evapotranspiracion solo si es de temperatura
            # Esto ya está garantizado porque pasamos la verificación inicial
            evapo = Evapotranspiracion.objects.create(
                fk_id_plantacion=self.fk_id_plantacion,
                fecha=date.today(),
                eto=eto,
                etc=etc
            )
            logger.info(f"Evapotranspiración guardada para plantación: {self.fk_id_plantacion.id}, id_evapo: {evapo.id}")
            

        except Exception as e:
            logger.error(f"Error al calcular y guardar ETo/ETc: {str(e)}")
