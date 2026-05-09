const CartSystem = {
    storageKey: 'sistema_textil_cart',

    getCart() {
        const cart = localStorage.getItem(this.storageKey);
        return cart ? JSON.parse(cart) : [];
    },

    saveCart(cart) {
        localStorage.setItem(this.storageKey, JSON.stringify(cart));
        this.updateCartCounter();
    },

    addToCart(product) {
        let cart = this.getCart();
        const existingItemIndex = cart.findIndex(item => 
            item.id === product.id && 
            item.talla === product.talla && 
            item.color === product.color
        );

        if (existingItemIndex > -1) {
            cart[existingItemIndex].cantidad += product.cantidad;
        } else {
            cart.push(product);
        }

        this.saveCart(cart);
        return true;
    },

    removeFromCart(index) {
        let cart = this.getCart();
        cart.splice(index, 1);
        this.saveCart(cart);
    },

    setQuantity(index, quantity) {
        let cart = this.getCart();
        if (!cart[index]) return;

        let nextQty = parseInt(quantity, 10);
        if (Number.isNaN(nextQty)) nextQty = 1;
        if (nextQty < 1) nextQty = 1;

        cart[index].cantidad = nextQty;
        this.saveCart(cart);
    },

    clearCart() {
        localStorage.removeItem(this.storageKey);
        this.updateCartCounter();
    },

    updateCartCounter() {
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
        const counterElement = document.getElementById('cart-counter');
        if (counterElement) {
            counterElement.textContent = totalItems;
            counterElement.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    },

    formatWhatsAppMessage() {
        const cart = this.getCart();
        if (cart.length === 0) return null;

        let message = "*RESUMEN DE MI PEDIDO - AMERICAN OUTLET*\n\n";
        let total = 0;

        cart.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            message += `${index + 1}. *${item.nombre}*\n`;
            message += `   - Talla: ${item.talla}\n`;
            message += `   - Color: ${item.color}\n`;
            message += `   - Cantidad: ${item.cantidad}\n`;
            message += `   - Precio: Bs ${item.precio.toFixed(2)}\n`;
            message += `   - Subtotal: Bs ${subtotal.toFixed(2)}\n\n`;
        });

        message += `*TOTAL A PAGAR: Bs ${total.toFixed(2)}*\n\n`;
        message += "_Por favor, confírmenme la disponibilidad para realizar el pago._";

        return encodeURIComponent(message);
    }
};

// Inicializar contador al cargar
document.addEventListener('DOMContentLoaded', () => {
    CartSystem.updateCartCounter();
});
