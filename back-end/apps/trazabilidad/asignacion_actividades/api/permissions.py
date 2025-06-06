from rest_framework.permissions import BasePermission
from apps.trazabilidad.asignacion_actividades.models import Asignacion_actividades

class IsUsuarioAsignacion(BasePermission):
    def has_permission(self, request, view):
        # Obtener el rol del usuario desde fk_id_rol
        user_role = getattr(request.user.fk_id_rol, 'rol', None)

        # Definir permisos por rol
        permisos_por_rol = {
            "Administrador": ["GET", "POST", "PUT", "PATCH", "DELETE"],
            "Instructor": ["GET", "POST", "PUT", "PATCH", "DELETE"],
            "Pasante": ["GET", "PUT", "POST", "PATCH"],
            "Aprendiz": ["GET", "PUT", "POST", "PATCH"]
        }

        # Verificar si el método HTTP está permitido para el rol del usuario
        if request.method not in permisos_por_rol.get(user_role, []):
            return False

        return True

    def has_object_permission(self, request, view, obj):
        # Obtener el rol del usuario desde fk_id_rol
        user_role = getattr(request.user.fk_id_rol, 'rol', None)

        # Para la acción 'finalizar', verificar que el usuario esté en fk_identificacion
        if view.action == 'finalizar':
            return request.user.is_authenticated and obj.fk_identificacion.filter(id=request.user.id).exists()

        # Para acciones de escritura (PUT, PATCH, DELETE), solo Administrador e Instructor
        if request.method in ["PUT", "PATCH", "DELETE"]:
            return user_role in ["Administrador", "Instructor"]

        # Para POST (excepto 'finalizar', que ya se manejó arriba), solo Administrador e Instructor
        if request.method == "POST" and view.action != 'finalizar':
            return user_role in ["Administrador", "Instructor"]

        # Para GET, todos los roles permitidos pueden ver
        if request.method == "GET":
            return True

        # Para cualquier otro caso, denegar acceso
        return False
