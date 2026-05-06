#!/usr/bin/env bash
set -e

PORT=${PORT:-8000}

# Start application
exec gunicorn sistema_textil.wsgi:application --bind 0.0.0.0:$PORT
