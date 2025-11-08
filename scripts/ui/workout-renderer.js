/**
 * WORKOUT RENDERER - Affichage des séances avec supersets
 * Génère le HTML pour afficher les exercices avec leurs séries
 * VERSION HEVY - Inputs interactifs avec validation
 */

export default class WorkoutRenderer {
    constructor() {
        this.container = null;
    }

    init() {
        this.container = document.getElementById('workout-container');
        if (!this.container) {
            console.error('❌ Container workout-container introuvable');
        }
    }

    /**
     * Rend un workout complet
     */
    render(workoutDay, week) {
        if (!this.container) {
            console.error('❌ Container non initialisé');
            return;
        }

        if (!workoutDay || !workoutDay.exercises || workoutDay.exercises.length === 0) {
            this.container.innerHTML = `
                <div class="empty-workout">
                    <p>🏖️ Repos aujourd'hui !</p>
                </div>
            `;
            return;
        }

        // Détecter les supersets
        const exercisesWithSupersets = this.detectSupersets(workoutDay.exercises);

        // Générer le HTML pour tous les exercices
        const exercisesHTML = exercisesWithSupersets.map((exercise, index) => 
            this.renderExercise(exercise, index, week)
        ).join('');

        this.container.innerHTML = exercisesHTML;

        // Attacher les event listeners après le rendu
        this.attachSeriesListeners();
    }

    /**
     * Détecter les supersets (exercices avec même numéro de série)
     */
    detectSupersets(exercises) {
        return exercises.map((exercise, index) => {
            // Si l'exercice a une propriété "superset" ou "setGroup"
            if (exercise.superset || exercise.setGroup) {
                return { ...exercise, isSuperset: true };
            }

            // Détection automatique : exercices consécutifs de même catégorie
            const nextExercise = exercises[index + 1];
            if (nextExercise && 
                exercise.category === nextExercise.category && 
                exercise.rest === nextExercise.rest) {
                return { ...exercise, isSuperset: true };
            }

            return exercise;
        });
    }

