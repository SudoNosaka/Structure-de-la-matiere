# Cahier SDM - Structure de la Matière

*MAJ : 26-09-26*

## Architecture du projet
/
├── index.html # Point d'entrée
├── parametres.html # Toggle thème + lien GitHub Issues
├── Cahier SDM.md # Ce fichier (progression)
│
├── /css/
│ ├── style.css # Design violet clair + rouge sombre
│ └── animations.css # Transitions subtiles
│
├── /JS/
│ ├── config.js # Paramètres globaux
│ ├── theme.js # Toggle light/dark
│ ├── components.js # Header/nav/footer réutilisables
│ ├── sound.js # Micro-sons discrets
│ ├── notion-renderer.js # Renderer générique pour les notions
│ ├── quiz-renderer.js # Renderer générique pour les quiz
│ ├── textesatrous-renderer.js # Renderer pour textes à trous
│ └── td-renderer.js # Renderer générique pour les TD
│
├── /theorie/
│ ├── bases.html
│ ├── resume.html
│ └── notion1.html → notion6.html
│
├── /pratique/
│ ├── quiz1.html → quiz3.html
│ ├── textesatrous.html
│ └── td1.html → td7.html
│
├── /data/
│ ├── notion1.json → notion6.json # Contenu des notions
│ ├── quiz1.json → quiz3.json # Questions des quiz
│ ├── textesatrous.json # Textes à compléter
│ └── td1.json → td7.json # Exercices des TD
│
├── /assets/
│ ├── /fonts/
│ ├── /icons/
│ ├── /sounds/
│ │ ├── click.mp3
│ │ ├── swipe.mp3
│ │ └── validate.mp3
│ └── /videos/
│
└── /Ressources/
├── 09-09-26.pdf
├── 10-06-26.pdf
├── 14-06-26.pdf
├── 16-09-26.pdf
├── 21-09-26.pdf
├── 23-09-26.pdf
└── TD d'entrainement.pdf

## Progression du cours

Nous en sommes au 6ème cours de 1h30 soit : 47% du total de cours sur le semestre 1

### Cours traités
- [x] 09-09-26 : Constituants de la matière & Radioactivité
- [x] 10-06-26 : Loi de désintégration radioactive
- [x] 14-06-26 : Structure électronique quantique (Bohr, de Broglie, Heisenberg)
- [x] 16-09-26 : Équation de Schrödinger & Orbitales
- [x] 21-09-26 : Configuration électronique (Pauli, Klechkowski, Hund)
- [x] 23-09-26 : Approximation hydrogénoïde, Slater & Tableau périodique

### Fichiers générés

#### Théorie (`/theorie/`)
- [x] `bases.html` - Prérequis fondamentaux
- [x] `resume.html` - Résumé Pareto (20% = 80%)
- [x] `notion1.html` à `notion6.html` - Cours détaillés

#### Pratique (`/pratique/`)
- [x] `quiz1.html` à `quiz3.html` - Quiz interactifs (15 questions chacun)
- [x] `textesatrous.html` - Exercice de rappel actif (18 textes à trous)
- [x] `td1.html` à `td7.html` - 46 exercices avec corrections

#### Données (`/data/`)
- [x] `notion1.json` à `notion6.json` - Contenu structuré des notions
- [x] `quiz1.json` à `quiz3.json` - Questions des quiz
- [x] `textesatrous.json` - Textes à compléter
- [x] `td1.json` à `td7.json` - Exercices des TD

## Méthodologie de révision

### Quotidien (10 min)
1. Relire `theorie/resume.html`
2. Faire un quiz ou textes à trous

### Hebdomadaire (15 min)
1. Relecture approfondie des notions
2. Méthode Pomodoro : 15 min travail / 3 min pause

### Pratique
1. Faire les TD1 à TD7 dans l'ordre
2. Utiliser les aides de résolution si besoin
3. Vérifier avec les corrections

## Prochaines étapes
- [ ] Ajouter les cours manquants
- [ ] Générer `theorie/rappel.html` (cours du lycée)
- [ ] Ajouter des annales d'examens
- [ ] Implémenter le système de progression (barre de progression)
- [ ] Ajouter des cartes mémoire (flashcards)

## Design & UX
- **Palette** : Violet clair (#F5F3FF) + Rouge sombre (#991B1B)
- **Thèmes** : Light/Dark avec toggle manuel
- **Animations** : Subtiles (fade-in, hover)
- **Sons** : Micro-sons optionnels (clic, swipe, validation)
- **Accessibilité** : Contraste ≥ 4.5:1

## Statistiques
- **6 notions** couvertes
- **3 quiz** (45 questions au total)
- **7 TD** (46 exercices avec corrections)
- **18 textes à trous**
- **100% compatible GitHub Pages**
