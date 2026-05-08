from decimal import Decimal, InvalidOperation

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from django.db.models import F, Q
from django.shortcuts import get_object_or_404, redirect, render

from apps.categorias.models import Categoria
from apps.productos.models import Producto


def inicio(request):
	q = request.GET.get('q', '').strip()
	categoria_id = request.GET.get('categoria', '').strip()
	precio_min_raw = request.GET.get('precio_min', '').strip()
	precio_max_raw = request.GET.get('precio_max', '').strip()
	orden = request.GET.get('orden', '').strip()

	# Nuevos filtros
	solo_ofertas = request.GET.get('oferta', '').strip()  # '1' para activar
	con_stock = request.GET.get('stock', '').strip()  # '1' para activar
	sexo = request.GET.get('sexo', '').strip()
	talla = request.GET.get('talla', '').strip()
	color = request.GET.get('color', '').strip()
	descuento_tipo = request.GET.get('descuento_tipo', '').strip()
	descuento_min_raw = request.GET.get('descuento_min', '').strip()

	productos_qs = Producto.objects.select_related('categoria').filter(publicado=True, activo=True)

	if q:
		productos_qs = productos_qs.filter(Q(nombre__icontains=q) | Q(categoria__nombre__icontains=q))

	if categoria_id:
		productos_qs = productos_qs.filter(categoria_id=categoria_id)

	if precio_min_raw:
		try:
			productos_qs = productos_qs.filter(precio_usd__gte=Decimal(precio_min_raw.replace(',', '.')))
		except (InvalidOperation, ValueError):
			pass

	if precio_max_raw:
		try:
			productos_qs = productos_qs.filter(precio_usd__lte=Decimal(precio_max_raw.replace(',', '.')))
		except (InvalidOperation, ValueError):
			pass

	if solo_ofertas == '1':
		productos_qs = productos_qs.filter(precio_oferta__gt=0).filter(precio_oferta__lt=F('precio_usd'))

	if con_stock == '1':
		productos_qs = productos_qs.filter(stock_unidad__gt=0)

	if sexo in {'UNISEX', 'MUJER', 'HOMBRE'}:
		productos_qs = productos_qs.filter(sexo=sexo)

	if talla:
		productos_qs = productos_qs.filter(tallas__icontains=talla)

	if color:
		productos_qs = productos_qs.filter(colores__icontains=color)

	if descuento_tipo in {'PORCENTAJE', 'MONTO'}:
		productos_qs = productos_qs.filter(descuento_tipo=descuento_tipo)

	if descuento_min_raw:
		try:
			productos_qs = productos_qs.filter(descuento_valor__gte=Decimal(descuento_min_raw.replace(',', '.')))
		except (InvalidOperation, ValueError):
			pass

	if orden == 'precio_asc':
		productos_qs = productos_qs.order_by('precio_usd', '-fecha_creacion')
	elif orden == 'precio_desc':
		productos_qs = productos_qs.order_by('-precio_usd', '-fecha_creacion')
	else:
		productos_qs = productos_qs.order_by('-fecha_creacion')

	paginator = Paginator(productos_qs, 12)
	page_number = request.GET.get('page')
	productos_publicados = paginator.get_page(page_number)

	categorias = Categoria.objects.filter(productos__publicado=True, productos__activo=True).distinct().order_by('nombre')
	productos_destacados = Producto.objects.select_related('categoria').filter(
		publicado=True, 
		activo=True, 
		precio_oferta__gt=0,
		descuento_valor__gt=0
	).order_by('-fecha_creacion')[:8]

	return render(
		request,
		'core/inicio.html',
		{
			'productos_publicados': productos_publicados,
			'categorias': categorias,
			'productos_destacados': productos_destacados,
			'q': q,
			'categoria_id': categoria_id,
			'precio_min': precio_min_raw,
			'precio_max': precio_max_raw,
			'orden': orden,
			'oferta': solo_ofertas,
			'stock': con_stock,
			'sexo': sexo,
			'talla': talla,
			'color': color,
			'descuento_tipo': descuento_tipo,
			'descuento_min': descuento_min_raw,
		},
	)


def detalle_producto(request, producto_id):
	producto = get_object_or_404(Producto, id=producto_id, publicado=True, activo=True)
	return render(request, 'core/detalle_producto.html', {'producto': producto})


def ver_carrito(request):
	return render(request, 'core/carrito.html')


def iniciar_sesion(request):
	if request.user.is_authenticated:
		return redirect('productos:listar_productos')

	if request.method == 'POST':
		username = request.POST.get('username', '').strip()
		password = request.POST.get('password', '')

		user = authenticate(request, username=username, password=password)
		if user is None:
			messages.error(request, 'Usuario o contrasena incorrectos.')
			return render(request, 'auth/login.html')

		login(request, user)
		return redirect('productos:listar_productos')

	return render(request, 'auth/login.html')


@login_required
def cerrar_sesion(request):
	logout(request)
	return redirect('core:inicio')


