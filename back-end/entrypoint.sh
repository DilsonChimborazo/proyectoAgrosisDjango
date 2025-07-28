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

# Verificar si la migración nomina.0002_initial ya fue aplicada
echo "Verificando migración nomina.0002_initial..."
if python manage.py showmigrations | grep -q "\[ \] nomina 0002_initial"; then
    echo "Marcando nomina.0002_initial como aplicada por columnas ya existentes..."
    python manage.py migrate nomina 0002_initial --fake --noinput
fi

# Aplicar migraciones pendientes
echo "Aplicando migraciones..."
python manage.py migrate --noinput

# Iniciar servidor Django
echo "Iniciando servidor en 0.0.0.0:8000..."
exec python manage.py runserver 0.0.0.0:8000
