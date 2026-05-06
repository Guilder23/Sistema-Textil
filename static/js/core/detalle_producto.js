document.addEventListener('DOMContentLoaded', function() {
    const tallaButtons = document.querySelectorAll('.btn-talla');
    const colorButtons = document.querySelectorAll('.btn-color');
    const btnMinus = document.getElementById('btn-minus');
    const btnPlus = document.getElementById('btn-plus');
    const inputQuantity = document.getElementById('product-quantity');
    const btnAddToCart = document.getElementById('add-to-cart-btn');

    let selectedTalla = '';
    let selectedColor = '';

    // Selección de Talla
    tallaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tallaButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedTalla = this.dataset.talla;
        });
    });

    // Selección de Color
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            colorButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedColor = this.dataset.color;
        });
    });

    // Control de Cantidad
    if (btnMinus) {
        btnMinus.addEventListener('click', () => {
            let val = parseInt(inputQuantity.value);
            if (val > 1) inputQuantity.value = val - 1;
        });
    }

    if (btnPlus) {
        btnPlus.addEventListener('click', () => {
            let val = parseInt(inputQuantity.value);
            let max = parseInt(inputQuantity.getAttribute('max'));
            if (val < max) inputQuantity.value = val + 1;
        });
    }

    // Agregar al Carrito
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', function() {
            // Validar selecciones
            if (tallaButtons.length > 0 && !selectedTalla) {
                alert('Por favor selecciona una talla');
                return;
            }
            if (colorButtons.length > 0 && !selectedColor) {
                alert('Por favor selecciona un color');
                return;
            }

            const product = {
                id: window.location.pathname.split('/').filter(Boolean).pop(),
                nombre: document.querySelector('h1').textContent.trim(),
                precio: parseFloat(document.querySelector('.price-offer, .price-regular').textContent.replace('Bs', '').trim()),
                imagen: document.querySelector('.product-image-container img').src,
                talla: selectedTalla || 'N/A',
                color: selectedColor || 'N/A',
                cantidad: parseInt(inputQuantity.value)
            };

            if (CartSystem.addToCart(product)) {
                // Feedback visual
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
                this.style.background = '#22c55e';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.background = '#2563eb';
                }, 2000);
            }
        });
    }
});
