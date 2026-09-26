let textesData = null;

function loadTextesATrous() {
    fetch('../data/textesatrous.json')
        .then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(initTextesATrous)
        .catch(err => {
            console.warn('Fallback...', err);
            return fetch('data/textesatrous.json')
                .then(r => r.json())
                .then(initTextesATrous)
                .catch(e => showError(e));
        });
}

function initTextesATrous(data) {
    textesData = data;
    document.getElementById('title').textContent = data.title;
    document.getElementById('subtitle').textContent = data.subtitle;
    renderContent();
}

function renderContent() {
    const container = document.getElementById('content');
    let html = '';
    textesData.sections.forEach(section => {
        html += `<section class="content-section fade-in"><h2>${section.title}</h2>`;
        section.texts.forEach(t => {
            const content = t.content.replace(/\{([^}]+)\}/g, (match, answer) => {
                return `<input type="text" class="fill-blank" data-answer="${answer}" placeholder="?">`;
            });
            html += `<div class="text-block"><p>${content}</p>`;
            if (t.hint) html += `<p class="hint">💡 ${t.hint}</p>`;
            html += `</div>`;
        });
        html += `</section>`;
    });
    container.innerHTML = html;
}

function checkAll() {
    const blanks = document.querySelectorAll('.fill-blank');
    let correct = 0;
    blanks.forEach(b => {
        const user = normalize(b.value);
        const answer = normalize(b.dataset.answer);
        if (user === answer) {
            b.classList.add('correct');
            b.classList.remove('incorrect');
            correct++;
        } else {
            b.classList.add('incorrect');
            b.classList.remove('correct');
        }
    });
    const pct = Math.round(correct / blanks.length * 100);
    document.getElementById('score').textContent = `${correct}/${blanks.length} (${pct}%)`;
    let msg = pct >= 80 ? '🎉 Excellent !' : pct >= 60 ? '👍 Pas mal !' : '📚 À revoir !';
    document.getElementById('message').textContent = msg;
    document.getElementById('global-score').style.display = 'block';
    if (typeof playSound === 'function') playSound('validate');
}

function resetAll() {
    document.querySelectorAll('.fill-blank').forEach(b => {
        b.value = '';
        b.classList.remove('correct', 'incorrect');
    });
    document.getElementById('global-score').style.display = 'none';
}

function normalize(s) {
    return s.toLowerCase().trim()
        .replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a')
        .replace(/[îï]/g, 'i').replace(/[ô]/g, 'o')
        .replace(/[ùû]/g, 'u').replace(/[ç]/g, 'c');
}

function showError(e) {
    document.getElementById('title').textContent = '⚠️ Erreur de chargement';
    document.getElementById('content').innerHTML = `
        <div class="warning">
            <p>Impossible de charger les textes à trous. Utilise un serveur local.</p>
        </div>
    `;
}