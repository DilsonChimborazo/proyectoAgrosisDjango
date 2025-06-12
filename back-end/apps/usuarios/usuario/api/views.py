from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.usuarios.usuario.models import Usuarios
from apps.usuarios.usuario.api.serializer import LeerUsuarioSerializer, EscribirUsuarioSerializer
from apps.usuarios.rol.models import Rol
from apps.usuarios.ficha.models import Ficha
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, JSONParser
import csv
import io
import pandas as pd
import traceback
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class UsuarioViewSet(ModelViewSet):
    # No defines parser_classes aquí globalmente, lo haremos dinámicamente
    # parser_classes = [MultiPartParser, JSONParser]

    def get_parser_classes(self):
        # Usar MultiPartParser solo para carga_masiva (espera archivos)
        if self.action == 'carga_masiva':
            return [MultiPartParser]
        # Para todo lo demás usar JSONParser (espera json)
        return [JSONParser]

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def carga_masiva(self, request):
        archivo = request.FILES.get('file')
        print("Archivos recibidos:", request.FILES)

        if not archivo:
            return Response({'error': 'Debes subir un archivo'}, status=400)

        creados = []
        errores = []

        try:
            if archivo.name.endswith('.csv'):
                data_set = archivo.read().decode('utf-8')
                io_string = io.StringIO(data_set)
                reader = csv.DictReader(io_string)
                filas = list(reader)

            elif archivo.name.endswith('.xlsx'):
                df = pd.read_excel(archivo)
                filas = df.to_dict(orient='records')

            else:
                return Response({'error': 'Formato no soportado. Usa .csv o .xlsx'}, status=400)

            for fila in filas:
                try:
                    rol = Rol.objects.get(rol=fila["rol"])
                    numero_ficha = fila.get("ficha")
                    ficha = Ficha.objects.get(numero_ficha=numero_ficha) if numero_ficha else None

                    user_data = {
                        "identificacion": fila["identificacion"],
                        "email": fila["email"],
                        "password": fila["password"],
                        "nombre": fila["nombre"],
                        "apellido": fila["apellido"],
                        "fk_id_rol": rol.id,
                        "ficha": ficha.numero_ficha if ficha else None,
                    }

                    serializer = EscribirUsuarioSerializer(data=user_data, context={'request': request})
                    if serializer.is_valid():
                        serializer.save()
                        creados.append(fila["email"])
                    else:
                        errores.append({"email": fila["email"], "errores": serializer.errors})

                except Rol.DoesNotExist:
                    errores.append({"email": fila.get("email", ""), "error": f"Rol '{fila['rol']}' no existe"})
                except Ficha.DoesNotExist:
                    errores.append({"email": fila.get("email", ""), "error": f"Ficha ID '{fila['ficha']}' no existe"})
                except Exception as e:
                    errores.append({"email": fila.get("email", ""), "error": str(e)})

            return Response({"creados": creados, "errores": errores}, status=201)

        except Exception as e:
            print("Error general en carga masiva:", e)
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)

    def get_queryset(self):
        if self.request.user.is_staff:
            return Usuarios.objects.all().order_by('id')
        return Usuarios.objects.filter(id=self.request.user.id)

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return LeerUsuarioSerializer
        return EscribirUsuarioSerializer

    def get_permissions(self):
        if Rol.objects.count() == 0:
            Rol.objects.create(rol="Administrador")

        if self.action == "create" and Usuarios.objects.count() == 0:
            return [AllowAny()]
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]

        return [IsAuthenticated()]

    def perform_create(self, serializer):
        if Usuarios.objects.count() == 0:
            # El primer usuario semilla
            serializer.save(is_staff=True, is_superuser=True)
        else:
            # Los demás usuarios: revisa si tienen rol de Administrador
            rol_id = self.request.data.get("fk_id_rol")
    
            try:
                rol = Rol.objects.get(id=rol_id)
                es_admin = rol.rol == "Administrador"
            except Rol.DoesNotExist:
                es_admin = False
    
            serializer.save(is_staff=es_admin)

    def get_serializer_context(self):
        return {'request': self.request}

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def activar(self, request, pk=None):
        usuario = self.get_object()
        if usuario.is_active:
            return Response({"message": "El usuario ya está activo."}, status=status.HTTP_400_BAD_REQUEST)
        usuario.is_active = True
        usuario.save()
        return Response({"message": "Usuario activado"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def desactivar(self, request, pk=None):
        usuario = self.get_object()
    
        if not usuario.is_active:
            return Response({"message": "El usuario ya está inactivo."}, status=status.HTTP_400_BAD_REQUEST)
    
        usuario.is_active = False
        usuario.save()
    
        # 🚨 Enviar notificación por WebSocket al usuario desactivado
        notificar_usuario_desactivado(usuario.id)
    
        return Response({"message": "Usuario desactivado"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get', 'put'], permission_classes=[IsAuthenticated])
    def img(self, request):
        usuario = request.user

        if request.method == 'GET':
            serializer = LeerUsuarioSerializer(usuario, context={'request': request})
            return Response(serializer.data)

        elif request.method == 'PUT':
            serializer = EscribirUsuarioSerializer(usuario, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(LeerUsuarioSerializer(usuario, context={'request': request}).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['user'] = LeerUsuarioSerializer(user, context=self.context).data
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

def notificar_usuario_desactivado(usuario_id):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{usuario_id}",
        {
            "type": "desactivar_usuario",
            "message": "Tu cuenta ha sido desactivada por un administrador.",
        }
    )