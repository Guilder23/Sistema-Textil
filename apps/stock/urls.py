from django.urls import path

from .views import control_stock

app_name = 'stock'

urlpatterns = [
    path('', control_stock, name='control_stock'),
]
