#!/usr/bin/env python
import os
import shutil
import sys
from django.conf import settings


def _media_files_are_local():
    backend = settings.STORAGES.get('default', {}).get('BACKEND', '')
    return 'cloudinary' not in backend.lower()


def backup_media_files():
    """Script para respaldar archivos media antes del deploy"""
    if not _media_files_are_local():
        print("[Cloudinary] Media remota; se omite backup/restauracion en disco.")
        return

    # Directorio actual de media
    current_media = settings.MEDIA_ROOT
    
    # Directorio de backup (persistente en Render)
    backup_dir = '/opt/render/project/backups/media'
    
    current_media = str(current_media)
    if not current_media.strip():
        print("[aviso] MEDIA_ROOT no definido; no se puede respaldar en disco.")
        return

    if os.environ.get('RENDER_SERVICE_ID'):
        print("Creando backup de archivos media...")
        
        # Crear directorio de backup
        os.makedirs(backup_dir, exist_ok=True)
        
        if os.path.exists(current_media):
            # Copiar archivos media al backup
            for item in os.listdir(current_media):
                s = os.path.join(current_media, item)
                d = os.path.join(backup_dir, item)
                if os.path.isdir(s):
                    shutil.copytree(s, d, dirs_exist_ok=True)
                else:
                    shutil.copy2(s, d)
            
            print(f"Backup completado en: {backup_dir}")
        else:
            print("[aviso] No hay directorio media para respaldar")
            
        # Restaurar desde backup si es necesario
        if not os.path.exists(current_media) or not os.listdir(current_media):
            print("Restaurando archivos desde backup...")
            os.makedirs(current_media, exist_ok=True)
            
            for item in os.listdir(backup_dir):
                s = os.path.join(backup_dir, item)
                d = os.path.join(current_media, item)
                if os.path.isdir(s):
                    shutil.copytree(s, d, dirs_exist_ok=True)
                else:
                    shutil.copy2(s, d)
            
            print("Restauracion completada")

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema_textil.settings')
    import django
    django.setup()
    
    backup_media_files()
