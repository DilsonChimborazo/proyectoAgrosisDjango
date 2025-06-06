from decimal import Decimal
from django.core.exceptions import ObjectDoesNotExist
import logging
from datetime import date

logger = logging.getLogger(__name__)

def calcular_eto(mediciones):
    try:
        # Buscar la medición de temperatura
        temp = None
        for medicion in mediciones:
            sensor = medicion.fk_id_sensor
            tipo_sensor = sensor.tipo_sensor
            if tipo_sensor == 'TEMPERATURA':
                temp = medicion
                break

        if not temp:
            raise ValueError("Falta dato de temperatura")

        temperatura = Decimal(str(temp.valor_medicion))
        logger.info(f"Temperatura usada para cálculo: {temperatura}")

        # Validar rango de temperatura
        sensor = temp.fk_id_sensor
        if not (sensor.medida_minima <= float(temp.valor_medicion) <= sensor.medida_maxima):
            raise ValueError(f"Valor fuera de rango para TEMPERATURA: {temp.valor_medicion}")

        # Latitud estática del Tecnoparque Yamboró (1°53'31.7"N ≈ 1.892139° N)
        latitude = 1.892139

        # Hemisferio estático (Norte)
        hemisphere = 'Norte'

        # Mes actual
        month = date.today().month

        # Tabla de 'p' (porcentaje de horas diurnas) ajustada para latitud ~1.89° N
        p_values = {
            0: [0.270, 0.280, 0.270, 0.260, 0.270, 0.280, 0.290, 0.290, 0.280, 0.270, 0.260, 0.260],  # Latitud 0°
            1: [0.275, 0.285, 0.275, 0.265, 0.275, 0.285, 0.295, 0.295, 0.285, 0.275, 0.265, 0.265],  # Latitud 1°
            2: [0.280, 0.290, 0.280, 0.270, 0.280, 0.290, 0.300, 0.300, 0.290, 0.280, 0.270, 0.270],  # Latitud 2°
        }

        # Ajustar latitud para buscar el valor más cercano en la tabla
        lat_rounded = round(latitude)
        if lat_rounded not in p_values:
            lat_rounded = min(p_values.keys(), key=lambda x: abs(x - lat_rounded))

        # Ajustar mes (1-12) a índice (0-11)
        month_index = month - 1

        # Obtener el valor de 'p'
        p = Decimal(str(p_values[lat_rounded][month_index]))
        logger.info(f"Valor de p usado: {p}")

        # Calcular ETo: E = p (0.46T + 8.13)
        eto = p * (Decimal('0.46') * temperatura + Decimal('8.13'))
        logger.info(f"ETo calculado antes de redondeo: {eto}")

        return round(eto, 2)
    except Exception as e:
        logger.error(f"Error en cálculo de ETo: {str(e)}")
        raise ValueError(f"Error en cálculo de ETo: {str(e)}")