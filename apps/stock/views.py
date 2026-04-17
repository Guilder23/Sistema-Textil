from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from apps.core.permissions import can_manage_inventory
from apps.productos.models import Producto


@login_required
def control_stock(request):
	movimientos = []
	for p in Producto.objects.select_related('categoria').all():
		minimo = p.unidades_por_caja * 2
		if p.stock_unidad <= minimo:
			estado = 'BAJO'
		elif p.stock_unidad <= minimo * 2:
			estado = 'ALERTA'
		else:
			estado = 'NORMAL'

		movimientos.append(
			{
				'id': p.id,
				'codigo': p.codigo,
				'producto': p.detalle,
				'stock_actual': p.stock_unidad,
				'minimo': minimo,
				'estado': estado,
			}
		)

	return render(
		request,
		'stock/stock.html',
		{'movimientos': movimientos, 'can_manage': can_manage_inventory(request.user)},
	)
