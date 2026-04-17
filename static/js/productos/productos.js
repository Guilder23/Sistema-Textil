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
            document.getElementById('verPrecioUnidadBs').textContent = this.dataset.precioUnidadBs || '';
            document.getElementById('verPrecioCajaBs').textContent = this.dataset.precioCajaBs || '';

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
            form.action = `/productos/${productoId}/editar/`;

            document.getElementById('editCodigo').value = this.dataset.codigo || '';
            document.getElementById('editNombre').value = this.dataset.nombre || '';
            document.getElementById('editDetalle').value = this.dataset.detalle || '';
            document.getElementById('editCategoria').value = this.dataset.categoriaId || '';
            document.getElementById('editStock').value = this.dataset.stock || 0;
            document.getElementById('editUnidades').value = this.dataset.unidades || 1;
            document.getElementById('editPrecioUsd').value = this.dataset.precioUnidadBs || 0;
            document.getElementById('editPrecioBs').value = this.dataset.precioCajaBs || 0;
            document.getElementById('editActivo').checked = this.dataset.activo === '1';
            document.getElementById('editPublicado').checked = this.dataset.publicado === '1';

            if (editImagenInput) {
                editImagenInput.value = '';
            }
            pintarPreview(this.dataset.imagenUrl || '', 'editImagenPreview', 'editImagenSinDato');
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
