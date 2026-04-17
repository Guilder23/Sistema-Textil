document.addEventListener('DOMContentLoaded', function () {
    const formFiltros = document.getElementById('formFiltrosCategorias');
    const inputBuscar = document.getElementById('buscarCategoria');
    const filtroEstado = document.getElementById('estadoCategoria');
    const verButtons = document.querySelectorAll('.btn-ver-categoria');
    const editarButtons = document.querySelectorAll('.btn-editar-categoria');

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

    verButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.getElementById('verCategoriaNombre').textContent = this.dataset.nombre || '';
            document.getElementById('verCategoriaDescripcion').textContent = this.dataset.descripcion || '';
            document.getElementById('verCategoriaEstado').textContent = this.dataset.estado || '';
        });
    });

    editarButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const categoriaId = this.dataset.id;
            document.getElementById('formEditarCategoria').action = `/categorias/${categoriaId}/editar/`;
            document.getElementById('editCategoriaNombre').value = this.dataset.nombre || '';
            document.getElementById('editCategoriaDescripcion').value = this.dataset.descripcion || '';
            document.getElementById('editCategoriaActiva').checked = this.dataset.activa === '1';
        });
    });
});
