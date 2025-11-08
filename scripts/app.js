/**
 * HYBRID MASTER 60 - APPLICATION PRINCIPALE
 * Version modulaire avec imports ES6
 * 
 * Architecture:
 * - Importe le programme depuis program-data.js
 * - Utilise TimerManager depuis modules/timer-manager.js
 * - Utilise WorkoutRenderer depuis ui/workout-renderer.js
 * - Gère l'UI et la navigation
 */

import programData from './program-data.js';
import TimerManager from './modules/timer-manager.js';
import WorkoutRenderer from './ui/workout-renderer.js';

// ============================================================
// ÉTAT DE L'APPLICATION
// ============================================================

const AppState = {
    currentWeek: 1,
    currentDay: 'dimanche', // 'dimanche', 'mardi', 'vendredi', 'maison'
    currentWorkout: null,
    completedSets: new Set(),
    timerManager: null,
    workoutRenderer: null
};

// ============================================================
// INITIALISATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Application Hybrid Master 60 chargée');
    console.log('📊 Programme:', programData.info);
    
    initializeApp();
});

function initializeApp() {
    // Initialiser le timer manager
    AppState.timerManager = new TimerManager();
    
    // Initialiser le workout renderer
    AppState.workoutRenderer = new WorkoutRenderer();
    AppState.workoutRenderer.init();
    
    // Créer les sélecteurs de semaine et jour
    createWeekSelector();
    createDayButtons();
    
    // Charger le premier workout (Semaine 1, Dimanche)
    loadWorkout(1, 'dimanche');
}

// ============================================================
// GÉNÉRATEUR UI - SÉLECTEUR SEMAINE
// ============================================================

function createWeekSelector() {
    const container = document.getElementById('week-selector');
    
    container.innerHTML = `
        <button id="prev-week" class="week-nav">◀</button>
        <div id="week-display">
            <div class="week-number">Semaine 1</div>
            <div class="week-info">Bloc 1 - Tempo 3-1-2</div>
        </div>
        <button id="next-week" class="week-nav">▶</button>
    `;
    
    // Event listeners
    document.getElementById('prev-week').addEventListener('click', () => changeWeek(-1));
    document.getElementById('next-week').addEventListener('click', () => changeWeek(1));
}

function changeWeek(delta) {
    const newWeek = AppState.currentWeek + delta;
    
    if (newWeek < 1 || newWeek > 26) return;
    
    AppState.currentWeek = newWeek;
    updateWeekDisplay();
    loadWorkout(AppState.currentWeek, AppState.currentDay);
}

function updateWeekDisplay() {
    const weekData = programData.getWeek(AppState.currentWeek);
    const display = document.getElementById('week-display');
    
    const deloadBadge = weekData.isDeload ? '<span class="deload-badge">DELOAD</span>' : '';
    
    display.innerHTML = `
        <div class="week-number">Semaine ${AppState.currentWeek} ${deloadBadge}</div>
        <div class="week-info">Bloc ${weekData.block} - ${weekData.technique}</div>
    `;
}

// ============================================================
// GÉNÉRATEUR UI - BOUTONS JOURS
// ============================================================

function createDayButtons() {
    const container = document.getElementById('day-buttons');
    
    const days = [
        { key: 'dimanche', label: '💪 Dimanche', color: '#ff6b6b' },
        { key: 'mardi', label: '🔥 Mardi', color: '#4ecdc4' },
        { key: 'vendredi', label: '⚡ Vendredi', color: '#95e1d3' },
        { key: 'maison', label: '🏠 Maison', color: '#f38181' }
    ];
    
    container.innerHTML = days.map(day => `
        <button 
            class="day-button ${day.key === 'dimanche' ? 'active' : ''}" 
            data-day="${day.key}"
            style="--day-color: ${day.color}"
        >
            ${day.label}
        </button>
    `).join('');
    
    // Event listeners
    container.querySelectorAll('.day-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const day = e.currentTarget.dataset.day;
            selectDay(day);
        });
    });
}

function selectDay(day) {
    AppState.currentDay = day;
    
    // Mettre à jour les boutons actifs
    document.querySelectorAll('.day-button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.day === day);
    });
    
    // Charger le workout
    loadWorkout(AppState.currentWeek, day);
}

// ============================================================
// CHARGEMENT & AFFICHAGE WORKOUT
// ============================================================

function loadWorkout(weekNumber, day) {
    const workout = programData.getWorkout(weekNumber, day);
    AppState.currentWorkout = workout;
    
    // Utiliser le WorkoutRenderer pour afficher
    if (AppState.workoutRenderer) {
        AppState.workoutRenderer.render(workout, weekNumber);
    } else {
        // Fallback si le renderer n'est pas initialisé
        renderWorkoutFallback(workout);
    }
}

// Fallback si WorkoutRenderer pas disponible
function renderWorkoutFallback(workout) {
    const container = document.getElementById('workout-container');
    
    const header = `
        <div class="workout-header">
            <h2>${workout.name}</h2>
            <div class="workout-stats">
                <span>⏱️ ${workout.duration} min</span>
                <span>📊 ${workout.totalSets} séries</span>
            </div>
        </div>
    `;
    
    const exercises = workout.exercises.map((ex, index) => {
        const isSuperset = ex.isSuperset;
        
        const exerciseHtml = `
            <div class="exercise-card ${isSuperset ? 'superset' : ''}">
                <div class="exercise-header">
                    <div class="exercise-title">
                        <h3>${ex.name}</h3>
                        <span class="exercise-category">${ex.category === 'compound' ? '💪 Composé' : '🎯 Isolation'}</span>
                    </div>
                    <div class="exercise-weight">${ex.weight} kg</div>
                </div>
                
                <div class="exercise-details">
                    <div class="detail-row">
                        <span>📋 ${ex.sets} × ${ex.reps} reps</span>
                        <span>⏱️ ${ex.rest}s repos</span>
                        <span>🎵 Tempo ${ex.tempo}</span>
                    </div>
                </div>
            </div>
        `;
        
        return exerciseHtml;
    }).join('');
    
    container.innerHTML = header + exercises;
}

// ============================================================
// LOGS & DEBUG
// ============================================================

console.log('📱 App.js chargé avec succès');
console.log('🎯 Version modulaire ES6 avec WorkoutRenderer');
console.log('📦 Modules importés: ProgramData, TimerManager, WorkoutRenderer');
