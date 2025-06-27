import asyncio
import json
import random
import websockets
from asgiref.sync import sync_to_async
from apps.iot.mide.models import Mide
from apps.iot.sensores.models import Sensores
from apps.iot.eras.models import Eras

async def obtener_sensores():
    """ Obtiene la lista de sensores disponibles """
    sensores = await sync_to_async(lambda: list(Sensores.objects.values("id")))()
    return sensores

async def obtener_eras():
    """ Obtiene la lista de eras disponibles """
    eras = await sync_to_async(lambda: list(Eras.objects.values("id")))()
    return eras

async def registrar_medicion(sensor_id, era_id, valor):
    """ Guarda una nueva medición en la base de datos """
    await sync_to_async(Mide.objects.create)(
        fk_id_sensor_id=sensor_id,
        fk_id_era_id=era_id,
        valor_medicion=valor
    )

async def send_random_data():
    """ Simula el envío de datos de sensores a WebSockets y registra en la BD """
    uri = "ws://localhost:8000/ws/api/mide/"
    
    while True:
        try:
            async with websockets.connect(uri) as websocket:
                while True:
                    sensores = await obtener_sensores()
                    eras = await obtener_eras()

                    if sensores and eras:
                        sensor = random.choice(sensores)["id"]
                        era = random.choice(eras)["id"]
                        valor = round(random.uniform(0, 100), 2)

                        data = {
                            "fk_id_sensor": sensor,
                            "fk_id_era": era,
                            "valor_medicion": valor,
                        }

                        # Enviar datos al WebSocket
                        await websocket.send(json.dumps(data))

                        # Registrar medición en la BD
                        await registrar_medicion(sensor, era, valor)

                    await asyncio.sleep(10)  # Enviar datos cada 10 segundos

        except websockets.exceptions.ConnectionClosedError:
            await asyncio.sleep(5)
        except Exception as e:
            print(f"❌ Error en el simulador: {e}")
            await asyncio.sleep(5)  # Esperar antes de reintentar

if __name__ == "__main__":
    asyncio.run(send_random_data())
