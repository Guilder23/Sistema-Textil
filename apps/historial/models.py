from django.db import models


class CambioProducto(models.Model):
	ACCION_CHOICES = [
		('CREAR', 'Crear'),
		('EDITAR', 'Editar'),
		('ELIMINAR', 'Eliminar'),
		('STOCK', 'Ajuste de stock'),
		('DESTACAR', 'Destacar producto'),
		('Q_DESTACAR', 'Quitar destacado'),
		('PUBLICAR', 'Publicar producto'),
		('Q_PUBLICAR', 'Quitar publicacion'),
	]

	producto = models.ForeignKey('productos.Producto', on_delete=models.SET_NULL, null=True, blank=True)
	usuario = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True)
	accion = models.CharField(max_length=20, choices=ACCION_CHOICES)
	descripcion = models.TextField(blank=True)
	fecha = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-fecha']

	def __str__(self):
		return f'{self.accion} - {self.fecha:%d/%m/%Y %H:%M}'
