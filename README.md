# 📚 HYBRID MASTER 61 - GUIDE COMPLET D'ARCHITECTURE

> **Document pour comprendre TOUTE l'application, où modifier quoi, et comment tout est lié**

---

## 🏗️ ARCHITECTURE MODULAIRE - VUE D'ENSEMBLE

```
hybrid-master-61/
├── index.html                          # Point d'entrée HTML
├── styles/                             # CSS modulaire (ordre = important!)
│   ├── 01-reset.css                   # Reset CSS navigateur
│   ├── 02-variables.css               # Variables CSS (couleurs, tailles)
│   ├── 03-base.css                    # Styles de base (body, html)
│   ├── 04-layout.css                  # Layout général (header, containers)
│   ├── 05-components.css              # ⭐ Cartes exercices, en-têtes
│   ├── 06-series.css                  # ⭐ Lignes de séries + validation
│   ├── 07-timer.css                   # ⭐ Widget timer (NOUVEAU/AMÉLIORÉ)
│   ├── 08-responsive.css              # Media queries mobile
│   └── 09-statistics.css              # Stats (futur)
├── scripts/
│   ├── app.js                         # ⭐ POINT D'ENTRÉE PRINCIPAL
│   ├── program-data.js                # 📊 DONNÉES PROGRAMME MUSCU
│   ├── modules/
│   │   ├── timer-manager.js           # ⭐ TIMER (AMÉLIORÉ)
│   │   ├── statistics-engine.js       # Stats (futur)
│   │   └── workout-session.js         # Session tracking (futur)
│   ├── ui/
│   │   ├── workout-renderer.js        # ⭐ RENDU exercices/séries
│   │   ├── navigation-ui.js           # Navigation (futur)
│   │   └── modal-manager.js           # Modals (futur)
│   └── storage/
│       ├── local-storage.js           # Sauvegarde locale (futur)
│       └── export-import.js           # Export/Import (futur)
```

---

## 📋 FICHIERS CLÉS - CE QU'ILS FONT

### 1️⃣ **program-data.js** - LES DONNÉES DU PROGRAMME
**📍 Localisation:** `scripts/program-data.js`  
**🔤 Langage:** JavaScript ES6 (module export)  
**🎯 Rôle:** Contient **TOUTES** les données de musculation (26 semaines, 4 jours/semaine)

#### Structure globale:
```javascript
const programData = {
    info: {
        name: "Hybrid Master 60",
        weeks: 26,
        author: "Vous",
        startDate: "2025-01-01"
    },
    weeks: [
        {
            weekNumber: 1,
            block: 1,
            technique: "Tempo 3-1-2",
            isDeload: false,
            workouts: {
                dimanche: { name: "Full Body A", exercises: [...] },
                mardi: { name: "Full Body B", exercises: [...] },
                vendredi: { name: "Full Body C", exercises: [...] },
                maison: { name: "Maison", exercises: [...] }
            }
        },
        // ... 25 autres semaines
    ],
    
    // Méthodes utiles
    getWeek(weekNumber) { ... },
    getWorkout(weekNumber, day) { ... }
};
```

#### Structure d'un exercice (IMPORTANT):
```javascript
{
    id: "trap-bar-deadlift",           // ⚠️ ID unique (pour tracking)
    name: "Trap Bar Deadlift",         // Nom affiché
    type: "strength",                  // "strength" | "cardio"
    category: "compound",              // "compound" | "isolation"
    muscles: ["dos", "jambes"],        // Tableau de muscles ciblés
    
    // PARAMÈTRES D'ENTRAÎNEMENT
    sets: 5,                           // Nombre de séries
    reps: "6-8",                       // Reps (peut être "6-8" ou 10)
    weight: 75,                        // Poids en kg
    rpe: "6-7",                        // RPE (Rate of Perceived Exertion)
    rest: 120,                         // ⭐ REPOS EN SECONDES (pour timer!)
    tempo: "3-1-2",                    // Tempo d'exécution
    
    // OPTIONNEL
    notes: "Garder le dos droit",     // Notes techniques
    progression: {                     // Progression sur le bloc
        from: 70,
        to: 80
    },
    superset: true                     // Si en superset
}
```

#### ⚠️ POUR MODIFIER LE PROGRAMME:

