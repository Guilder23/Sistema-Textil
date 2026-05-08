from django.contrib import admin

from .models import Producto, ProductoImagen


class ProductoImagenInline(admin.TabularInline):
	model = ProductoImagen
	extra = 1


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
	inlines = [ProductoImagenInline]
	list_display = ('codigo', 'nombre', 'categoria', 'sexo', 'stock_unidad', 'activo', 'publicado', 'destacado')
	list_filter = ('activo', 'publicado', 'destacado', 'categoria', 'sexo')
	search_fields = ('codigo', 'nombre', 'detalle')

# Register your models here.
