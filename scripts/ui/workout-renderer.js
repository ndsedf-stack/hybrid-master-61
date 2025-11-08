/**
 * WORKOUT RENDERER - VERSION PREMIUM CORRIGÉE COMPLÈTE
 * Affichage texte des reps/poids, validation visuelle
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

        const exercisesWithSupersets = this.detectSupersets(workoutDay.exercises);
        const exercisesHTML = exercisesWithSupersets.map((exercise, index) => 
            this.renderExercise(exercise, index, week)
        ).join('');

        this.container.innerHTML = exercisesHTML;
        this.attachSeriesListeners();
    }

    detectSupersets(exercises) {
        return exercises.map((exercise, index) => {
            if (exercise.superset || exercise.setGroup) {
                return { ...exercise, isSuperset: true };
            }

            const nextExercise = exercises[index + 1];
            if (nextExercise && 
                exercise.category === nextExercise.category && 
                exercise.rest === nextExercise.rest) {
                return { ...exercise, isSuperset: true };
            }

            return exercise;
        });
    }

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

        const icon = type === 'cardio' ? '🔥' : '💪';
        const typeClass = type === 'cardio' ? 'cardio' : 'strength';
        const categoryLabel = category || '';
        const muscleArray = muscles || muscle;
        const musclesLabel = muscleArray ? muscleArray.join(', ') : '';
        const supersetClass = isSuperset ? 'superset' : '';

        const paramsHTML = this.renderParams(exercise);
        const seriesHTML = this.renderSeries(exercise, id);
        const notesHTML = notes ? `
            <div class="exercise-notes">
                <div class="notes-title">📝 Notes</div>
                <div class="notes-content">${notes}</div>
            </div>
        ` : '';
        const progressionHTML = progression ? this.renderProgression(progression) : '';

        return `
            <div class="exercise-card slide-up ${supersetClass}" data-exercise-id="${id}">
                <div class="exercise-header ${typeClass}">
                    <div class="exercise-title-section">
                        <span class="exercise-icon">${icon}</span>
                        <div class="exercise-title">
                            <h3 class="exercise-name">${name}</h3>
                            <div class="exercise-details">
                                ${categoryLabel ? `<span>💪 ${categoryLabel}</span>` : ''}
                                ${musclesLabel ? `<span>🎯 ${musclesLabel}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                ${paramsHTML}
                
                <div class="exercise-body">
                    ${seriesHTML}
                    ${notesHTML}
                    ${progressionHTML}
                </div>
            </div>
        `;
    }

    renderParams(exercise) {
        const { sets, reps, weight, rpe, rest, tempo } = exercise;
        const params = [];

        if (sets) params.push({ label: 'SÉRIES', value: sets });
        if (reps) params.push({ label: 'REPS', value: reps });
        if (weight) params.push({ label: 'POIDS', value: `${weight}kg` });
        if (rpe) params.push({ label: 'RPE', value: rpe });
        if (rest) params.push({ label: 'REPOS', value: `${rest}s` });
        if (tempo) params.push({ label: 'TEMPO', value: tempo });

        if (params.length === 0) return '';

        const paramsHTML = params.map(param => `
            <div class="param-item">
                <div class="param-label">${param.label}</div>
                <div class="param-value">${param.value}</div>
            </div>
        `).join('');

        return `<div class="exercise-params">${paramsHTML}</div>`;
    }

    renderSeries(exercise, exerciseId) {
        const { sets, reps, weight, rest } = exercise;

        if (!sets || sets === 0) return '';

        const seriesArray = Array.from({ length: sets }, (_, i) => i + 1);

        const formatReps = (repsValue) => {
            if (!repsValue) return '0';
            if (typeof repsValue === 'number') return `${repsValue}`;
            return repsValue;
        };

        const formattedReps = formatReps(reps);
        const formattedWeight = weight ? `${weight}kg` : '';

        const seriesHTML = seriesArray.map(setNumber => {
            const isCompleted = false;
            const completedClass = isCompleted ? 'validated' : '';

            return `
                <div class="serie-row ${completedClass}" 
                     data-exercise-id="${exerciseId}" 
                     data-set-number="${setNumber}">
                    
                    <span class="serie-number">${setNumber}</span>
                    
                    <div class="serie-info">
                        <div class="serie-reps">${formattedReps} reps</div>
                        ${formattedWeight ? `<div class="serie-weight">${formattedWeight}</div>` : ''}
                    </div>
                    
                    ${rest ? `
                        <div class="serie-rest">
                            <span class="rest-icon">⏱️</span>
                            <span class="rest-time">${rest}s repos</span>
                        </div>
                    ` : ''}
                    
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

        return `<div class="series-container">${seriesHTML}</div>`;
    }

    attachSeriesListeners() {
        document.querySelectorAll('.validate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const serieRow = e.target.closest('.serie-row');
                const exerciseId = btn.dataset.exerciseId;
                const setNumber = btn.dataset.setNumber;

                serieRow.classList.toggle('validated');

                const isValidated = serieRow.classList.contains('validated');
                console.log(`${isValidated ? '✅' : '⬜'} Série ${setNumber} de ${exerciseId}`);

                if (isValidated) {
                    const restElement = serieRow.querySelector('.rest-time');
                    if (restElement) {
                        const restSeconds = parseInt(restElement.textContent);
                        console.log(`⏱️ Démarrer timer: ${restSeconds}s`);
                    }
                }
            });
        });
    }

    renderProgression(progression) {
        const { from, to } = progression;

        return `
            <div class="progression-card">
                <div class="progression-label">
                    <span>📈</span>
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
