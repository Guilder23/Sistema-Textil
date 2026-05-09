#!/usr/bin/env bash
set -e

# Instalar dependencias
pip install -r requirements.txt

# Asegurar directorios media persistentes (solo en producción)
if [ "$RENDER" = "true" ]; then
    echo "Configurando almacenamiento persistente para archivos media..."
    mkdir -p /opt/render/project/src/media
    mkdir -p /opt/render/project/src/media/productos
    mkdir -p /opt/render/project/src/media/categorias
    chmod 755 /opt/render/project/src/media
    chmod 755 /opt/render/project/src/media/productos
    chmod 755 /opt/render/project/src/media/categorias
    echo "Directorios media configurados para persistencia"
fi

# Ejecutar migraciones
python manage.py migrate

# Recopilar archivos estáticos
python manage.py collectstatic --noinput

# Crear superusuario por defecto si falta
python create_default_users.py || true
