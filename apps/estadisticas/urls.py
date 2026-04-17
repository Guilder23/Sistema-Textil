from django.urls import path

from .views import estadisticas_basicas

app_name = 'estadisticas'

urlpatterns = [
    path('', estadisticas_basicas, name='estadisticas_basicas'),
]
