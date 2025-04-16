from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def webhook_reporte_egresos(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Procesar los datos recibidos
            print("Datos recibidos en el webhook:", data)
            
            # Aquí podrías agregar lógica para registrar en la base de datos
            return JsonResponse({'message': 'Webhook recibido correctamente', 'status': 'success'}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Error en el formato JSON', 'status': 'error'}, status=400)
    
    return JsonResponse({'message': 'Método no permitido', 'status': 'error'}, status=405)
