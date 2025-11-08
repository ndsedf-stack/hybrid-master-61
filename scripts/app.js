/**
 * HYBRID MASTER 60 - APPLICATION PRINCIPALE
 * Version modulaire avec imports ES6
 * 
 * Architecture:
 * - Importe le programme depuis program-data.js
 * - Utilise TimerManager depuis modules/timer-manager.js
 * - Gère l'UI et la navigation
 */

import ProgramData from './program-data.js';
import TimerManager from './modules/timer-manager.js';

// ============================================================================
// ÉTAT DE L'APPLICATION
// ============================================================================
const AppState = {
    currentWeek: 1,
    currentDay: 'dimanche', // 'dimanche', 'mardi', 'vendredi', 'maison'
    currentWorkout: null,
    completedSets: new Set(),
    timer: null
};

// ============================================================================
// GÉNÉRATEUR DE PROGRAMME
// ============================================================================
class WorkoutGenerator {
    constructor(programData) {
        this.program = programData;
    }

    /**
     * Génère la séance complète pour une semaine et un jour donnés
     */
    generateWorkout(weekNumber, dayName) {
        if (dayName === 'maison') {
            return this.generateHomeWorkout(weekNumber);
        }

        const weekData = this.program.weeks.find(w => w.weekNumber === weekNumber);
        if (!weekData) return null;

        const dayData = weekData.days[dayName];
        if (!dayData) return null;

        const isDeload = weekData.isDeload;
        const techniques = this.getTechniquesForWeek(weekNumber);

        return {
            week: weekNumber,
            day: dayName,
            isDeload: isDeload,
            techniques: techniques,
            exercises: dayData.exercises.map(ex => this.buildExercise(ex, weekNumber, isDeload, techniques))
        };
    }

    /**
     * Génère la séance maison (Hammer Curl)
     */
    generateHomeWorkout(weekNumber) {
        const baseWeight = 6;
        const increment = 0.5;
        const currentWeight = baseWeight + (Math.floor((weekNumber - 1) / 4) * increment);

        return {
            week: weekNumber,
            day: 'maison',
            isDeload: false,
            techniques: [],
            exercises: [{
                id: 'hammer_curl_home',
                name: 'Hammer Curl (Haltères)',
                sets: 3,
                reps: '12',
                weight: `${currentWeight} kg`,
                restTime: 90,
                notes: 'Mardi + Jeudi soir à la maison',
                tempo: '2-0-2',
                isSuperset: false,
                supersetWith: null
            }]
        };
    }

    /**
     * Construit un exercice avec poids et techniques
     */
    buildExercise(exerciseTemplate, weekNumber, isDeload, techniques) {
        const weight = this.calculateWeight(exerciseTemplate, weekNumber, isDeload);
        const notes = this.buildNotes(exerciseTemplate, techniques);

        return {
            id: exerciseTemplate.id,
            name: exerciseTemplate.name,
            sets: exerciseTemplate.sets,
            reps: exerciseTemplate.reps,
            weight: weight,
            restTime: exerciseTemplate.restTime,
            notes: notes,
            tempo: exerciseTemplate.tempo || '2-0-2',
            isSuperset: exerciseTemplate.isSuperset || false,
            supersetWith: exerciseTemplate.supersetWith || null,
            machine: exerciseTemplate.machine || null
        };
    }

    /**
     * Calcule le poids pour un exercice donné
     */
    calculateWeight(exercise, weekNumber, isDeload) {
        const progression = Math.floor((weekNumber - 1) / 4);
        let weight = exercise.startWeight + (progression * exercise.increment);

        if (isDeload) {
            weight = weight * 0.6; // -40% pour deload
        }

        return `${weight.toFixed(1)} kg`;
    }

    /**
     * Construit les notes techniques
     */
    buildNotes(exercise, techniques) {
        const notes = [];

        // Ajouter les techniques du bloc
        if (techniques.length > 0) {
            notes.push(...techniques.map(t => `${t.name}: ${t.description}`));
        }

        // Ajouter les notes spécifiques de l'exercice
        if (exercise.notes) {
            notes.push(exercise.notes);
        }

        return notes.join(' • ');
    }

