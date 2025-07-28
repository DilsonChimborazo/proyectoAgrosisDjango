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

# 🔴 ELIMINAR MIGRACIONES PROBLEMÁTICAS AQUÍ
echo "Eliminando migraciones no deseadas..."
for app in nomina stock notificacion; do
  if [ -d "$app/migrations" ]; then
    echo "Limpiando migraciones en $app..."
    find "$app/migrations" -type f -name "0002_*.py" -exec rm -f {} +
    find "$app/migrations" -type f -name "0002_*.pyc" -exec rm -f {} +
  fi
done

# Aplicar migraciones pendientes
echo "Aplicando migraciones..."
python manage.py migrate --noinput


# Iniciar servidor Django
echo "Iniciando servidor en 0.0.0.0:8000..."
exec python manage.py runserver 0.0.0.0:8000
