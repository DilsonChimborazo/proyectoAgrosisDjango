from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from apps.usuarios.rol.models import Rol

class UsuarioManager(BaseUserManager):
    def create_user(self, identificacion, email, password=None, **extra_fields):
        if not identificacion:
            raise ValueError("La identificación es obligatoria")
        if not email:
            raise ValueError("El correo electrónico es obligatorio")

        email = self.normalize_email(email)
        user = self.model(identificacion=identificacion, email=email, **extra_fields)
        if password:
            user.set_password(password)  # 🔐 Encripta la contraseña antes de guardarla
        user.save(using=self._db)
        return user

    def create_superuser(self, identificacion, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(identificacion, email, password, **extra_fields)

class Usuarios(AbstractUser):
    username = None  
    identificacion = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True) 
    nombre = models.CharField(max_length=30)
    apellido = models.CharField(max_length=30)
    fk_id_rol = models.ForeignKey(Rol, on_delete=models.SET_NULL, null=True, blank=True)

    USERNAME_FIELD = 'identificacion'  
    REQUIRED_FIELDS = ['email', 'nombre', 'apellido']  

    objects = UsuarioManager()  

    def __str__(self):
        return f"{self.nombre} {self.apellido} - {self.fk_id_rol}"
