from django.contrib import admin

from .models import Producto


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
	list_display = ('codigo', 'nombre', 'categoria', 'stock_unidad', 'activo', 'publicado', 'destacado')
	list_filter = ('activo', 'publicado', 'destacado', 'categoria')
	search_fields = ('codigo', 'nombre', 'detalle')

# Register your models here.
