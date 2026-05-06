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
	precio_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Precio normal")
	precio_oferta = models.DecimalField(max_digits=10, decimal_places=2, default=0, blank=True, null=True, help_text="Precio con descuento (opcional)")
	descuento_valor = models.DecimalField(max_digits=5, decimal_places=2, default=0, help_text="Valor del descuento")
	descuento_tipo = models.CharField(max_length=10, choices=[('PORCENTAJE', '%'), ('MONTO', 'Bs')], default='PORCENTAJE')
	tallas = models.CharField(max_length=100, blank=True, help_text="Ej: S, M, L, XL (separados por coma)")
	colores = models.CharField(max_length=100, blank=True, help_text="Ej: Negro, Blanco, Rojo (separados por coma)")
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

	@property
	def tiene_descuento(self):
		return self.precio_oferta and self.precio_oferta > 0 and self.precio_oferta < self.precio_usd

	@property
	def get_tallas_list(self):
		if not self.tallas:
			return []
		return [t.strip() for t in self.tallas.split(',') if t.strip()]

	@property
	def get_colores_list(self):
		if not self.colores:
			return []
		return [c.strip() for c in self.colores.split(',') if c.strip()]
