from rest_framework.permissions import BasePermission

class IsUsuarioReadOnly(BasePermission):
    def has_permission(self, request, view):
        user_role = getattr(request.user.fk_id_rol, 'rol', None) 
        
        permisos_por_rol = {
            "administrador": ["GET", "POST", "PUT", "DELETE"],
            "instructor": ["GET", "POST", "PUT", "DELETE"],
            "pasante": ["GET", "POST", "PUT"],
            "aprendiz": ["GET", "POST", "PUT"]
        }

        return request.method in permisos_por_rol.get(user_role, [])
