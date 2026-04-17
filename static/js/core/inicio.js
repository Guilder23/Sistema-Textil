document.addEventListener('DOMContentLoaded', function () {
    const formFiltros = document.getElementById('formFiltrosInicio');
    const buscarInput = document.getElementById('buscarInicio');
    const categoriaSelect = document.getElementById('categoriaInicio');
    const cards = document.querySelectorAll('.producto-click');

    let filtroTimer;
    function enviarFiltros() {
        if (formFiltros) {
            formFiltros.submit();
        }
    }

    buscarInput?.addEventListener('input', function () {
        clearTimeout(filtroTimer);
        filtroTimer = setTimeout(enviarFiltros, 350);
    });

    categoriaSelect?.addEventListener('change', enviarFiltros);

    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            const imagen = this.dataset.imagen || '';
            document.getElementById('inicioModalNombre').textContent = this.dataset.nombre || 'Detalle del producto';
            document.getElementById('inicioModalCategoria').textContent = this.dataset.categoria || '';
            document.getElementById('inicioModalCodigo').textContent = this.dataset.codigo || '';
            document.getElementById('inicioModalDetalle').textContent = this.dataset.detalle || '';
            document.getElementById('inicioModalStock').textContent = this.dataset.stock || '0';
            document.getElementById('inicioModalPrecioUnidadBs').textContent = this.dataset.precioUnidadBs || '0';
            document.getElementById('inicioModalPrecioCajaBs').textContent = this.dataset.precioCajaBs || '0';

            const img = document.getElementById('inicioModalImagen');
            if (imagen) {
                img.src = imagen;
            } else {
                img.src = 'https://via.placeholder.com/600x400?text=Sin+Imagen';
            }
        });
    });
});
