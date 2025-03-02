from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from apps.usuarios.rol.models import Rol
from django.contrib.auth.hashers import make_password

class UsuarioManager(BaseUserManager):
    def create_user(self, identificacion, password=None, **extra_fields):
        if not identificacion:
            raise ValueError("La identificación es obligatoria")

        user = self.model(identificacion=identificacion, **extra_fields)
        user.set_password(password)  
        user.save(using=self._db)   
        return user

    def create_superuser(self, identificacion, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(identificacion, password, **extra_fields)

class Usuarios(AbstractUser):
    username = None  # Eliminamos username porque usaremos identificación
    identificacion = models.CharField(max_length=20, unique=True)  
    fk_id_rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True)
    nombre = models.CharField(max_length=30)
    apellido = models.CharField(max_length=30)
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'identificacion'  
    REQUIRED_FIELDS = ['nombre', 'apellido', 'email']  

    objects = UsuarioManager()  

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.identificacion}"