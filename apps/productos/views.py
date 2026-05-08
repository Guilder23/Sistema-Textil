from decimal import Decimal

from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from apps.core.permissions import can_manage_inventory
from apps.categorias.models import Categoria
from apps.historial.services import registrar_cambio

from .models import Producto, ProductoImagen


@login_required
def listar_productos(request):
	productos_qs = Producto.objects.select_related('categoria').all()
	categorias = Categoria.objects.filter(activa=True)

	q = request.GET.get('q', '').strip()
	estado = request.GET.get('estado', '').strip().upper()
	categoria_id = request.GET.get('categoria', '').strip()
	publicado = request.GET.get('publicado', '').strip().upper()
	stock = request.GET.get('stock', '').strip().upper()

	if q:
		productos_qs = productos_qs.filter(
			Q(codigo__icontains=q)
			| Q(nombre__icontains=q)
			| Q(detalle__icontains=q)
			| Q(categoria__nombre__icontains=q)
		)

	if estado == 'ACTIVO':
		productos_qs = productos_qs.filter(activo=True)
	elif estado == 'INACTIVO':
		productos_qs = productos_qs.filter(activo=False)

	if categoria_id:
		productos_qs = productos_qs.filter(categoria_id=categoria_id)

	if publicado == 'SI':
		productos_qs = productos_qs.filter(publicado=True)
	elif publicado == 'NO':
		productos_qs = productos_qs.filter(publicado=False)

	if stock == 'CON':
		productos_qs = productos_qs.filter(stock_unidad__gt=0)
	elif stock == 'SIN':
		productos_qs = productos_qs.filter(stock_unidad=0)

	paginator = Paginator(productos_qs, 10)
	page_number = request.GET.get('page')
	productos = paginator.get_page(page_number)

	return render(
		request,
		'productos/productos.html',
		{
			'productos': productos,
			'categorias': categorias,
			'q': q,
			'estado': estado,
			'categoria_id': categoria_id,
			'publicado': publicado,
			'stock': stock,
			'can_manage': can_manage_inventory(request.user),
		},
	)


@login_required
def detalle_producto_admin(request, producto_id):
	producto = get_object_or_404(Producto, id=producto_id)
	return render(request, 'productos/detalle.html', {'producto': producto})


from django.http import JsonResponse

@login_required
@user_passes_test(can_manage_inventory, login_url='/login/')
def crear_producto(request):
	if request.method == 'POST':
		try:
			categoria = get_object_or_404(Categoria, id=request.POST.get('categoria_id'))
			sex = request.POST.get('sexo', 'UNISEX')
			imagenes = request.FILES.getlist('imagenes')
			main_image = imagenes[0] if imagenes else None
			if imagenes:
				imagenes = imagenes[1:]
			producto = Producto.objects.create(
				codigo=request.POST.get('codigo', '').strip(),
				nombre=request.POST.get('nombre', '').strip(),
				detalle=request.POST.get('detalle', '').strip(),
				imagen=main_image,
				categoria=categoria,
				sexo=sex,
				stock_unidad=int(request.POST.get('stock_unidad', 0) or 0),
				unidades_por_caja=int(request.POST.get('unidades_por_caja', 1) or 1),
				precio_usd=Decimal(request.POST.get('precio_usd', '0').replace(',', '.') or '0'),
				precio_oferta=Decimal(request.POST.get('precio_oferta', '0').replace(',', '.') or '0') if request.POST.get('precio_oferta') else 0,
				descuento_valor=Decimal(request.POST.get('descuento_valor', '0').replace(',', '.') or '0'),
				descuento_tipo=request.POST.get('descuento_tipo', 'PORCENTAJE'),
				tallas=request.POST.get('tallas', '').strip(),
				colores=request.POST.get('colores', '').strip(),
				activo=request.POST.get('activo') == 'on',
				publicado=request.POST.get('publicado') == 'on',
			)
			for imagen in imagenes:
				ProductoImagen.objects.create(producto=producto, imagen=imagen)
			registrar_cambio(producto, request.user, 'CREAR', 'Creacion de producto')
			messages.success(request, 'Producto creado correctamente.')
			if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
				return JsonResponse({'status': 'success', 'message': 'Producto creado correctamente.'})
		except Exception as e:
			if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
				return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
			messages.error(request, f'Error al crear producto: {str(e)}')
	return redirect('productos:listar_productos')


