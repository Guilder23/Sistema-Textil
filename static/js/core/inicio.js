/* ================================================
   PÁGINA INICIO - JavaScript Específico
   ================================================ */

document.addEventListener('DOMContentLoaded', function() {
    initializeProductoCards();
    initializeModals();
    initializeFilterAnimations();
    initializePaginationAnimations();
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
    const filterForm = document.getElementById('filterForm');
    const filterInputs = document.querySelectorAll('.form-control-sm');
    
    if (!filterForm) return;

    filterInputs.forEach(input => {
        // Efecto focus con sombra
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 12px rgba(59, 130, 246, 0.3)';
        });

        input.addEventListener('blur', function() {
            this.style.boxShadow = '';
        });

        // Auto-submit cuando se cambia el filtro
        input.addEventListener('change', function() {
            filterForm.submit();
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
