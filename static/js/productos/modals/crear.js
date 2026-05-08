document.addEventListener('DOMContentLoaded', function () {
    const crearImagenInput = document.getElementById('crearImagen');
    const btnAgregarImagenesCrear = document.getElementById('btnAgregarImagenesCrear');
    const crearImagenesPreview = document.getElementById('crearImagenesPreview');
    const crearImagenSinDato = document.getElementById('crearImagenSinDato');
    const crearImagenPrincipalInput = document.getElementById('crearImagenPrincipal');
    const formCrear = document.getElementById('formCrearProducto');
    const modalCrearProducto = document.getElementById('modalCrearProducto');

    let selectedFiles = [];
    let imagenPrincipalIndex = null;

    function updateMainImageInput() {
        if (crearImagenPrincipalInput) {
            crearImagenPrincipalInput.value = imagenPrincipalIndex !== null ? imagenPrincipalIndex : '';
        }
    }

    function syncMainImageIndex() {
        if (selectedFiles.length === 0) {
            imagenPrincipalIndex = null;
        } else if (
            imagenPrincipalIndex === null ||
            imagenPrincipalIndex < 0 ||
            imagenPrincipalIndex >= selectedFiles.length
        ) {
            imagenPrincipalIndex = 0;
        }
        updateMainImageInput();
    }

    function renderPreviews() {
        if (!crearImagenesPreview || !crearImagenSinDato) {
            return;
        }

        syncMainImageIndex();
        crearImagenesPreview.innerHTML = '';
        if (selectedFiles.length === 0) {
            crearImagenSinDato.style.display = 'block';
            return;
        }

        crearImagenSinDato.style.display = 'none';

        selectedFiles.forEach((file, index) => {
            const url = URL.createObjectURL(file);
            const isMain = index === imagenPrincipalIndex;
            const previewItem = document.createElement('div');
            previewItem.className = 'mr-2 mb-2 position-relative';
            previewItem.style.width = '110px';
            previewItem.innerHTML = `
                <div class="border rounded overflow-hidden" style="width:110px; height:110px; position:relative;">
                    <img src="${url}" class="img-fluid h-100 w-100" style="object-fit:cover;${isMain ? 'border: 3px solid #007bff;' : ''}" alt="${file.name}">
                    ${isMain ? '<div class="position-absolute" style="top:5px; left:5px; background:#007bff; color:white; padding:2px 6px; font-size:0.7rem; border-radius:3px;"><i class="fas fa-star"></i> Principal</div>' : ''}
                    <button type="button" class="btn btn-sm btn-info position-absolute btn-set-principal-crear" data-index="${index}" style="top:6px; right:6px; padding:0.2rem 0.45rem; display:${!isMain ? 'block' : 'none'};">
                        <i class="fas fa-star"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger position-absolute btn-eliminar-imagen-crear" data-index="${index}" style="bottom:6px; right:6px; padding:0.2rem 0.45rem;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="text-truncate" style="max-width:110px; font-size:0.75rem;">${file.name}</div>
            `;
            crearImagenesPreview.appendChild(previewItem);
        });

        crearImagenesPreview.querySelectorAll('.btn-set-principal-crear').forEach((button) => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                imagenPrincipalIndex = Number(this.dataset.index);
                updateMainImageInput();
                renderPreviews();
            });
        });

        crearImagenesPreview.querySelectorAll('.btn-eliminar-imagen-crear').forEach((button) => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const index = Number(this.dataset.index);
                selectedFiles.splice(index, 1);
                if (imagenPrincipalIndex === index) {
                    imagenPrincipalIndex = 0;
                } else if (imagenPrincipalIndex !== null && index < imagenPrincipalIndex) {
                    imagenPrincipalIndex -= 1;
                }
                renderPreviews();
            });
        });
    }

    function resetCreateState() {
        selectedFiles = [];
        imagenPrincipalIndex = null;

        if (crearImagenInput) {
            crearImagenInput.value = '';
        }

        if (crearImagenPrincipalInput) {
            crearImagenPrincipalInput.value = '';
        }

        if (formCrear) {
            formCrear.reset();
        }

        const activoCrear = document.getElementById('activoCrear');
        if (activoCrear) {
            activoCrear.checked = true;
        }

        const publicadoCrear = document.getElementById('publicadoCrear');
        if (publicadoCrear) {
            publicadoCrear.checked = false;
        }

        updateMainImageInput();
        renderPreviews();
    }

    if (btnAgregarImagenesCrear) {
        btnAgregarImagenesCrear.addEventListener('click', function (e) {
            e.preventDefault();
            crearImagenInput.click();
        });
    }

    if (crearImagenInput) {
        crearImagenInput.addEventListener('change', function () {
            const files = Array.from(this.files || []);
            files.forEach((file) => {
                const exists = selectedFiles.some((existingFile) => existingFile.name === file.name && existingFile.size === file.size);
                if (!exists) {
                    selectedFiles.push(file);
                }
            });
            renderPreviews();
            this.value = '';
        });
    }

    if (modalCrearProducto) {
        modalCrearProducto.addEventListener('show.bs.modal', function () {
            resetCreateState();
        });

        modalCrearProducto.addEventListener('hidden.bs.modal', function () {
            resetCreateState();
        });
    }

    if (formCrear) {
        formCrear.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            formData.delete('imagenes');
            formData.delete('imagen_principal_index');
            
            selectedFiles.forEach((file) => {
                formData.append('imagenes', file);
            });

            if (imagenPrincipalIndex !== null) {
                formData.append('imagen_principal_index', imagenPrincipalIndex);
            }

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
