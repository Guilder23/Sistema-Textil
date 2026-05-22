document.addEventListener('DOMContentLoaded', function () {
    const btnAgregarImagenesEditar = document.getElementById('btnAgregarImagenesEditar');
    const editImagenInput = document.getElementById('editImagen');
    const editExistingImages = document.getElementById('editExistingImages');
    const editImagenesPreview = document.getElementById('editImagenesPreview');
    const editImagenSinDato = document.getElementById('editImagenSinDato');
    const imagenesEliminarInput = document.getElementById('imagenesEliminar');
    const imagenPrincipalInput = document.getElementById('imagenPrincipal');
    const formEditar = document.getElementById('formEditarProducto');
    const btnsEditar = document.querySelectorAll('.btn-editar-producto');

    let existingImages = [];
    let imagesToDelete = [];
    let newFiles = [];
    let imagenPrincipalId = 'main';

    function updateDeletedInput() {
        imagenesEliminarInput.value = imagesToDelete.join(',');
    }

    function updateMainImageInput() {
        imagenPrincipalInput.value = imagenPrincipalId;
    }

    function renderExistingImages() {
        editExistingImages.innerHTML = '';
        if (existingImages.length === 0) {
            return;
        }

        existingImages.forEach((image, index) => {
            const isMain = image.id === imagenPrincipalId;
            const previewItem = document.createElement('div');
            previewItem.className = 'mr-2 mb-2 position-relative';
            previewItem.style.width = '110px';
            previewItem.innerHTML = `
                <div class="border rounded overflow-hidden" style="width:110px; height:110px; position:relative;">
                    <img src="${image.url}" class="img-fluid h-100 w-100" style="object-fit:cover;${isMain ? 'border: 3px solid #007bff;' : ''}" alt="Imagen">
                    ${isMain ? '<div class="position-absolute" style="top:5px; left:5px; background:#007bff; color:white; padding:2px 6px; font-size:0.7rem; border-radius:3px;"><i class="fas fa-star"></i> Principal</div>' : ''}
                    <button type="button" class="btn btn-sm btn-info position-absolute btn-set-principal" data-id="${image.id}" style="top:6px; right:6px; padding:0.2rem 0.45rem; display:${!isMain ? 'block' : 'none'};">
                        <i class="fas fa-star"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger position-absolute btn-eliminar-imagen-existente" data-index="${index}" style="bottom:6px; right:6px; padding:0.2rem 0.45rem;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            editExistingImages.appendChild(previewItem);
        });
    }

    function renderNewPreviews() {
        editImagenesPreview.innerHTML = '';
        if (newFiles.length === 0) {
            return;
        }

        newFiles.forEach((file, index) => {
            const url = URL.createObjectURL(file);
            const previewItem = document.createElement('div');
            previewItem.className = 'mr-2 mb-2 position-relative';
            previewItem.style.width = '110px';
            previewItem.innerHTML = `
                <div class="border rounded overflow-hidden" style="width:110px; height:110px; position:relative;">
                    <img src="${url}" class="img-fluid h-100 w-100" style="object-fit:cover;" alt="${file.name}">
                    <button type="button" class="btn btn-sm btn-danger position-absolute btn-eliminar-imagen-nueva" data-index="${index}" style="top:6px; right:6px; padding:0.2rem 0.45rem;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="text-truncate" style="max-width:110px; font-size:0.75rem;">${file.name}</div>
            `;
            editImagenesPreview.appendChild(previewItem);
        });
    }

    function renderAllPreviews() {
        editImagenesPreview.innerHTML = '';
        editExistingImages.innerHTML = '';
        editImagenSinDato.style.display = 'none';

        renderExistingImages();
        renderNewPreviews();

        if (existingImages.length === 0 && newFiles.length === 0) {
            editImagenSinDato.style.display = 'block';
        }

        editExistingImages.querySelectorAll('.btn-set-principal').forEach((button) => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                imagenPrincipalId = this.dataset.id;
                updateMainImageInput();
                renderAllPreviews();
            });
        });

        editExistingImages.querySelectorAll('.btn-eliminar-imagen-existente').forEach((button) => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const index = Number(this.dataset.index);
                const image = existingImages[index];
                if (image) {
                    if (image.id === imagenPrincipalId) {
                        imagenPrincipalId = existingImages.find(img => img.id !== image.id)?.id || 'main';
                        updateMainImageInput();
                    }
                    imagesToDelete.push(image.id);
                    existingImages.splice(index, 1);
                    updateDeletedInput();
                    renderAllPreviews();
                }
            });
        });

        editImagenesPreview.querySelectorAll('.btn-eliminar-imagen-nueva').forEach((button) => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const index = Number(this.dataset.index);
                newFiles.splice(index, 1);
                renderAllPreviews();
            });
        });
    }

    if (btnsEditar && formEditar) {
        btnsEditar.forEach(function (button) {
            button.addEventListener('click', function () {
                const productoId = this.dataset.id;
                formEditar.action = `/productos/${productoId}/editar/`;
                document.getElementById('editCodigo').value = this.dataset.codigo || '';
                document.getElementById('editNombre').value = this.dataset.nombre || '';
                document.getElementById('editDetalle').value = this.dataset.detalle || '';
                document.getElementById('editCategoria').value = this.dataset.categoriaId || '';
                document.getElementById('editSexo').value = this.dataset.sexo || 'UNISEX';
                document.getElementById('editStock').value = this.dataset.stock || '0';
                document.getElementById('editUnidades').value = this.dataset.unidades || '1';
                document.getElementById('editPrecioUsd').value = this.dataset.precioUnidadBs || '0';
                const precioOferta = parseFloat(this.dataset.precioOferta || '0');
                document.getElementById('editPrecioOferta').value = precioOferta || '0';
                document.getElementById('editDescuentoValor').value = this.dataset.descuentoValor || '0';
                document.getElementById('editDescuentoTipo').value = this.dataset.descuentoTipo || 'PORCENTAJE';
                document.getElementById('editTallas').value = this.dataset.tallas || '';
                document.getElementById('editColores').value = this.dataset.colores || '';
                document.getElementById('editActivo').checked = this.dataset.activo === '1';
                document.getElementById('editPublicado').checked = this.dataset.publicado === '1';

                newFiles = [];
                imagesToDelete = [];
                updateDeletedInput();

                const rawExistingImages = this.dataset.existingImages || '';
                existingImages = rawExistingImages
                    .split(';')
                    .filter(Boolean)
                    .map((item) => {
                        const [id, url, isPrincipal] = item.split('|');
                        return { id, url, isPrincipal: isPrincipal === '1' };
                    });

                imagenPrincipalId = existingImages.find(img => img.isPrincipal)?.id || 'main';
                updateMainImageInput();

                if (editImagenInput) {
                    editImagenInput.value = null;
                }

                renderAllPreviews();
            });
        });
    }

    if (btnAgregarImagenesEditar) {
        btnAgregarImagenesEditar.addEventListener('click', function (e) {
            e.preventDefault();
            editImagenInput.click();
        });
    }

    if (editImagenInput) {
        editImagenInput.addEventListener('change', function () {
            const files = Array.from(this.files || []);
            files.forEach((file) => {
                const exists = newFiles.some((existingFile) => existingFile.name === file.name && existingFile.size === file.size);
                if (!exists) {
                    newFiles.push(file);
                }
            });
            renderAllPreviews();
            this.value = '';
        });
    }

    if (formEditar) {
        formEditar.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData();
            const inputs = this.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.name === 'imagenes' || input.name === 'imagenes_eliminar' || input.name === 'imagen_principal') return;
                if (input.type === 'checkbox') {
                    if (input.checked) formData.append(input.name, 'on');
                } else if (input.value) {
                    formData.append(input.name, input.value);
                }
            });
            formData.append('imagenes_eliminar', imagenesEliminarInput.value);
            formData.append('imagen_principal', imagenPrincipalInput.value);
            newFiles.forEach((file) => {
                formData.append('imagenes', file);
            });

            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    window.location.href = '/productos/';
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al enviar el formulario');
            });
        });
    }
});
