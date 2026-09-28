function renderNotion(notionKey) {
    fetch(`../data/${notionKey}.json`)
        .then(response => {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
        })
        .then(data => {
            try {
                renderNotionData(data, notionKey);
            } catch (e) {
                console.error('Erreur de rendu:', e);
                document.getElementById('content').innerHTML = `
                    <div class="warning">
                        <h3>⚠️ Erreur d'affichage</h3>
                        <p>${e.message}</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.warn('Fetch échoué, fallback...', error);
            return fetch(`data/${notionKey}.json`)
                .then(r => r.json())
                .then(data => renderNotionData(data, notionKey))
                .catch(err => {
                    document.getElementById('content').innerHTML = `
                        <div class="warning">
                            <h3>⚠️ Impossible de charger</h3>
                            <p>Utilise un serveur local.</p>
                        </div>
                    `;
                });
        });
}

function renderNotionData(notion, notionKey) {
    document.getElementById('notion-title').textContent = notion.title || 'Chargement...';
    document.getElementById('notion-subtitle').textContent = notion.subtitle || '';
    document.title = `Notion ${notionKey.replace('notion', '')} - ${notion.title || ''}`;
    
    const contentDiv = document.getElementById('content');
    let html = '';
    
    // Boutons globaux
    html += `<div class="accordion-controls">
        <button class="accordion-btn" onclick="expandAll()">Tout déplier</button>
        <button class="accordion-btn" onclick="collapseAll()">Tout plier</button>
    </div>`;
    
    if (notion.sections && Array.isArray(notion.sections)) {
        notion.sections.forEach(section => {
            html += renderSection(section);
        });
    }
    
    contentDiv.innerHTML = html;
    
    // Initialiser les accordéons APRès insertion du HTML
    if (typeof initAccordions === 'function') {
        initAccordions();
    }
    addSoundEffects();
}

function renderSection(section) {
    if (!section) return '';
    
    let html = `<div class="collapsible" data-collapsed="false">
        <div class="collapsible-header">
            <h2>${section.title || ''}</h2>
            <span class="collapsible-icon">▼</span>
        </div>
        <div class="collapsible-content">`;
    
    if (section.content) html += `<p>${section.content}</p>`;
    if (section.formulation) html += `<p><em>${section.formulation}</em></p>`;
    if (section.interpretation) html += `<p><em>${section.interpretation}</em></p>`;
    
    // Formules
    if (section.formula) html += renderFormulaCollapsible(section.formula);
    if (section.formula2) html += renderFormulaCollapsible(section.formula2);
    if (section.equation) html += renderFormulaCollapsible(section.equation);
    if (section.solution) html += renderFormulaCollapsible(section.solution);
    if (section.formulas && Array.isArray(section.formulas)) {
        section.formulas.forEach(f => html += renderFormulaCollapsible(f));
    }
    
    // Listes
    if (section.list && Array.isArray(section.list)) {
        html += `<ul>${section.list.map(i => `<li>${i}</li>`).join('')}</ul>`;
    }
    if (section.observations && Array.isArray(section.observations)) {
        html += renderCollapsibleBlock('Observations', `<ul>${section.observations.map(i => `<li>${i}</li>`).join('')}</ul>`);
    }
    if (section.applications && Array.isArray(section.applications)) {
        html += renderCollapsibleBlock('Applications', `<ul>${section.applications.map(i => `<li>${i}</li>`).join('')}</ul>`);
    }
    if (section.method && Array.isArray(section.method)) {
        html += renderCollapsibleBlock('Méthode', `<ol>${section.method.map(i => `<li>${i}</li>`).join('')}</ol>`);
    }
    if (section.structure && Array.isArray(section.structure)) {
        html += `<ul>${section.structure.map(i => `<li>${i}</li>`).join('')}</ul>`;
    }
    
    // Exemples
    if (section.example) {
        html += renderCollapsibleBlock('Exemple', section.example, 'example-collapsible');
    }
    if (section.examples && Array.isArray(section.examples) && section.examples.length > 0) {
        html += renderTableCollapsible('Exemples', section.examples);
    }
    
    // Tableaux
    if (section.table && Array.isArray(section.table) && section.table.length > 0) {
        html += renderTableCollapsible('Tableau', section.table);
    }
    if (section.types && Array.isArray(section.types) && section.types.length > 0) {
        html += renderTableCollapsible('Types', section.types);
    }
    if (section.calculations && Array.isArray(section.calculations) && section.calculations.length > 0) {
        html += renderTableCollapsible('Calculs', section.calculations);
    }
    
    // Avertissements et conséquences
    if (section.warning) {
        html += `<div class="collapsible warning-collapsible" data-collapsed="true">
            <div class="collapsible-header">
                <h4>⚠️ Attention</h4>
                <span class="collapsible-icon">▼</span>
            </div>
            <div class="collapsible-content">
                <p>${section.warning}</p>
            </div>
        </div>`;
    }
    if (section.consequence) {
        html += renderCollapsibleBlock('Conséquence', section.consequence);
    }
    
    // Total
    if (section.total) html += renderFormulaCollapsible('Total : ' + section.total);
    
    // Sous-sections (accordéons imbriqués)
    if (section.subsections && Array.isArray(section.subsections)) {
        section.subsections.forEach(sub => {
            if (!sub) return;
            html += `<div class="collapsible" data-collapsed="true">
                <div class="collapsible-header">
                    <h3>${sub.title || ''}</h3>
                    <span class="collapsible-icon">▼</span>
                </div>
                <div class="collapsible-content">`;
            
            if (sub.content) html += `<p>${sub.content}</p>`;
            if (sub.content2) html += `<p>${sub.content2}</p>`;
            if (sub.formulation) html += `<p><em>${sub.formulation}</em></p>`;
            if (sub.interpretation) html += `<p><em>${sub.interpretation}</em></p>`;
            if (sub.formula) html += renderFormulaCollapsible(sub.formula);
            if (sub.formula2) html += renderFormulaCollapsible(sub.formula2);
            if (sub.formulas && Array.isArray(sub.formulas)) {
                sub.formulas.forEach(f => html += renderFormulaCollapsible(f));
            }
            if (sub.list && Array.isArray(sub.list)) {
                html += `<ul>${sub.list.map(i => `<li>${i}</li>`).join('')}</ul>`;
            }
            if (sub.table && Array.isArray(sub.table) && sub.table.length > 0) {
                html += renderTableCollapsible('Tableau', sub.table);
            }
            if (sub.calculations && Array.isArray(sub.calculations) && sub.calculations.length > 0) {
                html += renderTableCollapsible('Calculs', sub.calculations);
            }
            if (sub.warning) {
                html += `<div class="collapsible warning-collapsible" data-collapsed="true">
                    <div class="collapsible-header">
                        <h4>⚠️ Attention</h4>
                        <span class="collapsible-icon">▼</span>
                    </div>
                    <div class="collapsible-content">
                        <p>${sub.warning}</p>
                    </div>
                </div>`;
            }
            if (sub.consequence) {
                html += renderCollapsibleBlock('Conséquence', sub.consequence);
            }
            
            html += `</div></div>`;
        });
    }
    
    html += `</div></div>`;
    return html;
}

// Fonctions utilitaires pour les accordéons
function renderFormulaCollapsible(formula) {
    return `<div class="collapsible formula-collapsible" data-collapsed="true">
        <div class="collapsible-header">
            <h4>📐 Formule</h4>
            <span class="collapsible-icon">▼</span>
        </div>
        <div class="collapsible-content">
            <div class="formula">${formula}</div>
        </div>
    </div>`;
}

function renderCollapsibleBlock(title, content, extraClass = '') {
    return `<div class="collapsible ${extraClass}" data-collapsed="true">
        <div class="collapsible-header">
            <h4>${title}</h4>
            <span class="collapsible-icon">▼</span>
        </div>
        <div class="collapsible-content">
            ${typeof content === 'string' ? `<p>${content}</p>` : content}
        </div>
    </div>`;
}

function renderTableCollapsible(title, arr) {
    if (!arr || !Array.isArray(arr) || arr.length === 0) return '';
    
    try {
        const keys = Object.keys(arr[0]);
        let tableHtml = `<table class="table-custom"><tr>`;
        keys.forEach(k => {
            tableHtml += `<th>${k.replace(/_/g, ' ')}</th>`;
        });
        tableHtml += `</tr>`;
        arr.forEach(row => {
            tableHtml += `<tr>`;
            keys.forEach(k => {
                const val = row[k] !== undefined && row[k] !== null ? row[k] : '';
                tableHtml += `<td>${val}</td>`;
            });
            tableHtml += `</tr>`;
        });
        tableHtml += `</table>`;
        
        return `<div class="collapsible table-collapsible" data-collapsed="true">
            <div class="collapsible-header">
                <h4>📊 ${title}</h4>
                <span class="collapsible-icon">▼</span>
            </div>
            <div class="collapsible-content">
                ${tableHtml}
            </div>
        </div>`;
    } catch (e) {
        console.error('Erreur tableau:', e);
        return '<p><em>Erreur d\'affichage</em></p>';
    }
}

function addSoundEffects() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof playSound === 'function') playSound('swipe');
        });
    });
}