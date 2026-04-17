from django.contrib import messages
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render

from apps.core.permissions import can_manage_inventory

from .models import Categoria


@login_required
def listar_categorias(request):
	categorias_qs = Categoria.objects.all()

	q = request.GET.get('q', '').strip()
	estado = request.GET.get('estado', '').strip().upper()

	if q:
		categorias_qs = categorias_qs.filter(Q(nombre__icontains=q) | Q(descripcion__icontains=q))

	if estado == 'ACTIVO':
		categorias_qs = categorias_qs.filter(activa=True)
	elif estado == 'INACTIVO':
		categorias_qs = categorias_qs.filter(activa=False)

	paginator = Paginator(categorias_qs, 10)
	page_number = request.GET.get('page')
	categorias = paginator.get_page(page_number)

	return render(
		request,
		'categorias/categorias.html',
		{'categorias': categorias, 'q': q, 'estado': estado, 'can_manage': can_manage_inventory(request.user)},
	)


@login_required
@user_passes_test(can_manage_inventory, login_url='/login/')
def crear_categoria(request):
	if request.method == 'POST':
		Categoria.objects.create(
			nombre=request.POST.get('nombre', '').strip(),
			descripcion=request.POST.get('descripcion', '').strip(),
			activa=request.POST.get('activa') == 'on',
		)
		messages.success(request, 'Categoria creada.')
	return redirect('categorias:listar_categorias')


@login_required
@user_passes_test(can_manage_inventory, login_url='/login/')
def editar_categoria(request, categoria_id):
	categoria = get_object_or_404(Categoria, id=categoria_id)
	if request.method == 'POST':
		categoria.nombre = request.POST.get('nombre', '').strip()
		categoria.descripcion = request.POST.get('descripcion', '').strip()
		categoria.activa = request.POST.get('activa') == 'on'
		categoria.save()
		messages.success(request, 'Categoria actualizada.')
	return redirect('categorias:listar_categorias')


@login_required
@user_passes_test(can_manage_inventory, login_url='/login/')
def eliminar_categoria(request, categoria_id):
	categoria = get_object_or_404(Categoria, id=categoria_id)
	if request.method == 'POST':
		categoria.delete()
		messages.success(request, 'Categoria eliminada.')
	return redirect('categorias:listar_categorias')
