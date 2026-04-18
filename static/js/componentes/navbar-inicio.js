document.addEventListener('DOMContentLoaded', function () {
    const navbarToggler = document.querySelector('.navbar-toggler-inicio');
    const navbarCollapse = document.querySelector('#navbarInicio');

    const navLinks = document.querySelectorAll('#navbarInicio a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarToggler && navbarCollapse && navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    const btnLogin = document.querySelector('.btn-inicio-login');
    if (btnLogin) {
        btnLogin.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.position = 'absolute';
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.45)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple-anim 0.6s ease-out';
            ripple.style.pointerEvents = 'none';

            if (!document.querySelector('style[data-navbar-ripple]')) {
                const style = document.createElement('style');
                style.setAttribute('data-navbar-ripple', 'true');
                style.textContent = `
                    @keyframes ripple-anim {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    }

    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar-inicio');
        if (navbar) {
            if (window.scrollY > 10) {
                navbar.style.boxShadow = '0 6px 22px rgba(0, 0, 0, 0.22)';
            } else {
                navbar.style.boxShadow = '0 2px 14px rgba(0, 0, 0, 0.18)';
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
