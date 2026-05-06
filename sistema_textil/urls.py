"""
URL configuration for sistema_textil project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('', include(('apps.core.urls', 'core'), namespace='core')),
    path('productos/', include(('apps.productos.urls', 'productos'), namespace='productos')),
    path('categorias/', include(('apps.categorias.urls', 'categorias'), namespace='categorias')),
    path('destacados/', include(('apps.destacados.urls', 'destacados'), namespace='destacados')),
    path('stock/', include(('apps.stock.urls', 'stock'), namespace='stock')),
    path('estadisticas/', include(('apps.estadisticas.urls', 'estadisticas'), namespace='estadisticas')),
    path('historial/', include(('apps.historial.urls', 'historial'), namespace='historial')),
    path('admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    ]
