document.addEventListener('DOMContentLoaded', function () {
    const formFiltros = document.getElementById('formFiltrosProductos');
    const inputBuscar = document.getElementById('buscar');
    const filtroEstado = document.getElementById('estado');
    const filtroCategoria = document.getElementById('categoriaProducto');
    const filtroPublicado = document.getElementById('publicadoProducto');
    const filtroStock = document.getElementById('stockProducto');
    const crearImagenInput = document.getElementById('crearImagen');
    const editImagenInput = document.getElementById('editImagen');
    const verButtons = document.querySelectorAll('.btn-ver-producto');
    const editarButtons = document.querySelectorAll('.btn-editar-producto');
    const eliminarButtons = document.querySelectorAll('.btn-eliminar-producto');

    let filtroTimer;
    function enviarFiltros() {
        if (formFiltros) {
            formFiltros.submit();
        }
    }

    inputBuscar?.addEventListener('input', function () {
        clearTimeout(filtroTimer);
        filtroTimer = setTimeout(enviarFiltros, 350);
    });
    filtroEstado?.addEventListener('change', enviarFiltros);
    filtroCategoria?.addEventListener('change', enviarFiltros);
    filtroPublicado?.addEventListener('change', enviarFiltros);
    filtroStock?.addEventListener('change', enviarFiltros);

    function pintarPreview(url, previewId, placeholderId) {
        const preview = document.getElementById(previewId);
        const placeholder = document.getElementById(placeholderId);

        if (!preview || !placeholder) {
            return;
        }

        if (url) {
            preview.src = url;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        } else {
            preview.src = '';
            preview.style.display = 'none';
            placeholder.style.display = 'inline';
        }
    }

    function previewDesdeInput(input, previewId, placeholderId) {
        if (!input || !input.files || !input.files[0]) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            pintarPreview(e.target.result, previewId, placeholderId);
        };
        reader.readAsDataURL(input.files[0]);
    }

    crearImagenInput?.addEventListener('change', function () {
        previewDesdeInput(this, 'crearImagenPreview', 'crearImagenSinDato');
    });

    editImagenInput?.addEventListener('change', function () {
        previewDesdeInput(this, 'editImagenPreview', 'editImagenSinDato');
    });

    verButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const imagenUrl = this.dataset.imagenUrl || '';
            document.getElementById('verNombre').textContent = this.dataset.nombre || '';
            document.getElementById('verCodigo').textContent = this.dataset.codigo || '';
            document.getElementById('verDetalle').textContent = this.dataset.detalle || '';
            document.getElementById('verCategoria').textContent = this.dataset.categoria || '';
            document.getElementById('verStock').textContent = this.dataset.stock || '';
            document.getElementById('verTallas').textContent = this.dataset.tallas || 'No especificado';
            document.getElementById('verColores').textContent = this.dataset.colores || 'No especificado';
            document.getElementById('verPrecioUnidadBs').textContent = this.dataset.precioUnidadBs || '0.00';
            document.getElementById('verPrecioOferta').textContent = this.dataset.precioOferta || '0.00';
            
            const descValor = this.dataset.descuentoValor || '0';
            const descTipo = this.dataset.descuentoTipo === 'PORCENTAJE' ? '%' : 'Bs';
            document.getElementById('verDescuento').textContent = descValor > 0 ? `${descValor} ${descTipo}` : 'Sin descuento';

            const imagen = document.getElementById('verImagen');
            const imagenSinDato = document.getElementById('verImagenSinDato');
            if (imagenUrl) {
                imagen.src = imagenUrl;
                imagen.style.display = 'block';
                imagenSinDato.style.display = 'none';
            } else {
                imagen.src = '';
                imagen.style.display = 'none';
                imagenSinDato.style.display = 'inline';
            }
        });
    });

    editarButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const productoId = this.dataset.id;
            const form = document.getElementById('formEditarProducto');
            if (form) {
                form.action = `/productos/${productoId}/editar/`;
            }

            // Mapeo de campos para asegurar que todos se llenen
            const fields = {
                'editNombre': this.dataset.nombre,
                'editCodigo': this.dataset.codigo,
                'editDetalle': this.dataset.detalle,
                'editCategoria': this.dataset.categoriaId,
                'editStock': this.dataset.stock,
                'editUnidades': this.dataset.unidades,
                'editPrecioUsd': this.dataset.precioUnidadBs,
                'editPrecioOferta': this.dataset.precioOferta,
                'editDescuentoValor': this.dataset.descuentoValor,
                'editDescuentoTipo': this.dataset.descuentoTipo,
                'editTallas': this.dataset.tallas,
                'editColores': this.dataset.colores
            };

            for (const [id, value] of Object.entries(fields)) {
                const element = document.getElementById(id);
                if (element) {
                    element.value = value || (element.type === 'number' ? '0' : '');
                }
            }

            // Checkboxes
            const activoCheck = document.getElementById('editActivo');
            if (activoCheck) activoCheck.checked = this.dataset.activo === '1';

            const publicadoCheck = document.getElementById('editPublicado');
            if (publicadoCheck) publicadoCheck.checked = this.dataset.publicado === '1';

            // Limpiar input de archivo al abrir
            if (editImagenInput) {
                editImagenInput.value = '';
            }

            // Imagen
            const imgPreview = document.getElementById('editImagenPreview');
            const imagenUrl = this.dataset.imagenUrl || '';
            if (imgPreview) {
                imgPreview.src = imagenUrl;
            }
            pintarPreview(imagenUrl, 'editImagenPreview', 'editImagenSinDato');
        });
    });

    eliminarButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const productoId = this.dataset.id;
            const nombre = this.dataset.nombre || '';
            const form = document.getElementById('formEliminarProducto');

            form.action = `/productos/${productoId}/eliminar/`;
            document.getElementById('eliminarProductoNombre').textContent = nombre;
        });
    });
});
