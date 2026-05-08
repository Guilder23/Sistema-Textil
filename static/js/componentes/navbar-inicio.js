document.addEventListener('DOMContentLoaded', function () {
    const navbarToggler = document.querySelector('.navbar-toggler-inicio');
    const navbarClose = document.querySelector('.navbar-close-inicio');
    const navbarCollapse = document.querySelector('#navbarInicio');
    const body = document.body;

    let navbarOverlay = document.querySelector('.navbar-overlay');
    if (!navbarOverlay) {
        navbarOverlay = document.createElement('div');
        navbarOverlay.className = 'navbar-overlay';
        body.appendChild(navbarOverlay);
    }

    function openNavbar() {
        if (navbarCollapse) {
            navbarCollapse.classList.add('show');
        }
        navbarOverlay.classList.add('active');
    }

    function closeNavbar() {
        if (navbarCollapse) {
            navbarCollapse.classList.remove('show');
        }
        navbarOverlay.classList.remove('active');
    }

    function toggleNavbar(e) {
        if (e) e.stopPropagation();
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            closeNavbar();
        } else {
            openNavbar();
        }
    }

    if (navbarToggler) {
        navbarToggler.addEventListener('click', toggleNavbar);
    }

    if (navbarClose) {
        navbarClose.addEventListener('click', function (e) {
            e.preventDefault();
            closeNavbar();
        });
    }

    // Cerrar al hacer click fuera (en el overlay)
    navbarOverlay.addEventListener('click', function (e) {
        closeNavbar();
    });

    // También cerrar si se hace click en cualquier parte del documento fuera del menú
    document.addEventListener('click', function (e) {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                closeNavbar();
            }
        }
    });

    const navLinks = document.querySelectorAll('#navbarInicio a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                closeNavbar();
            }
        });
    });

    // (Sin ripple en login: ahora es un botón de icono)

    // Search toggle (show/hide inline search input)
    const navSearchBtn = document.getElementById('navSearchBtn');
    const navSearchForm = document.getElementById('navSearchForm');
    const navSearchInput = document.getElementById('navSearchInput');

    function closeNavSearch() {
        if (navSearchForm && !navSearchForm.classList.contains('d-none')) {
            navSearchForm.classList.add('d-none');
        }
    }

    if (navSearchBtn && navSearchForm) {
        navSearchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navSearchForm.classList.toggle('d-none');
            if (!navSearchForm.classList.contains('d-none')) {
                setTimeout(() => navSearchInput && navSearchInput.focus(), 0);
            }
        });

        // Close when clicking outside (also stop propagation when clicking inside)
        document.addEventListener('click', function(e) {
            if (!navSearchForm || navSearchForm.classList.contains('d-none')) return;
            if (navSearchForm.contains(e.target) || navSearchBtn.contains(e.target)) return;
            navSearchForm.classList.add('d-none');
        });

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeNavSearch();
        });
    }

    // Filtros (dropdown): al abrir, cerrar el buscador inline si está abierto
    const navFilterBtn = document.getElementById('navFilterBtn');
    if (navFilterBtn) {
        navFilterBtn.addEventListener('click', function () {
            try { closeNavSearch(); } catch (err) {}
        });
    }

    // No cerrar el dropdown al interactuar con el formulario de filtros
    const filtersDropdown = document.querySelector('.nav-filters-dropdown');
    if (filtersDropdown) {
        filtersDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar-inicio');
        if (navbar) {
            if (window.scrollY > 10) {
                navbar.style.boxShadow = '0 6px 22px rgba(0, 0, 0, 0.12)';
            } else {
                navbar.style.boxShadow = '0 2px 18px rgba(15, 23, 42, 0.08)';
            }
        }
    });

    const navbar = document.querySelector('.navbar-inicio');
    if (navbar) {
        navbar.style.opacity = '0';
        navbar.style.transform = 'translateY(-12px)';
        setTimeout(() => {
            navbar.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            navbar.style.opacity = '1';
            navbar.style.transform = 'translateY(0)';
        }, 30);
    }
});
