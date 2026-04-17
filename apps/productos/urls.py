from django.urls import path

from .views import (
    ajustar_stock,
    crear_producto,
    editar_producto,
    eliminar_producto,
    listar_productos,
    toggle_destacado,
    toggle_publicado,
)

app_name = 'productos'

urlpatterns = [
    path('', listar_productos, name='listar_productos'),
    path('crear/', crear_producto, name='crear_producto'),
    path('<int:producto_id>/editar/', editar_producto, name='editar_producto'),
    path('<int:producto_id>/eliminar/', eliminar_producto, name='eliminar_producto'),
    path('<int:producto_id>/toggle-destacado/', toggle_destacado, name='toggle_destacado'),
    path('<int:producto_id>/toggle-publicado/', toggle_publicado, name='toggle_publicado'),
    path('<int:producto_id>/ajustar-stock/', ajustar_stock, name='ajustar_stock'),
]