**Changer un exercice existant:**
```javascript
// Trouver la semaine et le jour
programData.weeks[0].workouts.dimanche.exercises[0]

// Exemple: Changer le poids du Trap Bar Deadlift
programData.weeks[0].workouts.dimanche.exercises[0].weight = 80;

// Changer le temps de repos (impact sur timer!)
programData.weeks[0].workouts.dimanche.exercises[0].rest = 180; // 3 minutes
```

**Ajouter un nouvel exercice:**
```javascript
programData.weeks[0].workouts.dimanche.exercises.push({
    id: "mon-nouvel-exercice",
    name: "Mon Nouvel Exercice",
    type: "strength",
    category: "isolation",
    muscles: ["biceps"],
    sets: 3,
    reps: 12,
    weight: 20,
    rest: 60,
    tempo: "2-0-2"
});
```

**Supprimer un exercice:**
```javascript
// Supprimer le 2ème exercice du dimanche semaine 1
programData.weeks[0].workouts.dimanche.exercises.splice(1, 1);
```

---

### 2️⃣ **app.js** - CHEF D'ORCHESTRE DE L'APPLICATION
**📍 Localisation:** `scripts/app.js`  
**🔤 Langage:** JavaScript ES6 (avec imports ES6)  
**🎯 Rôle:** Initialise tout, gère la navigation, coordonne les modules

#### Imports et état global:
```javascript
import programData from './program-data.js';
import TimerManager from './modules/timer-manager.js';
import WorkoutRenderer from './ui/workout-renderer.js';

// ⭐ ÉTAT GLOBAL DE L'APPLICATION
const AppState = {
    currentWeek: 1,                    // Semaine actuelle (1-26)
    currentDay: 'dimanche',            // Jour actuel
    currentWorkout: null,              // Workout chargé
    completedSets: new Set(),          // Séries validées (Set pour unicité)
    timerManager: null,                // Instance du TimerManager
    workoutRenderer: null              // Instance du WorkoutRenderer
};
```

#### Flux d'initialisation:
```javascript
1. DOMContentLoaded déclenche initializeApp()
2. initializeApp() crée:
   - TimerManager (gère le timer)
   - WorkoutRenderer (affiche les exercices)
3. Crée les UI (sélecteur semaine, boutons jours)
4. Charge le premier workout (Semaine 1, Dimanche)
```

#### ⚠️ POUR MODIFIER:
- **Changer la semaine de départ:** `AppState.currentWeek = 5;`
- **Changer le jour de départ:** `AppState.currentDay = 'mardi';`
- **Accéder au timer:** `AppState.timerManager.start(120);`

---

### 3️⃣ **workout-renderer.js** - AFFICHAGE DES EXERCICES
**📍 Localisation:** `scripts/ui/workout-renderer.js`  
**🔤 Langage:** JavaScript ES6 (classe export)  
**🎯 Rôle:** Transforme les données en HTML et gère les interactions

#### Méthodes principales:
```javascript
class WorkoutRenderer {
    render(workoutDay, week)           // Rend tout le workout
    renderExercise(exercise, index)    // Rend 1 exercice
    renderParams(exercise)             // Rend les paramètres (SÉRIES, REPS, etc.)
    renderSeries(exercise, id)         // ⭐ Rend les lignes de séries
    attachSeriesListeners()            // ⭐ Gère les clics de validation
}
```

#### Génération HTML des séries:
```javascript
renderSeries(exercise, exerciseId) {
    // Pour chaque série (1 à sets)
    // Génère une ligne avec:
    // - Numéro de série
    // - Reps et poids
    // - Temps de repos
    // - Bouton de validation ✓
}
```

#### Validation d'une série (IMPORTANT):
```javascript
attachSeriesListeners() {
    // Quand on clique sur le bouton ✓
    // 1. Toggle classe "validated" sur la ligne
    // 2. Log dans console
    // 3. ⭐ DÉCLENCHE LE TIMER avec le temps de repos
    //    (actuellement en console.log, sera connecté au TimerManager)
}
```

#### ⚠️ POUR MODIFIER:
- **Changer l'affichage:** Modifier le HTML dans `renderSeries()`
- **Changer le comportement de validation:** Modifier `attachSeriesListeners()`
- **Ajouter des infos:** Modifier `renderParams()` ou `renderExercise()`

---

### 4️⃣ **timer-manager.js** - GESTION DU TIMER (⭐ À AMÉLIORER)
**📍 Localisation:** `scripts/modules/timer-manager.js`  
**🔤 Langage:** JavaScript ES6 (classe export)  
**🎯 Rôle:** Gère le compte à rebours de repos entre séries

