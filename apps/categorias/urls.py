from django.urls import path

from .views import crear_categoria, editar_categoria, eliminar_categoria, listar_categorias

app_name = 'categorias'

urlpatterns = [
    path('', listar_categorias, name='listar_categorias'),
    path('crear/', crear_categoria, name='crear_categoria'),
    path('<int:categoria_id>/editar/', editar_categoria, name='editar_categoria'),
    path('<int:categoria_id>/eliminar/', eliminar_categoria, name='eliminar_categoria'),
]
