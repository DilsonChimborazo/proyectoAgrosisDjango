from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from apps.usuarios.usuario.models import Usuarios
from apps.usuarios.rol.api.serializer import RolSerializer
from apps.usuarios.ficha.api.serializer import FichaSerializer
from apps.usuarios.ficha.models import Ficha    

class LeerUsuarioSerializer(serializers.ModelSerializer):
    fk_id_rol = RolSerializer()
    ficha = FichaSerializer()
    img_url = serializers.SerializerMethodField()

    class Meta:
        model = Usuarios
        fields = '__all__'

    def get_img_url(self, obj):
        request = self.context.get('request')
        if obj.img:
            return request.build_absolute_uri(obj.img.url)
        return request.build_absolute_uri('/media/imagenes/defecto.png')


class EscribirUsuarioSerializer(ModelSerializer):
    img = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)

    ficha = serializers.SlugRelatedField(
        slug_field='numero_ficha',
        queryset=Ficha.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Usuarios
        fields = '__all__'
        extra_kwargs = {
            'is_active': {'required': False},
            'password': {'write_only': True},
            'img': {'required': False},
        }

    def create(self, validated_data):
        groups_data = validated_data.pop('groups', None)
        user_permissions_data = validated_data.pop('user_permissions', None)

        password = validated_data.pop('password', None)

        usuario = Usuarios(**validated_data)

        if password:
            usuario.set_password(password)

        usuario.is_active = True  # 👈 Activar el usuario

        usuario.save()

        if groups_data is not None:
            usuario.groups.set(groups_data)
        if user_permissions_data is not None:
            usuario.user_permissions.set(user_permissions_data)

        return usuario

    def update(self, instance, validated_data):
        print("VALIDATED DATA EN UPDATE:", validated_data)
    
        password = validated_data.pop('password', None)
        if password:
            print("SETEANDO CONTRASEÑA HASH")
            instance.set_password(password)
    
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
    
        instance.save()
        return instance