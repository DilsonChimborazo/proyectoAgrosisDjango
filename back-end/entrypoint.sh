#!/bin/sh
set -e  # Detener el script si algo falla

# Esperar a que la base de datos esté lista
if [ "$DATABASE" = "postgres" ]; then
    echo "Esperando a que la base de datos esté lista..."
    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.5
    done
    echo "¡Base de datos conectada!"
fi

# Crear migraciones si no existen
echo "Generando archivos de migraciones..."
python manage.py makemigrations --noinput

echo "Marcando migraciones iniciales como aplicadas..."
python manage.py migrate nomina 0001_initial --fake
python manage.py migrate stock 0001_initial --fake
python manage.py migrate notificacion 0001_initial --fake

# Aplicar migraciones pendientes
echo "Aplicando migraciones..."
python manage.py migrate --noinput


# Iniciar servidor Django
echo "Iniciando servidor en 0.0.0.0:8000..."
exec python manage.py runserver 0.0.0.0:8000
