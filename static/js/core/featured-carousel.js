document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicatorDots = document.querySelectorAll('.indicator-dot');
    
    let currentIndex = 0;
    let autoPlayInterval;
    const autoPlayDelay = 5000; // 5 segundos
    
    if (!track) return;
    
    const items = document.querySelectorAll('.featured-carousel-item');
    const totalItems = items.length;
    
    // Calcular cuántos items mostrar a la vez
    function getItemsPerView() {
        const width = window.innerWidth;
        if (width > 1200) return 4;
        if (width > 768) return 3;
        if (width > 576) return 2;
        return 1;
    }
    
    function updateCarousel() {
        const itemsPerView = getItemsPerView();
        const gapSize = 1.5; // rem, convertir a px
        const gapPx = gapSize * 16; // Asumir 16px = 1rem
        
        const trackWidth = track.parentElement.offsetWidth - 112; // Restar botones
        const itemWidth = (trackWidth - (gapPx * (itemsPerView - 1))) / itemsPerView;
        
        const offset = -(currentIndex * (itemWidth + gapPx));
        track.style.transform = `translateX(${offset}px)`;
        
        // Actualizar indicadores
        indicatorDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function nextSlide() {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        currentIndex = (currentIndex >= maxIndex) ? 0 : currentIndex + 1;
        updateCarousel();
        resetAutoPlay();
    }
    
    function prevSlide() {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        currentIndex = (currentIndex <= 0) ? maxIndex : currentIndex - 1;
        updateCarousel();
        resetAutoPlay();
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoPlay();
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    indicatorDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Pausar autoplay al pasar el mouse
    const section = document.querySelector('.featured-carousel-section');
    if (section) {
        section.addEventListener('mouseenter', stopAutoPlay);
        section.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Actualizar en redimensionamiento
    window.addEventListener('resize', updateCarousel);
    
    // Inicializar
    updateCarousel();
    startAutoPlay();
});
