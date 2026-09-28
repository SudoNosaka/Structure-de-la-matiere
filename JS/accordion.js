// ============================================
// SYSTÈME D'ACCORDÉON UNIVERSEL
// ============================================

function initAccordions() {
    // Sélectionner tous les éléments collapsibles
    const collapsibles = document.querySelectorAll('.collapsible');
    
    collapsibles.forEach(collapsible => {
        const header = collapsible.querySelector('.collapsible-header');
        const content = collapsible.querySelector('.collapsible-content');
        const icon = collapsible.querySelector('.collapsible-icon');
        
        if (!header || !content) return;
        
        // État initial
        const isCollapsed = collapsible.getAttribute('data-collapsed') === 'true';
        if (isCollapsed) {
            content.style.maxHeight = '0';
            content.style.opacity = '0';
            if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
            if (icon) icon.style.transform = 'rotate(180deg)';
        }
        
        // Clic sur le header
        header.addEventListener('click', () => {
            toggleCollapsible(collapsible);
            if (typeof playSound === 'function') playSound('click');
        });
        
        // Accessibilité : navigation clavier
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', !isCollapsed);
        
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCollapsible(collapsible);
            }
        });
    });
}

function toggleCollapsible(collapsible) {
    const content = collapsible.querySelector('.collapsible-content');
    const icon = collapsible.querySelector('.collapsible-icon');
    const header = collapsible.querySelector('.collapsible-header');
    
    const isCollapsed = collapsible.getAttribute('data-collapsed') === 'true';
    
    if (isCollapsed) {
        // Déplier
        collapsible.setAttribute('data-collapsed', 'false');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        if (icon) icon.style.transform = 'rotate(180deg)';
        if (header) header.setAttribute('aria-expanded', 'true');
    } else {
        // Plier
        collapsible.setAttribute('data-collapsed', 'true');
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        if (icon) icon.style.transform = 'rotate(0deg)';
        if (header) header.setAttribute('aria-expanded', 'false');
    }
}

// Fonction utilitaire pour plier/déplier tout
function collapseAll() {
    document.querySelectorAll('.collapsible').forEach(c => {
        if (c.getAttribute('data-collapsed') !== 'true') {
            toggleCollapsible(c);
        }
    });
}

function expandAll() {
    document.querySelectorAll('.collapsible').forEach(c => {
        if (c.getAttribute('data-collapsed') === 'true') {
            toggleCollapsible(c);
        }
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', initAccordions);

// Réinitialiser les hauteurs après chargement des images ou contenu dynamique
window.addEventListener('load', () => {
    document.querySelectorAll('.collapsible[data-collapsed="false"] .collapsible-content').forEach(content => {
        content.style.maxHeight = content.scrollHeight + 'px';
    });
});