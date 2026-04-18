/* ================================================
   PÁGINA INICIO - JavaScript Específico
   ================================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeProductoCards();
    initializeModals();
    initializeFilterAnimations();
    initializePaginationAnimations();

    // Modal producto index: poblar datos y WhatsApp
    const productoCards = document.querySelectorAll('.producto-card');
    const modal = document.getElementById('modalProductoInicio');
    if (productoCards && modal) {
        productoCards.forEach(card => {
            card.addEventListener('click', function() {
                document.getElementById('inicioModalNombre').textContent = this.dataset.nombre || '';
                document.getElementById('inicioModalCategoria').textContent = this.dataset.categoria || '';
                document.getElementById('inicioModalCodigo').textContent = this.dataset.codigo || '';
                document.getElementById('inicioModalDetalle').textContent = this.dataset.detalle || '';
                document.getElementById('inicioModalStock').textContent = this.dataset.stock || '';
                document.getElementById('inicioModalPrecioUnidadBs').textContent = this.dataset['precioUnidadBs'] || '';
                document.getElementById('inicioModalPrecioCajaBs').textContent = this.dataset['precioCajaBs'] || '';
                document.getElementById('inicioModalImagen').src = this.dataset.imagen || '';
                // WhatsApp
                var nombre = this.dataset.nombre || '';
                var codigo = this.dataset.codigo || '';
                var whatsapp = document.getElementById('btnWhatsappModalInicio');
                var numero = '591XXXXXXXXX'; // Cambia por el número real
                var mensaje = encodeURIComponent('Hola, quiero información sobre el producto ' + nombre + ' (código: ' + codigo + ')');
                if (whatsapp) whatsapp.href = 'https://wa.me/' + numero + '?text=' + mensaje;
            });
        });
    }
});

/* ================================================
   PRODUCTO CARDS - ANIMACIONES Y HOVER
   ================================================ */

function initializeProductoCards() {
    const cards = document.querySelectorAll('.producto-card');
    
    cards.forEach(card => {
        // Efecto hover con ripple
        card.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
        });

        // Click para abrir modal
        card.addEventListener('click', function(e) {
            if (e.target.closest('.btn')) return;
            const modalId = this.getAttribute('data-modal-id');
            if (modalId) {
                const modal = new bootstrap.Modal(document.getElementById(modalId));
                modal.show();
            }
        });
    });
}

/* ================================================
   MODAL - INTERACCIONES
   ================================================ */

function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('show.bs.modal', function(e) {
            this.style.animation = 'fadeInUp 0.3s ease';
        });
    });
}

/* ================================================
   FILTROS - ANIMACIONES
   ================================================ */

function initializeFilterAnimations() {
    const filterForm = document.getElementById('formFiltrosInicio');
    const filterInputs = filterForm ? filterForm.querySelectorAll('input, select') : [];
    
    if (!filterForm) return;

    let submitTimer = null;
    const scheduleSubmit = (delay = 250) => {
        if (submitTimer) window.clearTimeout(submitTimer);
        submitTimer = window.setTimeout(() => {
            // Agregar hash para mantener el scroll en catálogo
            const form = filterForm;
            if (form) {
                const action = form.getAttribute('action') || window.location.pathname;
                const params = new URLSearchParams(new FormData(form)).toString();
                window.location.href = action + '?' + params + '#catalogo';
            }
        }, delay);
    };

    filterInputs.forEach(input => {
        // Efecto focus con sombra
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 12px rgba(59, 130, 246, 0.3)';
        });

        input.addEventListener('blur', function() {
            this.style.boxShadow = '';
        });

        const tag = (input.tagName || '').toLowerCase();
        if (tag === 'select') {
            input.addEventListener('change', function() {
                scheduleSubmit(0);
            });
            return;
        }

        input.addEventListener('input', function() {
            scheduleSubmit(300);
        });

        input.addEventListener('change', function() {
            scheduleSubmit(0);
        });
    });
}

/* ================================================
   PAGINACIÓN - ANIMACIONES
   ================================================ */

function initializePaginationAnimations() {
    const paginationLinks = document.querySelectorAll('.pagination a');
    
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Agregar efecto de clic
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.5)';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.animation = 'rippleEffect 0.6s ease-out';
        });
    });
}

/* ================================================
   ANIMACIÓN RIPPLE (CSS-based)
   ================================================ */

const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(2);
        }
    }
`;
document.head.appendChild(style);

/* ================================================
   UTILIDADES
   ================================================ */

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Lazy loading de imágenes
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