    /**
     * Rend un exercice avec ses séries
     */
    renderExercise(exercise, index, week) {
        const {
            id,
            name,
            type,
            category,
            muscle,
            muscles,
            sets,
            reps,
            weight,
            rpe,
            rest,
            tempo,
            notes,
            isSuperset,
            progression
        } = exercise;

        // Déterminer l'icône et la classe selon le type
        const icon = type === 'cardio' ? '🔥' : '💪';
        const typeClass = type === 'cardio' ? 'cardio' : 'strength';
        const categoryLabel = category || '';
        // Support pour "muscle" (singulier) ET "muscles" (pluriel)
        const muscleArray = muscles || muscle;
        const musclesLabel = muscleArray ? muscleArray.join(', ') : '';
        const supersetClass = isSuperset ? 'superset' : '';

        // Génération des paramètres principaux
        const paramsHTML = this.renderParams(exercise);

        // Génération des séries (STYLE HEVY)
        const seriesHTML = this.renderSeries(exercise, id);

        // Notes si présentes
        const notesHTML = notes ? `
            <div class="exercise-notes">
                <div class="notes-title">📝 Notes</div>
                <div class="notes-content">${notes}</div>
            </div>
        ` : '';

        // Progression si présente
        const progressionHTML = progression ? this.renderProgression(progression) : '';

        return `
            <div class="exercise-card slide-up ${supersetClass}" data-exercise-id="${id}">
                <div class="exercise-header ${typeClass}">
                    <span class="exercise-icon">${icon}</span>
                    <div class="exercise-title">
                        <h3 class="exercise-name">${name}</h3>
                        <div class="exercise-details">
                            ${categoryLabel ? `<span>${categoryLabel}</span>` : ''}
                            ${musclesLabel ? `<span>🎯 ${musclesLabel}</span>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="exercise-body">
                    ${paramsHTML}
                    ${seriesHTML}
                    ${notesHTML}
                    ${progressionHTML}
                </div>
            </div>
        `;
    }

    /**
     * Rend les paramètres principaux
     */
    renderParams(exercise) {
        const { sets, reps, weight, rpe, rest, tempo } = exercise;

        const params = [];

        if (sets) {
            params.push({
                label: 'SÉRIES',
                value: sets
            });
        }

        if (reps) {
            params.push({
                label: 'REPS',
                value: reps
            });
        }

        if (weight) {
            params.push({
                label: 'POIDS',
                value: `${weight}kg`
            });
        }

        if (rpe) {
            params.push({
                label: 'RPE',
                value: rpe
            });
        }

        if (rest) {
            params.push({
                label: 'REPOS',
                value: `${rest}s`
            });
        }

        if (tempo) {
            params.push({
                label: 'TEMPO',
                value: tempo
            });
        }

        if (params.length === 0) return '';

        const paramsHTML = params.map(param => `
            <div class="param-item">
                <div class="param-label">${param.label}</div>
                <div class="param-value">${param.value}</div>
            </div>
        `).join('');

        return `
            <div class="exercise-params">
                ${paramsHTML}
            </div>
        `;
    }

    /**
     * Rend les séries individuelles STYLE HEVY
     * Avec inputs interactifs et boutons de validation
     */
    renderSeries(exercise, exerciseId) {
        const { sets, reps, weight } = exercise;

        if (!sets || sets === 0) return '';

        const seriesArray = Array.from({ length: sets }, (_, i) => i + 1);

        const seriesHTML = seriesArray.map(setNumber => {
            // TODO: Récupérer l'état depuis le storage
            const isCompleted = false;
            const completedClass = isCompleted ? 'validated' : '';

            return `
                <div class="serie-row ${completedClass}" 
                     data-exercise-id="${exerciseId}" 
                     data-set-number="${setNumber}">
                    
                    <span class="serie-number">${setNumber}</span>
                    
                    <input 
                        type="number" 
                        class="reps-input" 
                        value="${reps || 0}"
                        placeholder="Reps"
                        min="0"
                        data-type="reps"
                    />
                    
                    <input 
                        type="number" 
                        class="weight-input" 
                        value="${weight || 0}"
                        placeholder="kg"
                        min="0"
                        step="0.5"
                        data-type="weight"
                    />
                    
                    <button 
                        class="validate-btn"
                        data-exercise-id="${exerciseId}"
                        data-set-number="${setNumber}"
                        aria-label="Valider la série ${setNumber}"
                    >
                        ✓
                    </button>
                </div>
            `;
        }).join('');

        return `
            <div class="series-container">
                ${seriesHTML}
            </div>
        `;
    }

    /**
     * Attache les event listeners pour les séries
     */
    attachSeriesListeners() {
        // Boutons de validation
        document.querySelectorAll('.validate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const serieRow = e.target.closest('.serie-row');
                const exerciseId = btn.dataset.exerciseId;
                const setNumber = btn.dataset.setNumber;

                // Toggle validated
                serieRow.classList.toggle('validated');

                // TODO: Sauvegarder dans storage
                console.log(`✅ Série ${setNumber} de l'exercice ${exerciseId} validée`);

                // TODO: Démarrer le timer si repos défini
            });
        });

        // Inputs - Sauvegarder à chaque modification
        document.querySelectorAll('.reps-input, .weight-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const serieRow = e.target.closest('.serie-row');
                const exerciseId = serieRow.dataset.exerciseId;
                const setNumber = serieRow.dataset.setNumber;
                const type = e.target.dataset.type;
                const value = e.target.value;

                // TODO: Sauvegarder dans storage
                console.log(`💾 ${type}: ${value} pour série ${setNumber} de ${exerciseId}`);
            });
        });
    }

    /**
     * Rend la carte de progression
     */
    renderProgression(progression) {
        const { from, to } = progression;

        return `
            <div class="progression-card">
                <div class="progression-label">
                    <span>☑️</span>
                    <span>Progression</span>
                </div>
                <div class="progression-values">
                    <span class="progression-from">${from}kg</span>
                    <span class="progression-arrow">→</span>
                    <span class="progression-to">${to}kg</span>
                </div>
            </div>
        `;
    }
}
