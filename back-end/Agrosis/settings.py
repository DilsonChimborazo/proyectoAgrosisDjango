"""
Django settings for Agrosis project.

Generated by 'django-admin startproject' using Django 5.1.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-i3#3g)h1k+8vnmb@u_4$=%)flbpo1n6i2hx16*2v7piui_^nl6'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django_extensions',
    "daphne",
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'drf_yasg',
    'channels',
    
    #usuario
    'rest_framework_simplejwt',
    'apps.usuarios.usuario',
    'apps.usuarios.rol',

    #apps de iot 
    'apps.iot.sensores',
    'apps.iot.mide',
    'apps.iot.lote',
    'apps.iot.eras',
    'apps.iot.ubicacion',

    #Trazabilidad 1 Pacho
    'apps.trazabilidad.realiza',
    'apps.trazabilidad.especie',
    'apps.trazabilidad.tipo_cultivo',
    'apps.trazabilidad.semillero',
    'apps.trazabilidad.asignacion_actividades',
    'apps.trazabilidad.programacion',
    'apps.trazabilidad.notificacion',
    'apps.trazabilidad.calendario_lunar',

    #FINANZAS
    'apps.finanzas.genera',
    'apps.finanzas.produccion',
    'apps.finanzas.venta',
    
    #Trazabilidad 2 xiomara
    'apps.trazabilidad.actividad',
    'apps.trazabilidad.control_fitosanitario',
    'apps.trazabilidad.cultivo',
    'apps.trazabilidad.desarrollan',
    'apps.trazabilidad.pea',
    'apps.trazabilidad.plantacion',
    'apps.trazabilidad.residuos',
    'apps.trazabilidad.tipo_residuos',

    #Inventario
    'apps.inventario.control_usa_insumo',
    'apps.inventario.herramientas',
    'apps.inventario.insumo',
    'apps.inventario.requiere',
    'apps.inventario.utiliza',
]


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5174",
]

ROOT_URLCONF = 'Agrosis.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ASGI application (para Django Channels)
ASGI_APPLICATION = 'Agrosis.asgi.application'

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",  # Solo para desarrollo
    },
}


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'agrosis',  
        'USER': 'postgres',                
        'PASSWORD': 'adso2024',          
        'HOST': 'localhost',                  
        'PORT': '5432',  
        'OPTIONS': {
            'client_encoding': 'UTF8',
        },                     
    }
}



# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = './static'

AUTH_USER_MODEL = 'usuario.Usuarios'  # 'usuario' es el nombre de la app y 'Usuario' es el nombre del modelo

REST_FRAMEWORK = {
    
    'DEFAULT_AUTHENTICATION_CLASSES': (
        
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}



# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
