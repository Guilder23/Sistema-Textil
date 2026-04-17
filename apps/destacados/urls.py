from django.urls import path

from .views import listar_destacados

app_name = 'destacados'

urlpatterns = [
    path('', listar_destacados, name='listar_destacados'),
]
