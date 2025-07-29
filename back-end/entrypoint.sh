#!/bin/sh
set -e

# Esperar que la base de datos esté lista
if [ "$DATABASE" = "postgres" ]; then
    echo "Esperando a que la base de datos esté lista..."
    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.5
    done
    echo "¡Base de datos conectada!"
fi

# Crear migraciones y aplicarlas correctamente
echo "Generando archivos de migraciones..."
python manage.py makemigrations --noinput

echo "Aplicando todas las migraciones..."
python manage.py migrate --noinput

# Iniciar servidor Django
echo "Iniciando servidor en 0.0.0.0:8000..."
exec python manage.py runserver 0.0.0.0:8000
