from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from apps.iot.mide.models import Mide
from apps.trazabilidad.plantacion.models import Plantacion
from apps.iot.evapotranspiracion.models import Evapotranspiracion
from apps.iot.evapotranspiracion.api.utils import calcular_eto
from apps.iot.evapotranspiracion.api.serializers import LeerEvapotranspiracionSerializer
from datetime import date
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

# Definir el diccionario kc_values
kc_values = {
    'Cereales': {'inicial': Decimal('0.35'), 'desarrollo': Decimal('1.15'), 'final': Decimal('0.45')},
    'Hortalizas': {'inicial': Decimal('0.50'), 'desarrollo': Decimal('1.00'), 'final': Decimal('0.80')},
    'Leguminosas': {'inicial': Decimal('0.40'), 'desarrollo': Decimal('1.10'), 'final': Decimal('0.50')},
    'Árboles Frutales': {'inicial': Decimal('0.60'), 'desarrollo': Decimal('0.90'), 'final': Decimal('0.75')},
    'Tubérculos': {'inicial': Decimal('0.45'), 'desarrollo': Decimal('1.05'), 'final': Decimal('0.70')},
    'Cultivos Forrajeros': {'inicial': Decimal('0.40'), 'desarrollo': Decimal('1.20'), 'final': Decimal('0.85')}
}

# Diccionario de rangos de días por etapa según tipo de cultivo
etapas_dias = {
    'Cereales': {
        'inicial': (0, 20),  # 10–20 días
        'desarrollo': (20, 65),  # 30–45 días de desarrollo vegetativo + inicio de floración
        'final': (65, 130)  # Floración (15–25 días) + maduración (30–50 días)
    },
    'Hortalizas': {
        'inicial': (0, 20),  # 10–20 días
        'desarrollo': (20, 60),  # 20–40 días de desarrollo vegetativo + inicio de floración
        'final': (60, 120)  # Floración (20–30 días) + maduración (20–30 días)
    },
    'Leguminosas': {
        'inicial': (0, 15),  # 8–15 días
        'desarrollo': (15, 55),  # 25–40 días de desarrollo vegetativo + inicio de floración
        'final': (55, 100)  # Floración (15–25 días) + maduración (20–35 días)
    },
    'Árboles Frutales': {
        'inicial': (0, 60),  # 30–60 días (inicio de ciclo productivo)
        'desarrollo': (60, 240),  # 60–180 días (crecimiento vegetativo/floración)
        'final': (240, 360)  # 180–360 días (fructificación/maduración)
    },
    'Tubérculos': {
        'inicial': (0, 25),  # 15–25 días
        'desarrollo': (25, 75),  # 30–50 días de desarrollo vegetativo + inicio de tuberización
        'final': (75, 140)  # Tuberización (30–40 días) + maduración (30–40 días)
    },
    'Cultivos Forrajeros': {
        'inicial': (0, 20),  # Estimado, similar a cereales
        'desarrollo': (20, 60),  # Estimado
        'final': (60, 100)  # Estimado
    }
}

# ... (importaciones)

