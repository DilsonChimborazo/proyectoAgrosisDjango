from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from apps.usuarios.usuario.models import Usuarios
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ForgotPasswordView(APIView):
    """ Vista para solicitar recuperación de contraseña """
    def post(self, request):
        email = request.data.get('email')
        try:
            user = Usuarios.objects.get(email=email)
        except Usuarios.DoesNotExist:
            return Response({"error": "El usuario no existe"}, status=status.HTTP_400_BAD_REQUEST)

        # Generar token
        token = default_token_generator.make_token(user)
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{user.pk}/{token}/"

        # Enviar correo
        send_mail(
            "Restablecer contraseña",
            f"Hola, usa este enlace para restablecer tu contraseña: {reset_url}",
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        return Response({"message": "Correo enviado"}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    """ Vista para cambiar la contraseña usando el token """
    def patch(self, request, uid, token):
        try:
            user = Usuarios.objects.get(pk=uid)
        except Usuarios.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Token inválido o expirado"}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get('password')
        user.set_password(new_password)
        user.save()

        return Response({"message": "Contraseña restablecida con éxito"}, status=status.HTTP_200_OK)
