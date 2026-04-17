from .models import CambioProducto


def registrar_cambio(producto, usuario, accion, descripcion=''):
    CambioProducto.objects.create(
        producto=producto,
        usuario=usuario if getattr(usuario, 'is_authenticated', False) else None,
        accion=accion,
        descripcion=descripcion,
    )
