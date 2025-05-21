from itsdangerous import URLSafeTimedSerializer
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from django.utils.html import format_html
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

User = get_user_model()
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

def generar_link_recuperacion(usuario):
    """Genera un token encriptado con tiempo de expiración."""
    data = {"id": usuario.id, "token": default_token_generator.make_token(usuario)}
    token = serializer.dumps(data)
    return f"{settings.FRONTEND_URL}/resetearContrasena/?token={token}&id={usuario.id}"

@api_view(["POST"])
def solicitar_recuperacion(request):
    """Solicita la recuperación de contraseña y envía un email con el enlace."""
    email = request.data.get("email")

    if not email:
        return Response({"error": "El email es requerido"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        usuario = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    reset_link = generar_link_recuperacion(usuario)

    # Enviar correo en HTML con el token oculto visualmente
    html_content = format_html(
        """
        <p>Hola,</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
        <p><a href="{}" style="background-color:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Restablecer contraseña</a></p>
        <p>Este enlace expirará en 24 horas.</p>
        """,
        reset_link
    )

    email_message = EmailMessage(
        subject="Recuperación de contraseña",
        body=html_content,
        from_email=settings.EMAIL_HOST_USER,
        to=[email]
    )
    email_message.content_subtype = "html"
    email_message.send()

    return Response({"message": "Se ha enviado un correo con instrucciones"}, status=status.HTTP_200_OK)

def validar_token(token):
    """Decodifica y valida el token de recuperación."""
    try:
        data = serializer.loads(token, max_age=86400)
        usuario = User.objects.get(id=data["id"])
        if default_token_generator.check_token(usuario, data["token"]):
            return usuario
    except Exception:
        return None

@api_view(["POST"])
def resetear_contraseña(request):
    """Valida el token y restablece la contraseña."""
    token = request.data.get("token")
    nueva_contraseña = request.data.get("password")

    if not token or not nueva_contraseña:
        return Response({"error": "Datos incompletos"}, status=status.HTTP_400_BAD_REQUEST)

    usuario = validar_token(token)
    if not usuario:
        return Response({"error": "Token inválido o expirado"}, status=status.HTTP_400_BAD_REQUEST)

    usuario.set_password(nueva_contraseña)
    usuario.save()

    return Response({"message": "Contraseña actualizada correctamente"}, status=status.HTTP_200_OK)