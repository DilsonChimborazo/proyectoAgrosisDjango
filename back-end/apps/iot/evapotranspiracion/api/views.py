from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from apps.iot.mide.models import Mide
from apps.iot.eras.models import Eras
from apps.iot.evapotranspiracion.models import Evapotranspiracion
from apps.iot.evapotranspiracion.api.utils import calcular_eto
from datetime import date
from decimal import Decimal

class EvapotranspiracionViewSet(ViewSet):
    def retrieve(self, request, pk=None):
        try:
            era = Eras.objects.get(id=pk)
            if not era.fk_id_cultivo:
                return Response({"error": "La era no tiene un cultivo asociado"}, status=status.HTTP_400_BAD_REQUEST)

            mediciones = Mide.objects.filter(
                fk_id_era_id=pk,
                fecha_medicion__date=date.today()
            )

            if not mediciones.exists():
                return Response({"error": "No hay mediciones para hoy"}, status=status.HTTP_404_NOT_FOUND)

            eto = calcular_eto(mediciones)
            kc = era.fk_id_cultivo.kc if era.fk_id_cultivo.kc is not None else Decimal('1.0')
            etc = eto * kc

            evap = Evapotranspiracion.objects.create(
                fk_id_era=era,
                fk_id_cultivo=era.fk_id_cultivo,
                fecha=date.today(),
                eto=eto,
                etc=etc
            )

            return Response({
                "era_id": pk,
                "cultivo": era.fk_id_cultivo.nombre_cultivo,
                "eto": float(eto),
                "etc": float(etc),
                "fecha": str(evap.fecha)  # Corrección
            })
        except Eras.DoesNotExist:
            return Response({"error": "Era no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except AttributeError:
            return Response({"error": "Faltan datos de sensores"}, status=status.HTTP_400_BAD_REQUEST)