    /**
     * Détermine les techniques pour une semaine donnée
     */
    getTechniquesForWeek(weekNumber) {
        // Deloads : pas de techniques
        if ([6, 12, 18, 24, 26].includes(weekNumber)) {
            return [];
        }

        // Bloc 1 (S1-5) : Tempo
        if (weekNumber >= 1 && weekNumber <= 5) {
            return [{
                name: 'Tempo 3-1-2',
                description: '3s excentrique, 1s pause, 2s concentrique'
            }];
        }

        // Bloc 2 (S7-11) : Rest-Pause
        if (weekNumber >= 7 && weekNumber <= 11) {
            return [{
                name: 'Rest-Pause',
                description: 'Série complète + 15s repos + mini-série'
            }];
        }

        // Bloc 3 (S13-17) : Drop-sets + Myo-reps
        if (weekNumber >= 13 && weekNumber <= 17) {
            return [
                {
                    name: 'Drop-sets',
                    description: 'Dernière série : -20% × 2 drops'
                },
                {
                    name: 'Myo-reps',
                    description: 'Série initiale + mini-séries de 3-5 reps'
                }
            ];
        }

        // Bloc 4 (S19-23) : Clusters + Myo-reps + Partials
        if (weekNumber >= 19 && weekNumber <= 23) {
            return [
                {
                    name: 'Clusters',
                    description: '3 reps + 15s + 2 reps + 15s + 1 rep'
                },
                {
                    name: 'Myo-reps',
                    description: 'Série initiale + mini-séries'
                },
                {
                    name: 'Partials',
                    description: '1/3 amplitude en fin de série'
                }
            ];
        }

        // Bloc 5 (S25) : Peak Week
        if (weekNumber === 25) {
            return [{
                name: 'Peak Week',
                description: 'Charges maximales - Technique parfaite'
            }];
        }

        return [];
    }
}

// ============================================================================
// GESTION DE L'UI
// ============================================================================
class UIManager {
    constructor() {
        this.workoutGenerator = new WorkoutGenerator(ProgramData);
    }

    /**
     * Initialise l'interface
     */
    init() {
        this.renderWeekSelector();
        this.renderDayButtons();
        this.loadWorkout();
        this.initEventListeners();
    }

    /**
     * Affiche le sélecteur de semaine
     */
    renderWeekSelector() {
        const container = document.getElementById('week-selector');
        container.innerHTML = `
            <button id="prev-week" class="week-nav-btn">◀</button>
            <span class="week-display">Semaine ${AppState.currentWeek}/26</span>
            <button id="next-week" class="week-nav-btn">▶</button>
        `;
    }

    /**
     * Affiche les boutons de sélection du jour
     */
    renderDayButtons() {
        const container = document.getElementById('day-buttons');
        const days = [
            { key: 'dimanche', label: '💪 Dimanche', subtitle: 'DOS + JAMBES LOURDES + BRAS' },
            { key: 'mardi', label: '🔥 Mardi', subtitle: 'PECS + ÉPAULES + TRICEPS' },
            { key: 'vendredi', label: '⚡ Vendredi', subtitle: 'DOS + JAMBES LÉGÈRES + BRAS + ÉPAULES' }
        ];

        let html = '<div class="day-buttons-grid">';
        days.forEach(day => {
            const isActive = AppState.currentDay === day.key;
            html += `
                <button class="day-btn ${isActive ? 'active' : ''}" data-day="${day.key}">
                    <div class="day-btn-label">${day.label}</div>
                    <div class="day-btn-subtitle">${day.subtitle}</div>
                </button>
            `;
        });
        html += '</div>';

        // Bouton Maison séparé
        const isHomeActive = AppState.currentDay === 'maison';
        html += `
            <button class="day-btn home-btn ${isHomeActive ? 'active' : ''}" data-day="maison">
                <div class="day-btn-label">🏠 Maison</div>
                <div class="day-btn-subtitle">HAMMER CURL - Mardi + Jeudi soir</div>
            </button>
        `;

        container.innerHTML = html;
    }

    /**
     * Charge et affiche la séance
     */
    loadWorkout() {
        const workout = this.workoutGenerator.generateWorkout(AppState.currentWeek, AppState.currentDay);
        AppState.currentWorkout = workout;
        this.renderWorkout(workout);
        this.renderWeekSelector();
        this.renderDayButtons();
    }

