#!/usr/bin/env bash
set -e

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
python manage.py migrate

# Recopilar archivos estáticos
python manage.py collectstatic --noinput

# Crear superusuario por defecto si falta
python create_default_users.py || true
