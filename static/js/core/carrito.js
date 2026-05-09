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
                <button class="btn-remove btn-remove-item" onclick="removeItem(${index})" title="Eliminar" aria-label="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
                <img src="${item.imagen}" class="cart-item-img" alt="${item.nombre}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.nombre}</div>
                    <div class="cart-item-details">Talla: ${item.talla} | Color: ${item.color}</div>
                    <div class="cart-qty-row" aria-label="Cantidad">
                        <button type="button" class="cart-qty-btn" onclick="changeQty(${index}, -1)" aria-label="Disminuir cantidad">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="cart-qty-input" min="1" step="1" value="${item.cantidad}" inputmode="numeric" onchange="setQty(${index}, this.value)" aria-label="Cantidad">
                        <button type="button" class="cart-qty-btn" onclick="changeQty(${index}, 1)" aria-label="Aumentar cantidad">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-price">Bs ${(item.precio * item.cantidad).toFixed(2)}</div>
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
                <div class="summary-header">
                    <h6 class="summary-title mb-0">Resumen de compra</h6>
                    <button type="button" class="btn-clear-cart-icon" onclick="openClearCartConfirm()" title="Vaciar carrito" aria-label="Vaciar carrito">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
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
                <a href="/#catalogo" class="continue-shopping-btn btn btn-outline-primary btn-sm btn-block mt-3">
                    <i class="fas fa-arrow-left"></i> Seguir comprando
                </a>
            </div>
        </div>
    `;
    html += '</div>';

    container.innerHTML = html;
}

function setQty(index, value) {
    CartSystem.setQuantity(index, value);
    renderCart();
}

function changeQty(index, delta) {
    const cart = CartSystem.getCart();
    const current = cart[index]?.cantidad ?? 1;
    const next = Math.max(1, parseInt(current, 10) + delta);
    CartSystem.setQuantity(index, next);
    renderCart();
}

function removeItem(index) {
    CartSystem.removeFromCart(index);
    renderCart();
}

let pendingCartAction = null;

function openConfirmModal({ title, message, confirmText, confirmClass, action }) {
    pendingCartAction = action;

    const titleEl = document.getElementById('cartConfirmModalTitle');
    const messageEl = document.getElementById('cartConfirmModalMessage');
    const confirmBtn = document.getElementById('cartConfirmModalConfirm');

    if (titleEl) titleEl.textContent = title || 'Confirmar';
    if (messageEl) messageEl.textContent = message || '¿Estás seguro?';

    if (confirmBtn) {
        confirmBtn.textContent = confirmText || 'Confirmar';
        confirmBtn.className = `btn btn-sm ${confirmClass || 'btn-danger'}`;
    }

    if (window.$) {
        $('#cartConfirmModal').modal('show');
    }
}

function openClearCartConfirm() {
    openConfirmModal({
        title: 'Vaciar carrito',
        message: 'Se vaciará tu carrito de compras. ¿Deseas continuar?',
        confirmText: 'Vaciar',
        confirmClass: 'btn-danger',
        action: { type: 'clear' },
    });
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
    const confirmBtn = document.getElementById('cartConfirmModalConfirm');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
            if (!pendingCartAction) return;

            if (pendingCartAction.type === 'clear') {
                CartSystem.clearCart();
            }

            pendingCartAction = null;
            if (window.$) {
                $('#cartConfirmModal').modal('hide');
            }
            renderCart();
        });
    }

    renderCart();
});
