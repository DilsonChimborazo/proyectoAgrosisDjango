from math import exp
from decimal import Decimal
from django.core.exceptions import ObjectDoesNotExist

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
        humedad_relativa = Decimal(str(humedad.valor_medicion))  # Corrección
        velocidad_viento = Decimal(str(viento.valor_medicion))
        radiacion_solar = Decimal(str(radiacion.valor_medicion))  # Corrección

        # Validar rangos
        for medicion, tipo in [(temp, 'TEMPERATURA'), (humedad, 'HUMEDAD_AMBIENTAL'), (viento, 'VELOCIDAD_VIENTO'), (radiacion, 'ILUMINACION')]:
            sensor = medicion.fk_id_sensor
            if not (sensor.medida_minima <= float(medicion.valor_medicion) <= sensor.medida_maxima):
                raise ValueError(f"Valor fuera de rango para {tipo}: {medicion.valor_medicion}")

        if presion:
            presion_atm = Decimal(str(presion.valor_medicion))
        else:
            presion_atm = Decimal('101.3') * ((293 - 0.0065 * altitud) / 293) ** 5.26

        gamma = Decimal('0.000665') * presion_atm
        delta = (Decimal('4098') * (Decimal('0.6108') * exp((17.27 * float(temperatura)) / (float(temperatura) + 237.3)))) / (float(temperatura) + 237.3) ** 2
        es = Decimal('0.6108') * exp((17.27 * float(temperatura)) / (float(temperatura) + 237.3))
        ea = es * (humedad_relativa / Decimal('100'))
        rn = radiacion_solar * Decimal('0.0864')
        G = Decimal('0')
        u2 = velocidad_viento
        numerador = Decimal('0.408') * delta * (rn - G) + gamma * (Decimal('900') / (temperatura + Decimal('273'))) * u2 * (es - ea)
        denominador = delta + gamma * (Decimal('1') + Decimal('0.34') * u2)
        eto = numerador / denominador

        return round(eto, 2)
    except Exception as e:
        raise ValueError(f"Error en cálculo de ETo: {str(e)}")