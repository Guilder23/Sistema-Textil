function renderCart() {
    const cart = CartSystem.getCart();
    const container = document.getElementById('cart-content');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-msg">
                <i class="fas fa-shopping-basket fa-3x mb-3" style="color: #e2e8f0;"></i>
                <h5 class="text-muted">Tu carrito está vacío</h5>
                <p class="small text-muted mb-4">Explora nuestro catálogo para añadir productos</p>
                <a href="/" class="btn btn-primary px-4 py-2" style="border-radius: 10px; font-size: 0.9rem;">Ver productos</a>
            </div>
        `;
        return;
    }

    let html = '<div class="row">';
    html += '<div class="col-lg-8">';
    
    cart.forEach((item, index) => {
        html += `
            <div class="cart-item">
                <img src="${item.imagen}" class="cart-item-img" alt="${item.nombre}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.nombre}</div>
                    <div class="cart-item-details">Talla: ${item.talla} | Color: ${item.color} | Cantidad: ${item.cantidad}</div>
                </div>
                <div class="cart-item-price">Bs ${(item.precio * item.cantidad).toFixed(2)}</div>
                <button class="btn-remove" onclick="removeItem(${index})" title="Eliminar"><i class="fas fa-trash"></i></button>
            </div>
        `;
    });

    html += `
        <div class="guide-box mt-4">
            <div class="guide-title"><i class="fas fa-info-circle"></i> ¿Cómo funciona?</div>
            <ul class="guide-list">
                <li>Revisa tus productos y cantidades.</li>
                <li>Haz clic en "Enviar pedido" para abrir WhatsApp.</li>
                <li>Tu carrito se vaciará tras enviar el mensaje.</li>
                <li>Coordinaremos el pago y envío por chat.</li>
            </ul>
        </div>
    `;

    const total = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    html += '</div>'; // Fin col-lg-8
    html += `
        <div class="col-lg-4 mt-4 mt-lg-0">
            <div class="cart-summary">
                <h6 class="summary-title">Resumen de compra</h6>
                <div class="summary-row">
                    <span>Productos</span>
                    <span>Bs ${total.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Envío</span>
                    <span class="text-success font-weight-bold">A coordinar</span>
                </div>
                <div class="summary-row summary-total">
                    <span>Total</span>
                    <span>Bs ${total.toFixed(2)}</span>
                </div>
                <button onclick="sendOrder()" class="whatsapp-order-btn mt-3">
                    <i class="fab fa-whatsapp"></i> Enviar pedido
                </button>
                <button onclick="clearCart()" class="btn btn-link btn-sm btn-block text-muted mt-2">Vaciar carrito</button>
            </div>
        </div>
    `;
    html += '</div>';

    container.innerHTML = html;
}

function removeItem(index) {
    CartSystem.removeFromCart(index);
    renderCart();
}

function clearCart() {
    if(confirm('¿Deseas vaciar el carrito?')) {
        CartSystem.clearCart();
        renderCart();
    }
}

function sendOrder() {
    const message = CartSystem.formatWhatsAppMessage();
    if (message) {
        const phoneNumber = '59168440201';
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        
        // Vaciar carrito después de un pequeño delay
        setTimeout(() => {
            CartSystem.clearCart();
            renderCart();
        }, 1000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderCart();
});
