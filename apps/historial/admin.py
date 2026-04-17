from django.contrib import admin

from .models import CambioProducto


@admin.register(CambioProducto)
class CambioProductoAdmin(admin.ModelAdmin):
	list_display = ('fecha', 'accion', 'producto', 'usuario')
	list_filter = ('accion', 'fecha')
	search_fields = ('descripcion',)

# Register your models here.
