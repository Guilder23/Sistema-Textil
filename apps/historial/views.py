from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from .models import CambioProducto


@login_required
def historial_cambios(request):
    cambios = CambioProducto.objects.select_related('producto', 'usuario').all()
    return render(request, 'historial/historial.html', {'cambios': cambios})
