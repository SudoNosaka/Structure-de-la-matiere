// ============================================
// FLASHCARDS - SYSTÈME COMPLET
// ============================================

let allCards = [];
let filteredCards = [];
let currentIndex = 0;
let isFlipped = false;
let cardStates = {}; // {cardId: 'mastered' | 'review' | null}

const STORAGE_KEY = 'flashcards-progress';

// ============================================
// CHARGEMENT
// ============================================

function loadFlashcards() {
    fetch('../data/flashcards.json')
        .then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(initFlashcards)
        .catch(err => {
            console.warn('Fallback...', err);
            return fetch('data/flashcards.json')
                .then(r => r.json())
                .then(initFlashcards)
                .catch(e => showError(e));
        });
}

function initFlashcards(data) {
    document.getElementById('fc-title').textContent = data.title;
    document.getElementById('fc-subtitle').textContent = data.subtitle;
    
    // Charger les états sauvegardés
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            cardStates = JSON.parse(saved);
        } catch (e) {
            cardStates = {};
        }
    }
    
    // Préparer les cartes
    allCards = data.cards.map(card => {
        const category = data.categories.find(c => c.id === card.category);
        return {
            ...card,
            categoryName: category ? category.name : 'Autre',
            categoryColor: category ? category.color : '#7C3AED'
        };
    });
    
    // Remplir le filtre de catégories
    const categoryFilter = document.getElementById('category-filter');
    data.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categoryFilter.appendChild(option);
    });
    
    filterCards();
}

// ============================================
// FILTRES
// ============================================

function filterCards() {
    const category = document.getElementById('category-filter').value;
    const mode = document.getElementById('mode-filter').value;
    
    filteredCards = allCards.filter(card => {
        if (category !== 'all' && card.category !== category) return false;
        
        if (mode === 'toreview') {
            return cardStates[card.id] === 'review';
        } else if (mode === 'mastered') {
            return cardStates[card.id] === 'mastered';
        }
        return true;
    });
    
    currentIndex = 0;
    isFlipped = false;
    
    if (filteredCards.length === 0) {
        showEmptyState();
    } else {
        displayCard();
    }
    
    updateStats();
}

function showEmptyState() {
    const front = document.getElementById('fc-front-content');
    const back = document.getElementById('fc-back-content');
    front.textContent = 'Aucune carte dans cette catégorie';
    back.textContent = 'Change les filtres pour voir des cartes';
    document.getElementById('fc-counter').textContent = '0 / 0';
    document.getElementById('fc-progress-fill').style.width = '0%';
    document.getElementById('fc-category-badge').style.display = 'none';
}

// ============================================
// AFFICHAGE
// ============================================

function displayCard() {
    if (filteredCards.length === 0) return;
    
    const card = filteredCards[currentIndex];
    const fcCard = document.getElementById('fc-card');
    
    // Reset flip
    isFlipped = false;
    fcCard.classList.remove('flipped');
    
    // Contenu
    document.getElementById('fc-front-content').textContent = card.front;
    document.getElementById('fc-back-content').innerHTML = card.back.replace(/\n/g, '<br>');
    
    // Badge catégorie
    const badge = document.getElementById('fc-category-badge');
    badge.textContent = card.categoryName;
    badge.style.background = card.categoryColor;
    badge.style.display = 'block';
    
    // Compteur
    document.getElementById('fc-counter').textContent = `${currentIndex + 1} / ${filteredCards.length}`;
    
    // Barre de progression
    const progress = ((currentIndex + 1) / filteredCards.length) * 100;
    document.getElementById('fc-progress-fill').style.width = progress + '%';
    
    // Boutons d'état
    updateStateButtons(card.id);
    
    // Animation
    fcCard.classList.add('slide-in');
    setTimeout(() => fcCard.classList.remove('slide-in'), 400);
}

function updateStateButtons(cardId) {
    const btnReview = document.getElementById('btn-review');
    const btnMastered = document.getElementById('btn-mastered');
    
    btnReview.classList.remove('active');
    btnMastered.classList.remove('active');
    
    if (cardStates[cardId] === 'review') {
        btnReview.classList.add('active');
    } else if (cardStates[cardId] === 'mastered') {
        btnMastered.classList.add('active');
    }
}

// ============================================
// NAVIGATION
// ============================================

function flipCard() {
    const fcCard = document.getElementById('fc-card');
    isFlipped = !isFlipped;
    fcCard.classList.toggle('flipped');
    if (typeof playSound === 'function') playSound('click');
}

function nextCard() {
    if (filteredCards.length === 0) return;
    currentIndex = (currentIndex + 1) % filteredCards.length;
    displayCard();
    if (typeof playSound === 'function') playSound('swipe');
}

function previousCard() {
    if (filteredCards.length === 0) return;
    currentIndex = (currentIndex - 1 + filteredCards.length) % filteredCards.length;
    displayCard();
    if (typeof playSound === 'function') playSound('swipe');
}

// ============================================
// ÉTATS (À REVOIR / MAÎTRISÉE)
// ============================================

function markToReview() {
    if (filteredCards.length === 0) return;
    const cardId = filteredCards[currentIndex].id;
    
    if (cardStates[cardId] === 'review') {
        delete cardStates[cardId];
    } else {
        cardStates[cardId] = 'review';
    }
    
    saveProgress();
    updateStateButtons(cardId);
    updateStats();
    if (typeof playSound === 'function') playSound('click');
}

function markMastered() {
    if (filteredCards.length === 0) return;
    const cardId = filteredCards[currentIndex].id;
    
    if (cardStates[cardId] === 'mastered') {
        delete cardStates[cardId];
    } else {
        cardStates[cardId] = 'mastered';
    }
    
    saveProgress();
    updateStateButtons(cardId);
    updateStats();
    if (typeof playSound === 'function') playSound('validate');
}

function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cardStates));
}

function resetProgress() {
    if (!confirm('Réinitialiser toute la progression des flashcards ?')) return;
    cardStates = {};
    localStorage.removeItem(STORAGE_KEY);
    updateStateButtons(filteredCards[currentIndex]?.id);
    updateStats();
    filterCards();
}

// ============================================
// STATS
// ============================================

function updateStats() {
    const total = allCards.length;
    const mastered = Object.values(cardStates).filter(s => s === 'mastered').length;
    const review = Object.values(cardStates).filter(s => s === 'review').length;
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    
    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-mastered').textContent = mastered;
    document.getElementById('stat-review').textContent = review;
    document.getElementById('stat-percent').textContent = percent + '%';
}

// ============================================
// NAVIGATION CLAVIER
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'SELECT') return;
    
    switch(e.key) {
        case 'ArrowRight':
            e.preventDefault();
            nextCard();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousCard();
            break;
        case ' ':
            e.preventDefault();
            flipCard();
            break;
        case 'r':
        case 'R':
            markToReview();
            break;
        case 'm':
        case 'M':
            markMastered();
            break;
    }
});

// ============================================
// ERREUR
// ============================================

function showError(e) {
    document.getElementById('fc-title').textContent = '⚠️ Erreur de chargement';
    document.getElementById('fc-subtitle').textContent = 'Utilise un serveur local';
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', loadFlashcards);