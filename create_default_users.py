import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema_textil.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', 'admin@example.com')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin12345')

if not User.objects.filter(username=ADMIN_USERNAME).exists():
    User.objects.create_superuser(
        ADMIN_USERNAME,
        ADMIN_EMAIL,
        ADMIN_PASSWORD,
    )
    print(f'Created admin user: {ADMIN_USERNAME}')
else:
    print(f'Admin user already exists: {ADMIN_USERNAME}')
