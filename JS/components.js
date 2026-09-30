// ============================================
// CARROUSELS HORIZONTAUX (SCROLL-SNAP)
// ============================================

function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;
    
    const card = carousel.querySelector('.carousel-card');
    if (!card) return;
    
    const cardWidth = card.offsetWidth + 16;
    carousel.scrollBy({
        left: cardWidth * direction,
        behavior: 'smooth'
    });
    
    if (typeof playSound === 'function') {
        playSound('swipe');
    }
}

function initCarousels() {
    const carousels = document.querySelectorAll('.carousel-track');
    
    carousels.forEach(carousel => {
        const wrapper = carousel.closest('.carousel-wrapper');
        if (!wrapper) return;
        
        const prevBtn = wrapper.querySelector('.carousel-arrow.left');
        const nextBtn = wrapper.querySelector('.carousel-arrow.right');
        
        function updateButtons() {
            const maxScroll = carousel.scrollWidth - carousel.clientWidth - 1;
            if (prevBtn) prevBtn.disabled = carousel.scrollLeft <= 0;
            if (nextBtn) nextBtn.disabled = carousel.scrollLeft >= maxScroll;
        }
        
        carousel.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', updateButtons);
        setTimeout(updateButtons, 200);
    });
}

// ============================================
// PROGRESSION
// ============================================

function updateProgress(pct) {
    const fill = document.querySelector('.progress-fill');
    const text = document.querySelector('.progress-text');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = pct + '% complété';
}

function saveProgress(pct) {
    if (typeof CONFIG !== 'undefined' && CONFIG.progress) {
        localStorage.setItem(CONFIG.progress.storageKey, pct);
    }
}

function loadProgress() {
    if (typeof CONFIG !== 'undefined' && CONFIG.progress) {
        const saved = localStorage.getItem(CONFIG.progress.storageKey);
        return saved ? parseInt(saved) : 0;
    }
    return 0;
}

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initCarousels();
    const progress = loadProgress();
    updateProgress(progress);
});