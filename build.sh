#!/usr/bin/env bash
set -e

# Instalar dependencias
pip install -r requirements.txt

# Sistema de backup/restore para archivos media
echo "RENDER environment variable: $RENDER"
echo "Checking for Render environment..."

if [ "$RENDER_SERVICE_ID" != "" ] || [ "$RENDER" = "true" ]; then
    if [ -n "$CLOUDINARY_CLOUD_NAME" ]; then
        echo "☁️ Cloudinary configurado — se omiten directorios media locales y backup en disco."
    else
        echo "🔄 Configurando sistema de persistencia para archivos media..."

        # Crear directorios base
        mkdir -p /opt/render/project/src/media
        mkdir -p /opt/render/project/src/media/productos
        mkdir -p /opt/render/project/src/media/categorias

        # Crear directorio de backup persistente
        mkdir -p /opt/render/project/backups/media

        # Establecer permisos
        chmod 755 /opt/render/project/src/media
        chmod 755 /opt/render/project/src/media/productos
        chmod 755 /opt/render/project/src/media/categorias
        chmod 755 /opt/render/project/backups/media

        # Restaurar desde backup si existe
        if [ -d "/opt/render/project/backups/media" ] && [ "$(ls -A /opt/render/project/backups/media)" ]; then
            echo "🔄 Restaurando archivos desde backup..."
            cp -r /opt/render/project/backups/media/* /opt/render/project/src/media/ 2>/dev/null || true
            echo "✅ Restauración completada"
        fi

        # Verificar configuración
        if [ -d "/opt/render/project/src/media" ]; then
            echo "✅ Directorios media configurados"
            echo "📁 Contenido actual:"
            ls -la /opt/render/project/src/media/ || echo "Directorio vacío"
        else
            echo "❌ Error: No se pudo crear el directorio media"
        fi
    fi
else
    echo "Entorno de desarrollo - omitiendo configuración de disco persistente"
fi

# Ejecutar migraciones
python manage.py migrate

# Recopilar archivos estáticos
python manage.py collectstatic --noinput

# Crear superusuario por defecto si falta
python create_default_users.py || true

# Hacer backup después de la configuración (solo en producción, almacenamiento local)
if [ "$RENDER_SERVICE_ID" != "" ] || [ "$RENDER" = "true" ]; then
    if [ -n "$CLOUDINARY_CLOUD_NAME" ]; then
        echo "☁️ Cloudinary activo — no se ejecuta backup_media en disco."
    else
        echo "💾 Creando backup de archivos media..."
        python backup_media.py
    fi
fi
