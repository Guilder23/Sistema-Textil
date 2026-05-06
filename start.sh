#!/usr/bin/env bash
set -e

# Ensure static files are available
python manage.py collectstatic --noinput || true

# Ensure admin user exists
python create_default_users.py || true

# Start application
exec gunicorn sistema_textil.wsgi:application
