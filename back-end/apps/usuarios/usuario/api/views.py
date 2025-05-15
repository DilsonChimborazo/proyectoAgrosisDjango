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
from rest_framework.parsers import MultiPartParser
import csv
import io
import pandas as pd


class UsuarioViewSet(ModelViewSet):

    #permission_classes = [IsAuthenticated] 

    parser_classes = [MultiPartParser]

    @action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
    def carga_masiva(self, request):
        archivo = request.FILES.get('file')
    
        if not archivo:
            return Response({'error': 'Debes subir un archivo'}, status=400)
    
        creados = []
        errores = []
    
        try:
            # Si el archivo es CSV
            if archivo.name.endswith('.csv'):
                data_set = archivo.read().decode('utf-8')
                io_string = io.StringIO(data_set)
                reader = csv.DictReader(io_string)
                filas = list(reader)
    
            # Si el archivo es Excel
            elif archivo.name.endswith('.xlsx'):
                df = pd.read_excel(archivo)
                filas = df.to_dict(orient='records')
    
            else:
                return Response({'error': 'Formato no soportado. Usa .csv o .xlsx'}, status=400)
    
            for fila in filas:
                try:
                    rol = Rol.objects.get(rol=fila["rol"])
                    ficha_id = fila.get("ficha")
                    ficha = Ficha.objects.get(id=ficha_id) if ficha_id else None
    
                    user_data = {
                        "identificacion": fila["identificacion"],
                        "email": fila["email"],
                        "password": fila["password"],
                        "nombre": fila["nombre"],
                        "apellido": fila["apellido"],
                        "fk_id_rol": rol.id,
                        "ficha": ficha.id if ficha else None,
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
            return Response({"error": str(e)}, status=500)  
        
    def get_queryset(self):
        """Retorna solo el usuario autenticado, excepto para los admins que ven todos"""
        if self.request.user.is_staff:
            return Usuarios.objects.all().order_by('id')
        return Usuarios.objects.filter(id=self.request.user.id)

    def get_serializer_class(self):
        """Retorna el serializador adecuado dependiendo de la acción"""
        if self.action in ['list', 'retrieve']:
            return LeerUsuarioSerializer
        return EscribirUsuarioSerializer

    def get_permissions(self):
        """Permite la creación del primer usuario sin autenticación y asegura que exista el rol Administrador"""

        if Rol.objects.count() == 0:
            Rol.objects.create(rol="Administrador")

        # Permitir la creación del primer usuario sin autenticación
        if self.action == "create" and Usuarios.objects.count() == 0:
            return [AllowAny()]

        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]

        return [IsAuthenticated()]

    def perform_create(self, serializer):
        """Asigna automáticamente permisos de admin al primer usuario"""
        if Usuarios.objects.count() == 0:
            serializer.save(is_staff=True, is_superuser=True)
        else:
            serializer.save()

    def get_serializer_context(self):
        """Agrega el request al contexto de los serializers"""
        return {'request': self.request}

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def activar(self, request, pk=None):
        """Activa un usuario"""
        usuario = self.get_object()
        if usuario.is_active:
            return Response({"message": "El usuario ya está activo."}, status=status.HTTP_400_BAD_REQUEST)
        usuario.is_active = True
        usuario.save()
        return Response({"message": "Usuario activado"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def desactivar(self, request, pk=None):
        """Desactiva un usuario"""
        usuario = self.get_object()
        if not usuario.is_active:
            return Response({"message": "El usuario ya está inactivo."}, status=status.HTTP_400_BAD_REQUEST)
        usuario.is_active = False
        usuario.save()
        return Response({"message": "Usuario desactivado"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get', 'put'], permission_classes=[IsAuthenticated])
    def img(self, request):
        """Permite al usuario autenticado ver y actualizar su perfil"""
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
    """Personaliza la respuesta del token JWT para incluir los datos del usuario"""

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        # ¡IMPORTANTE! Pasar el contexto con request
        data['user'] = LeerUsuarioSerializer(user, context=self.context).data
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada para la autenticación con JWT"""
    serializer_class = CustomTokenObtainPairSerializer