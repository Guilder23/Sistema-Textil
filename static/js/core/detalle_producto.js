document.addEventListener('DOMContentLoaded', function() {
    const tallaButtons = document.querySelectorAll('.btn-talla');
    const colorButtons = document.querySelectorAll('.btn-color');
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const inputQuantity = document.getElementById('product-quantity');
    const btnAddToCart = document.getElementById('add-to-cart-btn');
    const selectionMessage = document.getElementById('product-selection-message');

    let selectedTalla = '';
    let selectedColor = '';

    function showSelectionMessage(message, type = 'error') {
        if (!selectionMessage) {
            return;
        }

        selectionMessage.textContent = message;
        selectionMessage.classList.add('is-visible');
        selectionMessage.classList.remove('is-error', 'is-success');
        selectionMessage.classList.add(type === 'success' ? 'is-success' : 'is-error');
    }

    function clearSelectionMessage() {
        if (!selectionMessage) {
            return;
        }

        selectionMessage.textContent = '';
        selectionMessage.classList.remove('is-visible', 'is-error', 'is-success');
    }

    function normalizeQuantity() {
        if (!inputQuantity) {
            return 1;
        }

        const min = parseInt(inputQuantity.getAttribute('min'), 10) || 1;
        const max = parseInt(inputQuantity.getAttribute('max'), 10) || min;
        let value = parseInt(inputQuantity.value, 10);

        if (Number.isNaN(value) || value < min) {
            value = min;
        }

        if (value > max) {
            value = max;
        }

        inputQuantity.value = value;
        return value;
    }

    // Selección de Talla
    tallaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tallaButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedTalla = this.dataset.talla;
            clearSelectionMessage();
        });
    });

    // Selección de Color
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            colorButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.dataset.color;
            clearSelectionMessage();
        });
    });

    // Control de Cantidad
    if (btnMinus) {
        btnMinus.addEventListener('click', () => {
            let val = normalizeQuantity();
            if (val > 1) inputQuantity.value = val - 1;
        });
    }

    if (btnPlus) {
        btnPlus.addEventListener('click', () => {
            let val = normalizeQuantity();
            let max = parseInt(inputQuantity.getAttribute('max'), 10);
            if (val < max) inputQuantity.value = val + 1;
        });
    }

    if (inputQuantity) {
        inputQuantity.addEventListener('input', () => {
            clearSelectionMessage();
        });

        inputQuantity.addEventListener('blur', () => {
            normalizeQuantity();
        });
    }

    // Agregar al Carrito
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', function() {
            // Validar selecciones
            if (tallaButtons.length > 0 && !selectedTalla) {
                showSelectionMessage('Por favor selecciona una talla');
                return;
            }
            if (colorButtons.length > 0 && !selectedColor) {
                showSelectionMessage('Por favor selecciona un color');
                return;
            }

            const quantity = normalizeQuantity();
            if (quantity <= 0) {
                showSelectionMessage('La cantidad debe ser mayor a 0');
                return;
            }

            clearSelectionMessage();

            const product = {
                id: window.location.pathname.split('/').filter(Boolean).pop(),
                nombre: document.querySelector('h1').textContent.trim(),
                precio: parseFloat(document.querySelector('.price-offer, .price-regular').textContent.replace('Bs', '').trim()),
                imagen: document.getElementById('main-product-image') ? document.getElementById('main-product-image').src : document.querySelector('.product-image-container img').src,
                talla: selectedTalla || 'N/A',
                color: selectedColor || 'N/A',
                cantidad: quantity
            };

            if (CartSystem.addToCart(product)) {
                // Feedback visual
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
                this.style.background = '#22c55e';
                showSelectionMessage('Producto agregado al carrito correctamente.', 'success');
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = '#2563eb';
                    clearSelectionMessage();
                }, 2000);
            }
        });
    }

    // Miniaturas: cambiar imagen principal al hacer click
    const thumbs = document.querySelectorAll('.product-thumb');
    const mainImage = document.getElementById('main-product-image');
    const zoomContainer = document.getElementById('zoomContainer');
    
    if (thumbs.length && mainImage) {
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const src = this.dataset.src || this.getAttribute('src');
                if (src) mainImage.src = src;

                // marcar miniatura activa
                thumbs.forEach(t => t.classList.remove('active-thumb'));
                this.classList.add('active-thumb');
            });
        });
    }

    // Toggle descripción
    const toggleDescBtn = document.getElementById('toggle-desc-btn');
    const descDiv = document.getElementById('product-description');
    if (toggleDescBtn && descDiv) {
        toggleDescBtn.addEventListener('click', function() {
            const isHidden = window.getComputedStyle(descDiv).display === 'none';
            if (isHidden) {
                descDiv.style.display = 'block';
                this.textContent = 'Ocultar descripción';
            } else {
                descDiv.style.display = 'none';
                this.textContent = 'Mostrar descripción';
            }
        });
    }

    // Zoom interactivo que sigue el mouse
    if (zoomContainer && mainImage) {
        let isZoomed = false;
        
        zoomContainer.addEventListener('mouseenter', function() {
            isZoomed = true;
            mainImage.style.transform = 'scale(2.5)';
        });
        
        zoomContainer.addEventListener('mouseleave', function() {
            isZoomed = false;
            mainImage.style.transform = 'scale(1)';
            mainImage.style.transformOrigin = 'center center';
        });
        
        zoomContainer.addEventListener('mousemove', function(e) {
            if (!isZoomed) return;
            
            const rect = zoomContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Asegurarse que los valores estén dentro de los límites
            const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));
            
            mainImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        });
        
        // También funciona para touch en móviles
        zoomContainer.addEventListener('touchmove', function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = zoomContainer.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            const xPercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            const yPercent = Math.max(0, Math.min(100, (y / rect.height) * 100));
            
            mainImage.style.transformOrigin = `${xPercent}% ${yPercent}%`;
            mainImage.style.transform = 'scale(1.5)';
        });
        
        zoomContainer.addEventListener('touchend', function() {
            mainImage.style.transform = 'scale(1)';
            mainImage.style.transformOrigin = 'center center';
        });
    }
});
