from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from apps.categorias.models import Categoria
from apps.productos.models import Producto


@login_required
def estadisticas_basicas(request):
	productos = Producto.objects.all()
	metricas = {
		'total_productos': productos.count(),
		'total_categorias': Categoria.objects.count(),
		'productos_activos': productos.filter(activo=True).count(),
		'productos_bajo_stock': sum(1 for p in productos if p.stock_unidad <= p.unidades_por_caja * 2),
	}
	return render(request, 'estadisticas/estadisticas.html', {'metricas': metricas})