    /**
     * Affiche la séance
     */
    renderWorkout(workout) {
        const container = document.getElementById('workout-container');

        if (!workout) {
            container.innerHTML = '<p class="error">Séance non disponible</p>';
            return;
        }

        let html = '';

        // En-tête
        if (workout.isDeload) {
            html += '<div class="deload-banner">🔄 SEMAINE DELOAD - Volume réduit de 40%</div>';
        }

        if (workout.techniques.length > 0) {
            html += '<div class="techniques-banner">';
            workout.techniques.forEach(tech => {
                html += `<div class="technique-tag">${tech.name}</div>`;
            });
            html += '</div>';
        }

        // Exercices
        html += '<div class="exercises-list">';
        let currentSuperset = [];

        workout.exercises.forEach((exercise, index) => {
            if (exercise.isSuperset) {
                currentSuperset.push(exercise);
                
                // Si c'est le dernier du superset, on affiche le groupe
                const nextEx = workout.exercises[index + 1];
                if (!nextEx || !nextEx.isSuperset) {
                    html += this.renderSupersetGroup(currentSuperset);
                    currentSuperset = [];
                }
            } else {
                html += this.renderExercise(exercise);
            }
        });

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Affiche un exercice normal
     */
    renderExercise(exercise) {
        return `
            <div class="exercise-card">
                <div class="exercise-header">
                    <h3 class="exercise-name">${exercise.name}</h3>
                    ${exercise.machine ? `<span class="machine-tag">${exercise.machine}</span>` : ''}
                </div>
                <div class="exercise-details">
                    <span class="detail-badge">${exercise.sets} × ${exercise.reps}</span>
                    <span class="detail-badge weight">${exercise.weight}</span>
                    <span class="detail-badge">⏱ ${exercise.restTime}s</span>
                    ${exercise.tempo ? `<span class="detail-badge">Tempo: ${exercise.tempo}</span>` : ''}
                </div>
                ${exercise.notes ? `<div class="exercise-notes">${exercise.notes}</div>` : ''}
                <div class="sets-tracker">
                    ${this.renderSetsButtons(exercise)}
                </div>
            </div>
        `;
    }

    /**
     * Affiche un groupe de superset
     */
    renderSupersetGroup(exercises) {
        let html = '<div class="superset-group">';
        html += '<div class="superset-label">SUPERSET</div>';
        
        exercises.forEach(exercise => {
            html += `
                <div class="exercise-card superset-exercise">
                    <div class="exercise-header">
                        <h3 class="exercise-name">${exercise.name}</h3>
                        ${exercise.machine ? `<span class="machine-tag">${exercise.machine}</span>` : ''}
                    </div>
                    <div class="exercise-details">
                        <span class="detail-badge">${exercise.sets} × ${exercise.reps}</span>
                        <span class="detail-badge weight">${exercise.weight}</span>
                        <span class="detail-badge">⏱ ${exercise.restTime}s</span>
                        ${exercise.tempo ? `<span class="detail-badge">Tempo: ${exercise.tempo}</span>` : ''}
                    </div>
                    ${exercise.notes ? `<div class="exercise-notes">${exercise.notes}</div>` : ''}
                    <div class="sets-tracker">
                        ${this.renderSetsButtons(exercise)}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    /**
     * Affiche les boutons de séries
     */
    renderSetsButtons(exercise) {
        let html = '';
        for (let i = 1; i <= exercise.sets; i++) {
            const setId = `${exercise.id}_set_${i}`;
            const isCompleted = AppState.completedSets.has(setId);
            html += `
                <button class="set-btn ${isCompleted ? 'completed' : ''}" 
                        data-set-id="${setId}"
                        data-rest-time="${exercise.restTime}">
                    Série ${i}
                </button>
            `;
        }
        return html;
    }

    /**
     * Initialise les écouteurs d'événements
     */
    initEventListeners() {
        // Navigation semaines
        document.getElementById('prev-week')?.addEventListener('click', () => {
            if (AppState.currentWeek > 1) {
                AppState.currentWeek--;
                this.loadWorkout();
            }
        });

        document.getElementById('next-week')?.addEventListener('click', () => {
            if (AppState.currentWeek < 26) {
                AppState.currentWeek++;
                this.loadWorkout();
            }
        });

        // Sélection jour
        document.getElementById('day-buttons')?.addEventListener('click', (e) => {
            const btn = e.target.closest('.day-btn');
            if (btn) {
                AppState.currentDay = btn.dataset.day;
                this.loadWorkout();
            }
        });

        // Validation séries
        document.getElementById('workout-container')?.addEventListener('click', (e) => {
            const btn = e.target.closest('.set-btn');
            if (btn && !btn.classList.contains('completed')) {
                const setId = btn.dataset.setId;
                const restTime = parseInt(btn.dataset.restTime);
                
                AppState.completedSets.add(setId);
                btn.classList.add('completed');
                
                // Démarrer le timer
                if (AppState.timer) {
                    AppState.timer.start(restTime);
                }
            }
        });
    }
}

// ============================================================================
// INITIALISATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le timer
    AppState.timer = new TimerManager();
    
    // Initialiser l'UI
    const ui = new UIManager();
    ui.init();

    console.log('✅ Application Hybrid Master 60 chargée');
    console.log('📊 Programme:', ProgramData.metadata);
});
