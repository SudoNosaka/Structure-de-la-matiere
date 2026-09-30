// ============================================
// SYSTÈME DE DIAPORAMA INTERACTIF
// ============================================

class Slideshow {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.slides = this.container ? Array.from(this.container.querySelectorAll('.slide')) : [];
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.controls = null;
        this.counter = null;
        this.dots = null;
    }

    init() {
        if (!this.container || this.slides.length === 0) return;

        // Créer les contrôles
        this.createControls();
        
        // Afficher la première slide
        this.showSlide(0);
        
        // Navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.next();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prev();
            }
        });

        // Support tactile (swipe)
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    createControls() {
        const controlsHTML = `
            <div class="slideshow-controls">
                <button class="slide-btn prev-btn" onclick="slideshow.prev()">
                    <span>←</span> Précédent
                </button>
                <div class="slide-counter">
                    <span id="current-slide">1</span> / <span id="total-slides">${this.totalSlides}</span>
                </div>
                <button class="slide-btn next-btn" onclick="slideshow.next()">
                    Suivant <span>→</span>
                </button>
            </div>
            <div class="progress-dots" id="progress-dots"></div>
        `;
        
        this.container.insertAdjacentHTML('afterend', controlsHTML);
        this.controls = this.container.nextElementSibling;
        this.counter = this.controls.querySelector('.slide-counter');
        
        // Créer les dots
        const dotsContainer = this.controls.querySelector('#progress-dots');
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            dot.onclick = () => this.goToSlide(i);
            dotsContainer.appendChild(dot);
        }
        this.dots = Array.from(dotsContainer.querySelectorAll('.progress-dot'));
    }

    showSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;

        // Masquer toutes les slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.classList.remove('exit-left');
        });

        // Animer la sortie de la slide actuelle
        if (this.currentSlide !== index) {
            const direction = index > this.currentSlide ? 'left' : 'right';
            this.slides[this.currentSlide].classList.add(direction === 'left' ? 'exit-left' : '');
        }

        // Afficher la nouvelle slide
        this.currentSlide = index;
        this.slides[this.currentSlide].classList.add('active');

        // Animer les éléments internes
        this.animateSlideContent(this.slides[this.currentSlide]);

        // Mettre à jour les contrôles
        this.updateControls();

        // Son
        if (typeof playSound === 'function') {
            playSound('swipe');
        }
    }

    animateSlideContent(slide) {
        // Animer les titres
        slide.querySelectorAll('h2, h3').forEach(el => {
            el.classList.add('animate');
        });

        // Animer les paragraphes
        slide.querySelectorAll('p').forEach(el => {
            el.classList.add('animate');
        });

        // Animer les formules
        slide.querySelectorAll('.formula').forEach(el => {
            el.classList.add('animate');
        });

        // Animer les tableaux
        slide.querySelectorAll('.table-custom').forEach(el => {
            el.classList.add('animate');
        });

        // Animer les listes
        slide.querySelectorAll('.content-section').forEach(el => {
            el.classList.add('animate');
        });

        // Animer les warnings
        slide.querySelectorAll('.warning').forEach(el => {
            el.classList.add('animate');
        });
    }

    updateControls() {
        // Mettre à jour le compteur
        const currentSpan = this.controls.querySelector('#current-slide');
        if (currentSpan) {
            currentSpan.textContent = this.currentSlide + 1;
        }

        // Mettre à jour les boutons
        const prevBtn = this.controls.querySelector('.prev-btn');
        const nextBtn = this.controls.querySelector('.next-btn');
        
        if (prevBtn) prevBtn.disabled = this.currentSlide === 0;
        if (nextBtn) nextBtn.disabled = this.currentSlide === this.totalSlides - 1;

        // Mettre à jour les dots
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentSlide);
        });
    }

    next() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.showSlide(this.currentSlide + 1);
        }
    }

    prev() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.next(); // Swipe vers la gauche → slide suivante
            } else {
                this.prev(); // Swipe vers la droite → slide précédente
            }
        }
    }
}

// Instance globale
let slideshow = null;

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    const slideshowContainer = document.getElementById('slideshow-container');
    if (slideshowContainer) {
        slideshow = new Slideshow('slideshow-container');
        slideshow.init();
    }
});