document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicatorDots = Array.from(document.querySelectorAll('.indicator-dot'));

    if (!track) {
        return;
    }

    if (prevBtn) {
        prevBtn.style.pointerEvents = 'auto';
        prevBtn.style.cursor = 'pointer';
    }

    if (nextBtn) {
        nextBtn.style.pointerEvents = 'auto';
        nextBtn.style.cursor = 'pointer';
    }

    const autoPlayDelay = 5000;
    const gapPx = 24;
    let currentIndex = 0;
    let autoPlayInterval = null;
    let isAnimating = false;

    function getItems() {
        return Array.from(track.querySelectorAll('.featured-carousel-item'));
    }

    function getVisibleCount() {
        const viewportWidth = window.innerWidth;
        const totalItems = getItems().length;

        if (viewportWidth <= 576) {
            return Math.min(totalItems, 2);
        }

        if (viewportWidth <= 768) {
            return Math.min(totalItems, 3);
        }

        if (viewportWidth <= 1200) {
            return Math.min(totalItems, 4);
        }

        return totalItems;
    }

    function calculateItemWidth() {
        const wrapper = track.parentElement;
        const styles = window.getComputedStyle(wrapper);
        const paddingLeft = parseFloat(styles.paddingLeft) || 0;
        const paddingRight = parseFloat(styles.paddingRight) || 0;
        const wrapperWidth = wrapper.getBoundingClientRect().width;
        const innerWidth = wrapperWidth - paddingLeft - paddingRight;
        const visibleCount = getVisibleCount();

        if (!visibleCount) {
            return 0;
        }

        const totalGapWidth = Math.max(visibleCount - 1, 0) * gapPx;
        const availableWidth = innerWidth - totalGapWidth;

        return Math.max(availableWidth / visibleCount, 0);
    }

    function setItemWidths() {
        const itemWidth = calculateItemWidth();

        getItems().forEach(item => {
            item.style.width = `${itemWidth}px`;
            item.style.flexBasis = `${itemWidth}px`;
            item.style.minWidth = `${itemWidth}px`;
        });
    }

    function updateIndicators() {
        const totalDots = indicatorDots.length;
        if (!totalDots) {
            return;
        }

        const activeIndex = ((currentIndex % totalDots) + totalDots) % totalDots;
        indicatorDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    function finishAnimation(items) {
        items.forEach(item => {
            item.style.transition = '';
            item.style.transform = '';
        });
        isAnimating = false;
    }

    function animateRotation(direction) {
        if (isAnimating) {
            return;
        }

        const items = getItems();
        if (items.length <= 1) {
            return;
        }

        isAnimating = true;

        const firstRects = new Map();
        items.forEach(item => {
            firstRects.set(item, item.getBoundingClientRect());
        });

        if (direction === 'next') {
            track.appendChild(track.firstElementChild);
        } else {
            track.insertBefore(track.lastElementChild, track.firstElementChild);
        }

        const reorderedItems = getItems();
        reorderedItems.forEach(item => {
            const firstRect = firstRects.get(item);
            const lastRect = item.getBoundingClientRect();
            const deltaX = firstRect.left - lastRect.left;

            if (deltaX) {
                item.style.transition = 'none';
                item.style.transform = `translateX(${deltaX}px)`;
            }
        });

        requestAnimationFrame(() => {
            reorderedItems.forEach(item => {
                item.style.transition = 'transform 0.6s ease-out';
                item.style.transform = 'translateX(0)';
            });

            window.setTimeout(() => {
                finishAnimation(reorderedItems);
            }, 650);
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % getItems().length;
        animateRotation('next');
        updateIndicators();
        resetAutoPlay();
    }

    function prevSlide() {
        const totalItems = getItems().length;
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        animateRotation('prev');
        updateIndicators();
        resetAutoPlay();
    }

    function goToSlide(index) {
        if (isAnimating) {
            return;
        }

        const totalItems = getItems().length;
        if (!totalItems) {
            return;
        }

        const targetIndex = ((index % totalItems) + totalItems) % totalItems;
        const diff = (targetIndex - currentIndex + totalItems) % totalItems;

        if (diff === 0) {
            return;
        }

        const direction = diff <= totalItems / 2 ? 'next' : 'prev';
        const steps = direction === 'next' ? diff : totalItems - diff;
        let remainingSteps = steps;

        const moveOnce = () => {
            if (remainingSteps <= 0) {
                updateIndicators();
                resetAutoPlay();
                return;
            }

            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % totalItems;
                animateRotation('next');
            } else {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                animateRotation('prev');
            }

            remainingSteps -= 1;

            if (remainingSteps > 0) {
                window.setTimeout(moveOnce, 700);
            } else {
                updateIndicators();
                resetAutoPlay();
            }
        };

        moveOnce();
    }

    const handleNextClick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        nextSlide();
    };

    const handlePrevClick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        prevSlide();
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextClick);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', handlePrevClick);
    }

    indicatorDots.forEach((dot, index) => {
        dot.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            goToSlide(index);
        });
    });

    const section = document.querySelector('.featured-carousel-section');
    if (section) {
        section.addEventListener('mouseenter', stopAutoPlay);
        section.addEventListener('mouseleave', startAutoPlay);
        section.addEventListener('touchstart', stopAutoPlay, { passive: true });
        section.addEventListener('touchend', resetAutoPlay);
    }

    window.addEventListener('resize', function() {
        setItemWidths();
    });

    setItemWidths();
    updateIndicators();
    startAutoPlay();
});