@login_required
@user_passes_test(lambda u: u.is_staff, login_url='/login/')
def registrar_usuario(request):
	if request.method == 'POST':
		username = request.POST.get('username', '').strip()
		first_name = request.POST.get('first_name', '').strip()
		last_name = request.POST.get('last_name', '').strip()
		email = request.POST.get('email', '').strip()
		password = request.POST.get('password', '')
		password2 = request.POST.get('password2', '')
		is_admin = request.POST.get('is_admin') == 'on'

		if not username or not password:
			messages.error(request, 'Usuario y contrasena son obligatorios.')
			return redirect('core:registro')

		if password != password2:
			messages.error(request, 'Las contrasenas no coinciden.')
			return redirect('core:registro')

		if User.objects.filter(username=username).exists():
			messages.error(request, 'El nombre de usuario ya existe.')
			return redirect('core:registro')

		user = User.objects.create_user(
			username=username,
			first_name=first_name,
			last_name=last_name,
			email=email,
			password=password,
		)
		user.is_staff = is_admin
		user.save()

		messages.success(request, 'Usuario creado correctamente.')
		return redirect('core:registro')

	q = request.GET.get('q', '').strip()
	rol = request.GET.get('rol', '').strip()
	estado = request.GET.get('estado', '').strip()

	usuarios_qs = User.objects.order_by('-date_joined')
	if q:
		usuarios_qs = usuarios_qs.filter(
			Q(username__icontains=q)
			| Q(first_name__icontains=q)
			| Q(last_name__icontains=q)
			| Q(email__icontains=q)
		)

	if rol == 'admin':
		usuarios_qs = usuarios_qs.filter(is_staff=True)
	elif rol == 'usuario':
		usuarios_qs = usuarios_qs.filter(is_staff=False)

	if estado == 'activo':
		usuarios_qs = usuarios_qs.filter(is_active=True)
	elif estado == 'bloqueado':
		usuarios_qs = usuarios_qs.filter(is_active=False)

	paginator = Paginator(usuarios_qs, 10)
	page_number = request.GET.get('page')
	usuarios = paginator.get_page(page_number)

	return render(
		request,
		'auth/registro.html',
		{
			'usuarios': usuarios,
			'q': q,
			'rol': rol,
			'estado': estado,
		},
	)


@login_required
@user_passes_test(lambda u: u.is_staff, login_url='/login/')
def editar_usuario(request, user_id):
	objetivo = get_object_or_404(User, id=user_id)

	if request.method == 'POST':
		if objetivo.is_superuser and not request.user.is_superuser:
			messages.error(request, 'No tienes permiso para editar este usuario.')
			return redirect('core:registro')

		username = request.POST.get('username', '').strip()
		email = request.POST.get('email', '').strip()
		first_name = request.POST.get('first_name', '').strip()
		last_name = request.POST.get('last_name', '').strip()
		is_admin = request.POST.get('is_admin') == 'on'

		if not username:
			messages.error(request, 'El usuario es obligatorio.')
			return redirect('core:registro')

		if User.objects.exclude(id=objetivo.id).filter(username=username).exists():
			messages.error(request, 'Ese nombre de usuario ya existe.')
			return redirect('core:registro')

		objetivo.username = username
		objetivo.email = email
		objetivo.first_name = first_name
		objetivo.last_name = last_name
		objetivo.is_staff = is_admin

		password = request.POST.get('password', '')
		password2 = request.POST.get('password2', '')
		if password or password2:
			if password != password2:
				messages.error(request, 'Las contrasenas no coinciden.')
				return redirect('core:registro')
			objetivo.set_password(password)

		objetivo.save()
		messages.success(request, 'Usuario actualizado correctamente.')

	return redirect('core:registro')


@login_required
@user_passes_test(lambda u: u.is_staff, login_url='/login/')
def toggle_bloqueo_usuario(request, user_id):
	objetivo = get_object_or_404(User, id=user_id)

	if request.method == 'POST':
		if objetivo == request.user:
			messages.error(request, 'No puedes bloquear tu propio usuario.')
			return redirect('core:registro')

		if objetivo.is_superuser and not request.user.is_superuser:
			messages.error(request, 'No tienes permiso para bloquear este usuario.')
			return redirect('core:registro')

		objetivo.is_active = not objetivo.is_active
		objetivo.save(update_fields=['is_active'])
		messages.success(
			request,
			f"Usuario {'bloqueado' if not objetivo.is_active else 'desbloqueado'} correctamente.",
		)

	return redirect('core:registro')


@login_required
@user_passes_test(lambda u: u.is_staff, login_url='/login/')
def eliminar_usuario(request, user_id):
	objetivo = get_object_or_404(User, id=user_id)

	if request.method == 'POST':
		if objetivo == request.user:
			messages.error(request, 'No puedes eliminar tu propio usuario.')
			return redirect('core:registro')

		if objetivo.is_superuser and not request.user.is_superuser:
			messages.error(request, 'No tienes permiso para eliminar este usuario.')
			return redirect('core:registro')

		objetivo.delete()
		messages.success(request, 'Usuario eliminado correctamente.')

	return redirect('core:registro')