@login_required
@user_passes_test(can_manage_inventory, login_url='/login/')
def editar_producto(request, producto_id):
	producto = get_object_or_404(Producto, id=producto_id)
	if request.method == 'POST':
		try:
			categoria = get_object_or_404(Categoria, id=request.POST.get('categoria_id'))
			producto.codigo = request.POST.get('codigo', '').strip()
			producto.nombre = request.POST.get('nombre', '').strip()
			producto.detalle = request.POST.get('detalle', '').strip()
			producto.categoria = categoria
			producto.sexo = request.POST.get('sexo', 'UNISEX')
			producto.stock_unidad = int(request.POST.get('stock_unidad', 0) or 0)
			producto.unidades_por_caja = int(request.POST.get('unidades_por_caja', 1) or 1)
			producto.precio_usd = Decimal(request.POST.get('precio_usd', '0').replace(',', '.') or '0')
			producto.precio_oferta = Decimal(request.POST.get('precio_oferta', '0').replace(',', '.') or '0') if request.POST.get('precio_oferta') else 0
			producto.descuento_valor = Decimal(request.POST.get('descuento_valor', '0').replace(',', '.') or '0')
			producto.descuento_tipo = request.POST.get('descuento_tipo', 'PORCENTAJE')
			producto.tallas = request.POST.get('tallas', '').strip()
			producto.colores = request.POST.get('colores', '').strip()
			producto.activo = request.POST.get('activo') == 'on'
			producto.publicado = request.POST.get('publicado') == 'on'

			imagenes = request.FILES.getlist('imagenes')
			main_image = imagenes[0] if imagenes else None
			if imagenes:
				imagenes = imagenes[1:]
			if main_image:
				producto.imagen = main_image
				producto.imagen_url = ''

			eliminar_ids = request.POST.get('imagenes_eliminar', '')
			if eliminar_ids:
				ids_to_remove = [int(imagen_id) for imagen_id in eliminar_ids.split(',') if imagen_id.strip().isdigit()]
				ProductoImagen.objects.filter(producto=producto, id__in=ids_to_remove).delete()

			# Manejar cambio de imagen principal
			imagen_principal_id = request.POST.get('imagen_principal', 'main')
			if imagen_principal_id and imagen_principal_id != 'main':
				try:
					imagen_principal_id = int(imagen_principal_id)
					# Obtener la ProductoImagen que será la nueva principal
					nueva_principal = ProductoImagen.objects.get(id=imagen_principal_id, producto=producto)
					# Guardar la imagen actual como ProductoImagen
					if producto.imagen:
						ProductoImagen.objects.create(producto=producto, imagen=producto.imagen)
					# Actualizar la imagen principal
					producto.imagen = nueva_principal.imagen
					producto.imagen_url = ''
					# Eliminar el ProductoImagen que ahora es la principal
					nueva_principal.delete()
				except (ProductoImagen.DoesNotExist, ValueError):
					pass

			producto.save()
			for imagen in imagenes:
				ProductoImagen.objects.create(producto=producto, imagen=imagen)
			registrar_cambio(producto, request.user, 'EDITAR', 'Edicion de producto')
			messages.success(request, 'Producto actualizado.')
			if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
				return JsonResponse({'status': 'success', 'message': 'Producto actualizado correctamente.'})
		except Exception as e:
			if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
				return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
			messages.error(request, f'Error al actualizar producto: {str(e)}')
	return redirect('productos:listar_productos')


@login_required
@user_passes_test(can_manage_inventory, login_url='/login/')
def eliminar_producto(request, producto_id):
	producto = get_object_or_404(Producto, id=producto_id)
	if request.method == 'POST':
		registrar_cambio(producto, request.user, 'ELIMINAR', f'Se elimino {producto.detalle}')
		producto.delete()
		messages.success(request, 'Producto eliminado.')
	return redirect('productos:listar_productos')


@login_required
@user_passes_test(can_manage_inventory, login_url='/login/')
def toggle_destacado(request, producto_id):
	producto = get_object_or_404(Producto, id=producto_id)
	if request.method == 'POST':
		producto.destacado = not producto.destacado
		producto.save(update_fields=['destacado'])
		accion = 'DESTACAR' if producto.destacado else 'Q_DESTACAR'
		registrar_cambio(producto, request.user, accion, 'Cambio de destacado')
	return redirect('destacados:listar_destacados')


@login_required
@user_passes_test(can_manage_inventory, login_url='/login/')
def toggle_publicado(request, producto_id):
	producto = get_object_or_404(Producto, id=producto_id)
	if request.method == 'POST':
		producto.publicado = not producto.publicado
		producto.save(update_fields=['publicado'])
		accion = 'PUBLICAR' if producto.publicado else 'Q_PUBLICAR'
		registrar_cambio(producto, request.user, accion, 'Cambio de publicacion')
		messages.success(request, f"Producto {'publicado' if producto.publicado else 'ocultado'} correctamente.")
	return redirect('productos:listar_productos')


@login_required
@user_passes_test(can_manage_inventory, login_url='/login/')
def ajustar_stock(request, producto_id):
	producto = get_object_or_404(Producto, id=producto_id)
	if request.method == 'POST':
		ajuste = int(request.POST.get('ajuste', 0) or 0)
		producto.stock_unidad = max(0, producto.stock_unidad + ajuste)
		producto.save(update_fields=['stock_unidad'])
		registrar_cambio(producto, request.user, 'STOCK', f'Ajuste de stock: {ajuste}')
		messages.success(request, 'Stock ajustado correctamente.')
	return redirect('stock:control_stock')
