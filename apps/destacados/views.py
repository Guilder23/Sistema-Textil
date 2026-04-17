from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from apps.core.permissions import can_manage_inventory
from apps.productos.models import Producto


@login_required
def listar_destacados(request):
	productos_destacados = Producto.objects.select_related('categoria').filter(destacado=True)
	productos = Producto.objects.select_related('categoria').all()
	return render(
		request,
		'destacados/destacados.html',
		{
			'productos_destacados': productos_destacados,
			'productos': productos,
			'can_manage': can_manage_inventory(request.user),
		},
	)
