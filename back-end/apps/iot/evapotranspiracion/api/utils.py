from math import exp
from decimal import Decimal
from django.core.exceptions import ObjectDoesNotExist
import logging

logger = logging.getLogger(__name__)

def calcular_eto(mediciones, altitud=1000):
    try:
        temp = mediciones.filter(fk_id_sensor__tipo_sensor='TEMPERATURA').first()
        humedad = mediciones.filter(fk_id_sensor__tipo_sensor='HUMEDAD_AMBIENTAL').first()
        viento = mediciones.filter(fk_id_sensor__tipo_sensor='VELOCIDAD_VIENTO').first()
        radiacion = mediciones.filter(fk_id_sensor__tipo_sensor='ILUMINACION').first()
        presion = mediciones.filter(fk_id_sensor__tipo_sensor='PRESION_ATMOSFERICA').first()

        if not all([temp, humedad, viento, radiacion]):
            raise ValueError("Faltan datos de sensores requeridos")

        temperatura = Decimal(str(temp.valor_medicion))
        humedad_relativa = Decimal(str(humedad.valor_medicion))
        velocidad_viento = Decimal(str(viento.valor_medicion))
        radiacion_solar = Decimal(str(radiacion.valor_medicion))

        # Validar rangos
        for medicion, tipo in [(temp, 'TEMPERATURA'), (humedad, 'HUMEDAD_AMBIENTAL'), (viento, 'VELOCIDAD_VIENTO'), (radiacion, 'ILUMINACION')]:
            sensor = medicion.fk_id_sensor
            if not (sensor.medida_minima <= float(medicion.valor_medicion) <= sensor.medida_maxima):
                raise ValueError(f"Valor fuera de rango para {tipo}: {medicion.valor_medicion}")

        if presion:
            presion_atm = Decimal(str(presion.valor_medicion))
        else:
            presion_atm = Decimal('101.3') * ((Decimal('293') - Decimal('0.0065') * Decimal(str(altitud))) / Decimal('293')) ** Decimal('5.26')

        gamma = Decimal('0.000665') * presion_atm
        
        # Calcular delta de manera más clara
        temp_float = float(temperatura)
        exp_term = Decimal(str(exp((17.27 * temp_float) / (temp_float + 237.3))))
        es_term = Decimal('0.6108') * exp_term
        delta_numerator = Decimal('4098') * es_term
        delta_denominator = Decimal(str(temp_float + 237.3)) ** 2
        delta = delta_numerator / delta_denominator

        es = es_term
        ea = es * (humedad_relativa / Decimal('100'))
        rn = radiacion_solar * Decimal('0.0864')
        G = Decimal('0')
        u2 = velocidad_viento
        numerador = Decimal('0.408') * delta * (rn - G) + gamma * (Decimal('900') / (temperatura + Decimal('273'))) * u2 * (es - ea)
        denominador = delta + gamma * (Decimal('1') + Decimal('0.34') * u2)
        eto = numerador / denominador

        return round(eto, 2)
    except Exception as e:
        logger.error(f"Error en cálculo de ETo: {str(e)}")
        raise ValueError(f"Error en cálculo de ETo: {str(e)}")