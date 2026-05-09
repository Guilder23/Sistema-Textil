#!/usr/bin/env python
import os
import shutil
import sys
from django.conf import settings
from datetime import datetime

def scheduled_backup():
    """Backup programado de archivos media"""
    
    if not os.environ.get('RENDER_SERVICE_ID'):
        print("Entorno de desarrollo - omitiendo backup programado")
        return
    
    print(f"🕐 [{datetime.now()}] Iniciando backup programado...")
    
    current_media = settings.MEDIA_ROOT
    backup_dir = '/opt/render/project/backups/media'
    
    # Crear backup
    if os.path.exists(current_media) and os.path.exists(current_media):
        os.makedirs(backup_dir, exist_ok=True)
        
        # Limpiar backup anterior
        if os.path.exists(backup_dir):
            shutil.rmtree(backup_dir)
        os.makedirs(backup_dir)
        
        # Copiar archivos actuales
        for item in os.listdir(current_media):
            s = os.path.join(current_media, item)
            d = os.path.join(backup_dir, item)
            if os.path.isdir(s):
                shutil.copytree(s, d, dirs_exist_ok=True)
            else:
                shutil.copy2(s, d)
        
        print(f"✅ Backup programado completado: {len(os.listdir(backup_dir))} elementos")
    else:
        print("⚠️ No hay archivos para respaldar")

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema_textil.settings')
    import django
    django.setup()
    
    scheduled_backup()
