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
from rest_framework_simplejwt.tokens import RefreshToken

class UsuarioViewSet(ModelViewSet):
    def get_parser_classes(self):
        if self.action == 'carga_masiva':
            return [MultiPartParser]
        return [JSONParser]

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def carga_masiva(self, request):
        archivo = request.FILES.get('file')

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
                    campos_requeridos = ["nombre", "apellido", "identificacion", "email"]
                    if any(campo not in fila or not fila[campo] for campo in campos_requeridos):
                        errores.append({
                            "identificacion": fila.get("identificacion", "N/A"),
                            "error": f"Faltan campos: {', '.join([c for c in campos_requeridos if c not in fila or not fila[c]])}"
                        })
                        continue

                    identificacion = str(fila["identificacion"])
                    email = fila["email"]

                    if Usuarios.objects.filter(email=email).exists():
                        errores.append({
                            "email": email,
                            "error": "Ya existe un usuario con este correo."
                        })
                        continue

                    rol, _ = Rol.objects.get_or_create(rol="Invitado")

                    user_data = {
                        "nombre": fila["nombre"],
                        "apellido": fila["apellido"],
                        "identificacion": identificacion,
                        "email": email,
                        "password": identificacion,
                        "fk_id_rol": rol.id,
                        "ficha": None,
                    }

                    serializer = EscribirUsuarioSerializer(data=user_data, context={'request': request})
                    if serializer.is_valid():
                        serializer.save()
                        creados.append(email)
                    else:
                        errores.append({
                            "email": email,
                            "errores": serializer.errors
                        })

                except Exception as e:
                    errores.append({
                        "email": fila.get("email", ""),
                        "error": str(e)
                    })

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
            serializer.save(is_staff=True, is_superuser=True)
        else:
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

                refresh = RefreshToken.for_user(usuario)
                refresh["identificacion"] = usuario.identificacion
                refresh["nombre"] = usuario.nombre
                refresh["apellido"] = usuario.apellido
                refresh["email"] = usuario.email
                refresh["rol"] = usuario.fk_id_rol.rol if usuario.fk_id_rol else None
                refresh["ficha"] = usuario.ficha.numero_ficha if usuario.ficha else None
                if usuario.img:
                    img_url = request.build_absolute_uri(usuario.img.url) if request else usuario.img.url
                else:
                    img_url = request.build_absolute_uri('/media/imagenes/defecto.png') if request else '/media/imagenes/defecto.png'
                refresh["img_url"] = img_url

                access = str(refresh.access_token)
                return Response({"access": access}, status=status.HTTP_200_OK)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        request = self.context.get("request")
        user = self.user

        refresh = self.get_token(user)
        refresh['identificacion'] = user.identificacion
        refresh['nombre'] = user.nombre
        refresh['apellido'] = user.apellido
        refresh['email'] = user.email
        refresh['rol'] = user.fk_id_rol.rol if user.fk_id_rol else None
        refresh['ficha'] = user.ficha.numero_ficha if user.ficha else None
        if user.img:
            img_url = request.build_absolute_uri(user.img.url) if request else user.img.url
        else:
            img_url = request.build_absolute_uri('/media/imagenes/defecto.png') if request else '/media/imagenes/defecto.png'
        refresh['img_url'] = img_url

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
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