#### Structure actuelle (BASIQUE):
```javascript
class TimerManager {
    constructor() {
        this.isRunning = false;
        this.timeRemaining = 0;
        this.timerId = null;
        this.widget = null;  // Référence au widget DOM
    }
    
    start(seconds) { ... }     // Démarre le timer
    pause() { ... }            // Met en pause
    resume() { ... }           // Reprend
    stop() { ... }             // Arrête et cache
    updateDisplay() { ... }    // Met à jour l'affichage
}
```

#### ⭐ AMÉLIORATIONS À FAIRE:
```javascript
// NOUVELLES FONCTIONNALITÉS NÉCESSAIRES:
1. addTime(seconds)            // +15s / -15s
2. skip()                      // Passer le timer
3. reset()                     // Recommencer le timer
4. showNotification()          // Notification fin de repos
5. Affichage circulaire progress bar
6. Affichage nom exercice + numéro série
7. Son/vibration à la fin
```

---

### 5️⃣ **05-components.css** - STYLES DES CARTES EXERCICES
**📍 Localisation:** `styles/05-components.css`  
**🔤 Langage:** CSS3  
**🎯 Rôle:** Styles des cartes exercices, headers, paramètres

#### Classes principales:
```css
.exercise-card              /* Carte d'exercice complète */
.exercise-header            /* En-tête avec nom + icône */
.exercise-title-section     /* Section titre */
.exercise-name              /* Nom de l'exercice */
.exercise-params            /* Grid des paramètres (SÉRIES, REPS, etc.) */
.param-item                 /* 1 paramètre individuel */
.exercise-body              /* Corps avec les séries */
```

