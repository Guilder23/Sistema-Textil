document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.btn-ver-producto');
    const verCarousel = document.getElementById('verImagenCarousel');
    const verCarouselIndicators = document.getElementById('verCarouselIndicators');
    const verCarouselInner = document.getElementById('verCarouselInner');
    const verImagenSinDato = document.getElementById('verImagenSinDato');

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            document.getElementById('verNombre').textContent = this.dataset.nombre || '';
            document.getElementById('verCodigo').textContent = this.dataset.codigo || '';
            document.getElementById('verSexo').textContent = this.dataset.sexo ? this.dataset.sexo.charAt(0).toUpperCase() + this.dataset.sexo.slice(1).toLowerCase() : '';
            document.getElementById('verDetalle').textContent = this.dataset.detalle || '';
            document.getElementById('verCategoria').textContent = this.dataset.categoria || '';
            document.getElementById('verStock').textContent = this.dataset.stock || '';
            document.getElementById('verPrecioUnidadBs').textContent = this.dataset.precioUnidadBs || '';
            document.getElementById('verPrecioOferta').textContent = this.dataset.precioOferta || '0';
            const descuentoValor = this.dataset.descuentoValor || '0';
            const descuentoTipo = this.dataset.descuentoTipo || 'PORCENTAJE';
            document.getElementById('verDescuento').textContent = descuentoTipo === 'MONTO' ? `Bs ${descuentoValor}` : `${descuentoValor}%`;

            const imagenesRaw = this.dataset.imagenes || '';
            const imagenes = imagenesRaw ? imagenesRaw.split('|').filter(Boolean) : [];
            verCarouselIndicators.innerHTML = '';
            verCarouselInner.innerHTML = '';

            if (imagenes.length > 0) {
                verImagenSinDato.style.display = 'none';
                verCarousel.style.display = 'block';
                imagenes.forEach(function (url, index) {
                    const indicator = document.createElement('li');
                    indicator.setAttribute('data-target', '#verImagenCarousel');
                    indicator.setAttribute('data-slide-to', String(index));
                    if (index === 0) {
                        indicator.className = 'active';
                    }
                    verCarouselIndicators.appendChild(indicator);

                    const carouselItem = document.createElement('div');
                    carouselItem.className = index === 0 ? 'carousel-item active' : 'carousel-item';
                    carouselItem.innerHTML = `<img class="d-block w-100" src="${url}" alt="Imagen ${index + 1}" style="max-height:400px; object-fit:contain;">`;
                    verCarouselInner.appendChild(carouselItem);
                });
            } else {
                verCarousel.style.display = 'none';
                verImagenSinDato.style.display = 'block';
            }
        });
    });
});

