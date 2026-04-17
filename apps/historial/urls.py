from django.urls import path

from .views import historial_cambios

app_name = 'historial'

urlpatterns = [
    path('', historial_cambios, name='historial_cambios'),
]
