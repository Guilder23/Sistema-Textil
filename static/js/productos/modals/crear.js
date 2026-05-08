document.addEventListener('DOMContentLoaded', function () {
    const crearImagenInput = document.getElementById('crearImagen');
    const btnAgregarImagenesCrear = document.getElementById('btnAgregarImagenesCrear');
    const crearImagenesPreview = document.getElementById('crearImagenesPreview');
    const crearImagenSinDato = document.getElementById('crearImagenSinDato');
    const formCrear = document.querySelector('form[action*="crear_producto"]');

    let selectedFiles = [];

    function renderPreviews() {
        crearImagenesPreview.innerHTML = '';
        if (selectedFiles.length === 0) {
            crearImagenSinDato.style.display = 'block';
            return;
        }

        crearImagenSinDato.style.display = 'none';

        selectedFiles.forEach((file, index) => {
            const url = URL.createObjectURL(file);
            const previewItem = document.createElement('div');
            previewItem.className = 'mr-2 mb-2 position-relative';
            previewItem.style.width = '110px';
            previewItem.innerHTML = `
                <div class="border rounded overflow-hidden" style="width:110px; height:110px; position:relative;">
                    <img src="${url}" class="img-fluid h-100 w-100" style="object-fit:cover;" alt="${file.name}">
                    <button type="button" class="btn btn-sm btn-danger position-absolute" data-index="${index}" style="top:6px; right:6px; padding:0.2rem 0.45rem;">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="text-truncate" style="max-width:110px; font-size:0.75rem;">${file.name}</div>
            `;
            crearImagenesPreview.appendChild(previewItem);
        });

        crearImagenesPreview.querySelectorAll('button[data-index]').forEach((button) => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const index = Number(this.dataset.index);
                selectedFiles.splice(index, 1);
                renderPreviews();
            });
        });
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

    if (formCrear) {
        formCrear.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData();
            const inputs = this.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                if (input.name === 'imagenes') return;
                if (input.type === 'checkbox') {
                    if (input.checked) formData.append(input.name, 'on');
                } else if (input.value) {
                    formData.append(input.name, input.value);
                }
            });
            selectedFiles.forEach((file) => {
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
                    window.location.href = '/productos/';}
                else {
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