#### ⚠️ POUR MODIFIER:
- **Couleurs:** Changer les valeurs hexa (#FF9800, etc.)
- **Espacements:** Modifier padding/margin
- **Tailles police:** Modifier font-size
- **Layout params:** Modifier la grid `grid-template-columns`

---

### 6️⃣ **06-series.css** - STYLES DES LIGNES DE SÉRIES
**📍 Localisation:** `styles/06-series.css`  
**🔤 Langage:** CSS3  
**🎯 Rôle:** Styles des lignes de séries avec validation verte

#### Classes principales:
```css
.series-container           /* Container toutes les séries */
.serie-row                  /* 1 ligne de série */
.serie-row.validated        /* ⭐ Ligne validée (bordure verte) */
.serie-number               /* Cercle avec numéro */
.serie-info                 /* Infos reps/poids */
.serie-rest                 /* Badge temps de repos */
.validate-btn               /* Bouton de validation ✓ */
```

#### Effet de validation:
```css
.serie-row.validated {
    border-color: #4caf50;                /* Bordure verte */
    background: linear-gradient(...);      /* Fond vert transparent */
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);  /* Glow vert */
}
```

#### ⚠️ POUR MODIFIER:
- **Couleur validation:** Changer #4caf50 (vert)
- **Animation:** Modifier @keyframes
- **Layout mobile:** Modifier @media queries

---

### 7️⃣ **07-timer.css** - STYLES DU TIMER (⭐ À AMÉLIORER)
**📍 Localisation:** `styles/07-timer.css`  
**🔤 Langage:** CSS3  
**🎯 Rôle:** Styles du widget timer

#### Classes actuelles:
```css
.timer-widget               /* Widget principal (caché par défaut) */
.timer-widget.hidden        /* État caché */
.timer-content              /* Contenu interne */
.timer-display              /* Affichage du temps */
.timer-controls             /* Boutons contrôle */
```

#### ⭐ À AJOUTER:
```css
.timer-progress-ring        /* Cercle de progression */
.timer-exercise-info        /* Info exercice + série */
.timer-quick-actions        /* Boutons +15s / -15s */
```

---

## 🔗 COMMENT TOUT EST LIÉ - FLUX DE DONNÉES

### Flux de chargement d'un workout:

```
1. USER clique sur "Semaine 2" ou "Mardi"
   ↓
2. app.js: changeWeek() ou selectDay()
   ↓
3. app.js: loadWorkout(week, day)
   ↓
4. program-data.js: getWorkout(week, day)
   ↓
5. workout-renderer.js: render(workout, week)
   ↓
6. Génération HTML avec renderExercise() pour chaque exercice
   ↓
7. Génération des séries avec renderSeries()
   ↓
8. Ajout des event listeners avec attachSeriesListeners()
   ↓
9. Affichage dans #workout-container
```

### Flux de validation d'une série:

```
1. USER clique sur bouton ✓ d'une série
   ↓
2. workout-renderer.js: attachSeriesListeners() détecte le clic
   ↓
3. Toggle classe "validated" sur .serie-row
   ↓
4. CSS 06-series.css applique les styles verts
   ↓
5. Récupération du temps de repos (data-rest ou .rest-time)
   ↓
6. ⭐ timer-manager.js: start(restSeconds)
   ↓
7. Widget timer s'affiche avec compte à rebours
   ↓
8. À la fin: notification + vibration (à implémenter)
```

---

## 🎯 AMÉLIORATIONS EN COURS

### ✅ FAIT:
- Architecture modulaire ES6
- Affichage des exercices et séries
- Validation visuelle des séries (bordure verte)
- Timer basique (existant mais incomplet)
- CSS responsive mobile

### 🚧 EN COURS (TIMER AMÉLIORÉ):
1. **timer-manager.js** - Nouvelles méthodes:
   - `addTime(seconds)` pour +15s / -15s
   - `skip()` pour passer le timer
   - `reset()` pour recommencer
   - `showNotification()` pour alerter fin
   
2. **07-timer.css** - Nouveau design:
   - Cercle de progression animé
   - Affichage exercice + série
   - Boutons stylés
   
3. **Intégration** dans workout-renderer.js:
   - Connexion timer au clic de validation
   - Passage automatique de l'ID exercice + numéro série

### 📅 À FAIRE (FUTUR):
- Sauvegarde progression (local-storage.js)
- Statistiques et graphiques (statistics-engine.js)
- Export PDF/JSON du programme
- Mode offline avec PWA
- Historique complet des séances

---

## 🛠️ GUIDE DE MODIFICATION RAPIDE

### Changer un exercice du programme:
```javascript
// Fichier: scripts/program-data.js
programData.weeks[0].workouts.dimanche.exercises[0].weight = 80;
```

### Changer le temps de repos par défaut:
```javascript
// Fichier: scripts/program-data.js
// Pour TOUS les exercices d'un workout:
programData.weeks[0].workouts.dimanche.exercises.forEach(ex => {
    ex.rest = 90; // 1min30
});
```

### Changer la couleur de validation:
```css
/* Fichier: styles/06-series.css */
.serie-row.validated {
    border-color: #2196F3; /* Bleu au lieu de vert */
}
```

### Activer le timer au clic:
```javascript
// Fichier: scripts/ui/workout-renderer.js
// Dans attachSeriesListeners(), ligne ~250:

if (isValidated) {
    const restSeconds = parseInt(serieRow.querySelector('.rest-time').textContent);
    
    // ⭐ DÉCOMMENTER CETTE LIGNE QUAND TIMER EST PRÊT:
    // AppState.timerManager.start(restSeconds, exerciseId, setNumber);
}
```

---

## 📞 POINTS D'ATTENTION POUR IA FUTURE

### ⚠️ NE PAS CASSER:
1. **Ordre des CSS** dans index.html (01, 02, 03... important!)
2. **Imports ES6** en haut des fichiers JS
3. **IDs uniques** des exercices dans program-data.js
4. **Classes CSS** utilisées dans workout-renderer.js (ne pas renommer)
5. **AppState** global dans app.js (partagé entre modules)

### ✅ PEUT ÊTRE MODIFIÉ LIBREMENT:
- Couleurs dans 02-variables.css
- Textes dans program-data.js
- Animations dans les CSS
- Méthodes internes des classes (tant que l'API publique reste)

### 🔄 DÉPENDANCES ENTRE FICHIERS:
```
program-data.js
    ↓ importé par
app.js ← index.html (script src)
    ↓ importe
timer-manager.js
workout-renderer.js
    ↓ utilisent
05-components.css
06-series.css
07-timer.css
```

---

## 📝 CHANGELOG

### v1.0 (actuel)
- Architecture modulaire mise en place
- Affichage exercices/séries fonctionnel
- Validation visuelle OK
- Timer basique présent

### v1.1 (en cours - TIMER AMÉLIORÉ)
- Timer avec contrôles complets
- Design circulaire moderne
- Déclenchement automatique
- Notification fin de repos

### v2.0 (futur)
- Sauvegarde progression
- Statistiques graphiques
- Export/Import données

---

**Fin du guide - Dernière mise à jour: 08/11/2025**