class EvapotranspiracionViewSet(ViewSet):
    def list(self, request):
        print("Solicitud recibida en EvapotranspiracionViewSet.list")
        plantacion_id = request.query_params.get('fk_id_plantacion')
        if not plantacion_id:
            print("Falta el parámetro fk_id_plantacion")
            return Response({"error": "Se requiere el parámetro fk_id_plantacion"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            plantacion = Plantacion.objects.get(id=plantacion_id)
            print(f"Plantación encontrada: {plantacion_id}")
            evapotranspiraciones = Evapotranspiracion.objects.filter(fk_id_plantacion=plantacion)
            print(f"Registros encontrados: {evapotranspiraciones.count()}")

            serializer = LeerEvapotranspiracionSerializer(evapotranspiraciones, many=True)
            return Response(serializer.data)
        except Plantacion.DoesNotExist:
            print(f"Plantación no encontrada: {plantacion_id}")
            return Response({"error": "Plantación no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error en list: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk=None):
        try:
            plantacion = Plantacion.objects.get(id=pk)
            if not plantacion.fk_id_cultivo:
                return Response({"error": "La plantación no tiene un cultivo asociado"}, status=status.HTTP_400_BAD_REQUEST)

            mediciones = Mide.objects.filter(
                fk_id_plantacion_id=pk,
                fecha_medicion__date=date.today()
            )

            if not mediciones.exists():
                return Response({"error": "No hay mediciones para hoy"}, status=status.HTTP_404_NOT_FOUND)

            # Depurar las mediciones utilizadas
            print(f"Mediciones encontradas para hoy (plantación {pk}):")
            for m in mediciones:
                print(f"  - Sensor: {m.fk_id_sensor.nombre_sensor}, Valor: {m.valor_medicion}, Tipo: {type(m.valor_medicion).__name__}, Fecha: {m.fecha_medicion}")

            # Calcular ETo usando Blaney-Criddle
            eto = calcular_eto(mediciones)
            print(f"Valor calculado de ETo: {eto}, Tipo: {type(eto).__name__}")

            if not hasattr(plantacion, 'fecha_plantacion'):
                print("El modelo Plantacion no tiene fecha_plantacion")
                return Response({"error": "El modelo Plantacion no tiene fecha_plantacion"}, status=status.HTTP_400_BAD_REQUEST)

            dias_desde_plantacion = (date.today() - plantacion.fecha_plantacion).days
            print(f"Días desde plantación: {dias_desde_plantacion}")

            tipo_cultivo = plantacion.fk_id_cultivo.fk_id_especie.fk_id_tipo_cultivo.nombre
            if tipo_cultivo not in kc_values:
                print(f"Tipo de cultivo no encontrado en kc_values: {tipo_cultivo}")
                return Response({"error": f"Tipo de cultivo no soportado: {tipo_cultivo}"}, status=status.HTTP_400_BAD_REQUEST)

            etapas = etapas_dias.get(tipo_cultivo)
            if not etapas:
                print(f"Rangos de días no definidos para el cultivo: {tipo_cultivo}")
                return Response({"error": f"Rangos de días no definidos para el cultivo: {tipo_cultivo}"}, status=status.HTTP_400_BAD_REQUEST)

            if etapas['inicial'][0] <= dias_desde_plantacion < etapas['inicial'][1]:
                etapa = 'inicial'
            elif etapas['desarrollo'][0] <= dias_desde_plantacion < etapas['desarrollo'][1]:
                etapa = 'desarrollo'
            else:
                etapa = 'final'


            print(f"Etapa de crecimiento calculada: {etapa} para cultivo {tipo_cultivo}")

            kc = kc_values[tipo_cultivo][etapa]
            print(f"Valor de kc usado: {kc}, Tipo: {type(kc).__name__}, Cultivo: {tipo_cultivo}, Etapa: {etapa}")

            eto_decimal = Decimal(str(eto))
            print(f"Conversión de ETo a Decimal: {eto_decimal}, Tipo: {type(eto_decimal).__name__}")

            etc = eto_decimal * kc
            print(f"Cálculo de etc: ETo ({eto_decimal}) * kc ({kc}) = {etc}, Tipo: {type(etc).__name__}")

            evap = Evapotranspiracion.objects.create(
                fk_id_plantacion=plantacion,
                fecha=date.today(),
                eto=eto,
                etc=etc
            )

            serializer = LeerEvapotranspiracionSerializer(evap)
            return Response(serializer.data)
        except Plantacion.DoesNotExist:
            print("Plantación no encontrada")
            return Response({"error": "Plantación no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            print(f"Error en el cálculo de ETo: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except AttributeError:
            print("Faltan datos de sensores en las mediciones")
            return Response({"error": "Faltan datos de sensores"}, status=status.HTTP_400_BAD_REQUEST)
