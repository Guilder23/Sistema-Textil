from django.db import models


class Producto(models.Model):
	codigo = models.CharField(max_length=30, unique=True)
	nombre = models.CharField(max_length=140, default='')
	detalle = models.CharField(max_length=220)
	imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
	imagen_url = models.URLField(blank=True)
	categoria = models.ForeignKey('categorias.Categoria', on_delete=models.PROTECT, related_name='productos')
	stock_unidad = models.PositiveIntegerField(default=0)
	unidades_por_caja = models.PositiveIntegerField(default=1)
	precio_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	precio_caja_bs = models.DecimalField(max_digits=10, decimal_places=2, default=0)
	activo = models.BooleanField(default=True)
	publicado = models.BooleanField(default=False)
	destacado = models.BooleanField(default=False)
	fecha_creacion = models.DateTimeField(auto_now_add=True)
	fecha_actualizacion = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['-fecha_creacion']

	@property
	def stock_caja(self):
		if self.unidades_por_caja == 0:
			return 0
		return round(self.stock_unidad / self.unidades_por_caja, 2)

	def __str__(self):
		return f'{self.codigo} - {self.nombre}'
