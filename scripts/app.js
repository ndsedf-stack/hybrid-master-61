/**
 * HYBRID MASTER 60 - APPLICATION PRINCIPALE AVEC TIMER
 * Version corrigée avec TimerManager intégré
 */

import { TimerManager } from './modules/timer-manager.js';
import WorkoutRenderer from './ui/workout-renderer.js';
import { showModal } from './ui/modal-manager.js';

// ============================================================================
// ÉTAT DE L'APPLICATION
// ============================================================================
class App {
    constructor() {
        this.currentWeek = 1;
        this.maxWeeks = 26;
        this.currentDay = 0;
        this.completedSets = new Map();
        
        // Timer Manager
        this.timerManager = null;
        this.defaultRestTime = 90; // Temps de repos par défaut en secondes
        
        // Workout Renderer
        this.workoutRenderer = new WorkoutRenderer();
    }

    /**
     * Initialisation
     */
    async init() {
        console.log('🚀 Démarrage de l\'application...');

        try {
            // Initialiser le Timer Manager
            this.timerManager = new TimerManager();
            this.timerManager.init();
            console.log('✅ TimerManager initialisé');

            // Initialiser le Workout Renderer
            this.workoutRenderer.init();
            console.log('✅ WorkoutRenderer initialisé');

            // Attacher les événements
            this.attachEventListeners();
            console.log('✅ Événements attachés');

            // Afficher la séance
            this.renderCurrentWorkout();
            console.log('✅ Application prête !');

        } catch (error) {
            console.error('❌ Erreur:', error);
            this.showError('Erreur de chargement');
        }
    }

    /**
     * Attacher TOUS les event listeners
     */
    attachEventListeners() {
        // Navigation semaine
        const prevBtn = document.getElementById('prev-week');
        const nextBtn = document.getElementById('next-week');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.changeWeek(-1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.changeWeek(1);
            });
        }

        // Bouton paramètres - Ouvre la modal de configuration du timer
        const settingsBtn = document.querySelector('.btn-icon.btn-secondary');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openTimerSettings();
            });
        }

        // Navigation du bas
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavClick(index);
            });
        });

        // Checkboxes - DÉLÉGATION D'ÉVÉNEMENTS
        document.addEventListener('click', (e) => {
            const checkButton = e.target.closest('.serie-check');
            if (!checkButton) return;

            e.preventDefault();
            e.stopPropagation();

            this.handleSetCompletion(checkButton);
        });

        console.log('✅ Event listeners attachés');
    }

    /**
     * Ouvrir les paramètres du timer
     */
    openTimerSettings() {
        const modal = document.createElement('div');
        modal.className = 'timer-settings-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>⚙️ Paramètres du Timer</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="settings-group">
                        <label for="rest-time">Temps de repos par défaut</label>
                        <div class="time-picker">
                            <button class="time-btn" data-action="decrease">−</button>
                            <div class="time-display">
                                <input type="number" 
                                       id="rest-time" 
                                       value="${this.defaultRestTime}" 
                                       min="15" 
                                       max="300" 
                                       step="15">
                                <span>secondes</span>
                            </div>
                            <button class="time-btn" data-action="increase">+</button>
                        </div>
                        <div class="time-presets">
                            <button class="preset-btn" data-time="30">30s</button>
                            <button class="preset-btn" data-time="45">45s</button>
                            <button class="preset-btn" data-time="60">60s</button>
                            <button class="preset-btn" data-time="90">90s</button>
                            <button class="preset-btn" data-time="120">2min</button>
                            <button class="preset-btn" data-time="180">3min</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-cancel">Annuler</button>
                    <button class="btn-primary modal-save">Enregistrer</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Style de la modal
        const style = document.createElement('style');
        style.textContent = `
            .timer-settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
            }
            .modal-content {
                position: relative;
                background: var(--color-surface, #1a1f2e);
                border-radius: 16px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: modalSlideIn 0.3s ease-out;
            }
            @keyframes modalSlideIn {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .modal-header {
                padding: 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h2 {
                margin: 0;
                font-size: 1.5rem;
                color: var(--color-text-primary, #ffffff);
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 2rem;
                color: var(--color-text-secondary, #9ca3af);
                cursor: pointer;
                line-height: 1;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                transition: all 0.2s;
            }
            .modal-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
            }
            .modal-body {
                padding: 24px;
            }
            .settings-group {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .settings-group label {
                font-size: 0.9rem;
                color: var(--color-text-secondary, #9ca3af);
                font-weight: 500;
            }
            .time-picker {
                display: flex;
                align-items: center;
                gap: 16px;
                justify-content: center;
            }
            .time-btn {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                background: var(--color-primary, #ff6b35);
                border: none;
                color: white;
                font-size: 1.5rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;
            }
            .time-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
            }
            .time-btn:active {
                transform: scale(0.95);
            }
            .time-display {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(255, 255, 255, 0.05);
                padding: 12px 20px;
                border-radius: 12px;
            }
            .time-display input {
                width: 80px;
                font-size: 1.8rem;
                font-weight: bold;
                background: none;
                border: none;
                color: var(--color-text-primary, #ffffff);
                text-align: center;
            }
            .time-display span {
                color: var(--color-text-secondary, #9ca3af);
                font-size: 0.9rem;
            }
            .time-presets {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
            }
            .preset-btn {
                padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                color: var(--color-text-primary, #ffffff);
                cursor: pointer;
                transition: all 0.2s;
                font-weight: 500;
            }
            .preset-btn:hover {
                background: rgba(255, 107, 53, 0.2);
                border-color: var(--color-primary, #ff6b35);
            }
            .modal-footer {
                padding: 24px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }
            .modal-footer button {
                padding: 12px 24px;
                border-radius: 8px;
                border: none;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
            }
            .btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: var(--color-text-primary, #ffffff);
            }
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.15);
            }
            .btn-primary {
                background: var(--color-primary, #ff6b35);
                color: white;
            }
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
            }
        `;
        document.head.appendChild(style);

        // Event listeners de la modal
        const restTimeInput = modal.querySelector('#rest-time');
        const decreaseBtn = modal.querySelector('[data-action="decrease"]');
        const increaseBtn = modal.querySelector('[data-action="increase"]');
        const presetBtns = modal.querySelectorAll('.preset-btn');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const saveBtn = modal.querySelector('.modal-save');
        const overlay = modal.querySelector('.modal-overlay');

        // Ajuster le temps
        decreaseBtn.addEventListener('click', () => {
            const current = parseInt(restTimeInput.value);
            restTimeInput.value = Math.max(15, current - 15);
        });

        increaseBtn.addEventListener('click', () => {
            const current = parseInt(restTimeInput.value);
            restTimeInput.value = Math.min(300, current + 15);
        });

        // Presets
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                restTimeInput.value = btn.dataset.time;
            });
        });

        // Fermer la modal
        const closeModal = () => {
            modal.remove();
            style.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        // Sauvegarder
        saveBtn.addEventListener('click', () => {
            this.defaultRestTime = parseInt(restTimeInput.value);
            showModal(`✅ Temps de repos défini à ${this.defaultRestTime}s`, 'success');
            closeModal();
            console.log(`⚙️ Temps de repos: ${this.defaultRestTime}s`);
        });
    }

    /**
     * Gérer le clic sur checkbox
     */
    handleSetCompletion(checkButton) {
        const exerciseId = checkButton.dataset.exerciseId;
        const setNumber = parseInt(checkButton.dataset.setNumber);
        const serieItem = checkButton.closest('.serie-item');
        
        if (!serieItem) {
            console.error('❌ Serie item introuvable');
            return;
        }

        // Toggle l'état
        const isCompleted = serieItem.classList.toggle('completed');
        
        // Mettre à jour l'icône
        const checkIcon = checkButton.querySelector('.check-icon');
        if (checkIcon) {
            checkIcon.textContent = isCompleted ? '✓' : '';
        }

        // Sauvegarder
        if (!this.completedSets.has(exerciseId)) {
            this.completedSets.set(exerciseId, new Set());
        }

        const sets = this.completedSets.get(exerciseId);
        if (isCompleted) {
            sets.add(setNumber);
        } else {
            sets.delete(setNumber);
        }

        console.log(`${isCompleted ? '✅' : '❌'} Série ${setNumber} de ${exerciseId}`);

        // Démarrer le timer si complété
        if (isCompleted) {
            const restParam = serieItem.querySelector('.serie-rest .rest-time');
            let restSeconds = this.defaultRestTime;
            
            if (restParam) {
                const text = restParam.textContent;
                const match = text.match(/(\d+)s/);
                if (match) {
                    restSeconds = parseInt(match[1]);
                }
            }

            // Afficher la section timer
            const timerSection = document.querySelector('.timer-section');
            if (timerSection) {
                timerSection.style.display = 'block';
            }

            // Démarrer le timer
            this.timerManager.reset();
            this.timerManager.start(restSeconds);
        }
    }

    /**
     * Changer de semaine
     */
    changeWeek(direction) {
        const newWeek = this.currentWeek + direction;

        if (newWeek < 1 || newWeek > this.maxWeeks) {
            console.log('⚠️ Limite atteinte');
            return;
        }

        this.currentWeek = newWeek;
        console.log(`📅 Semaine ${this.currentWeek}`);
        
        this.updateWeekDisplay();
        this.renderCurrentWorkout();
    }

    /**
     * Mettre à jour l'affichage de la semaine
     */
    updateWeekDisplay() {
        const weekDisplay = document.getElementById('week-display');
        if (!weekDisplay) return;

        const bloc = Math.ceil(this.currentWeek / 4);
        const tempos = ['3-1-2', '2-0-2', '4-0-1', '1-0-1', '3-0-3', '2-1-1'];
        const tempo = tempos[(bloc - 1) % tempos.length];

        weekDisplay.innerHTML = `
            <div class="week-current">Semaine ${this.currentWeek}/${this.maxWeeks}</div>
            <div class="week-date">Bloc ${bloc} • Tempo ${tempo}</div>
        `;

        // Boutons
        const prevBtn = document.getElementById('prev-week');
        const nextBtn = document.getElementById('next-week');

        if (prevBtn) prevBtn.disabled = this.currentWeek === 1;
        if (nextBtn) nextBtn.disabled = this.currentWeek === this.maxWeeks;
    }

    /**
     * Afficher la séance actuelle
     */
    renderCurrentWorkout() {
        const workout = this.getDemoWorkout();
        
        if (this.workoutRenderer) {
            this.workoutRenderer.render(workout, this.currentWeek);
        } else {
            // Fallback si le renderer n'est pas disponible
            const container = document.getElementById('workout-container');
            if (!container) return;

            const html = this.generateWorkoutHTML(workout);
            container.innerHTML = html;
        }
    }

    /**
     * Générer le HTML de la séance (fallback)
     */
    generateWorkoutHTML(workout) {
        if (!workout || !workout.exercises) {
            return '<div class="empty-workout"><p>🏖️ Repos aujourd\'hui</p></div>';
        }

        return workout.exercises.map(exercise => `
            <div class="exercise-card slide-up ${exercise.superset ? 'superset' : ''}">
                <div class="exercise-header strength">
                    <span class="exercise-icon">💪</span>
                    <div class="exercise-title">
                        <h3 class="exercise-name">${exercise.name}</h3>
                        <div class="exercise-details">
                            <span>🎯 ${exercise.muscles}</span>
                        </div>
                    </div>
                </div>
                
                <div class="exercise-body">
                    <div class="exercise-params">
                        <div class="param-item">
                            <div class="param-label">SÉRIES</div>
                            <div class="param-value">${exercise.sets}</div>
                        </div>
                        <div class="param-item">
                            <div class="param-label">REPS</div>
                            <div class="param-value">${exercise.reps}</div>
                        </div>
                        <div class="param-item">
                            <div class="param-label">POIDS</div>
                            <div class="param-value">${exercise.weight}kg</div>
                        </div>
                        <div class="param-item">
                            <div class="param-label">REPOS</div>
                            <div class="param-value">${exercise.rest}s</div>
                        </div>
                    </div>
                    
                    <div class="series-container">
                        ${this.generateSetsHTML(exercise)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Générer le HTML des séries
     */
    generateSetsHTML(exercise) {
        const sets = [];
        for (let i = 1; i <= exercise.sets; i++) {
            const isCompleted = this.completedSets.has(exercise.id) && 
                               this.completedSets.get(exercise.id).has(i);
            
            sets.push(`
                <div class="serie-item ${isCompleted ? 'completed' : ''}" data-set-number="${i}">
                    <div class="serie-number">${i}</div>
                    <div class="serie-info">
                        <div class="serie-reps">${exercise.reps} reps</div>
                        <div class="serie-weight">${exercise.weight}kg</div>
                    </div>
                    <div class="serie-rest">
                        <span class="rest-icon">⏱️</span>
                        <span class="rest-time">${exercise.rest}s repos</span>
                    </div>
                    <button 
                        class="serie-check" 
                        data-exercise-id="${exercise.id}"
                        data-set-number="${i}"
                    >
                        <span class="check-icon">${isCompleted ? '✓' : ''}</span>
                    </button>
                </div>
            `);
        }
        return sets.join('');
    }

    /**
     * Navigation du bas
     */
    handleNavClick(index) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        navItems[index].classList.add('active');

        const container = document.getElementById('workout-container');
        if (!container) return;

        switch(index) {
            case 0:
                this.renderCurrentWorkout();
                break;
            case 1:
                container.innerHTML = '<div class="empty-workout"><h2>📊 Stats</h2><p>En développement...</p></div>';
                break;
            case 2:
                container.innerHTML = '<div class="empty-workout"><h2>📈 Progrès</h2><p>En développement...</p></div>';
                break;
            case 3:
                container.innerHTML = '<div class="empty-workout"><h2>👤 Profil</h2><p>En développement...</p></div>';
                break;
        }

        console.log(`📱 Onglet ${index}`);
    }

    /**
     * Données de démo
     */
    getDemoWorkout() {
        return {
            day: 'Lundi',
            exercises: [
                {
                    id: 'squat',
                    name: 'Goblet Squat',
                    muscles: 'Quadriceps, Fessiers',
                    sets: 4,
                    reps: 10,
                    weight: 27.5,
                    rest: 75,
                    superset: false
                },
                {
                    id: 'legpress',
                    name: 'Leg Press',
                    muscles: 'Quadriceps, Fessiers',
                    sets: 4,
                    reps: 10,
                    weight: 120,
                    rest: 75,
                    superset: false
                },
                {
                    id: 'rdl',
                    name: 'Romanian Deadlift',
                    muscles: 'Ischio-jambiers',
                    sets: 3,
                    reps: 12,
                    weight: 60,
                    rest: 60,
                    superset: true
                },
                {
                    id: 'curls',
                    name: 'Leg Curl',
                    muscles: 'Ischio-jambiers',
                    sets: 3,
                    reps: 12,
                    weight: 40,
                    rest: 60,
                    superset: true
                }
            ]
        };
    }

    /**
     * Afficher une erreur
     */
    showError(message) {
        const container = document.getElementById('workout-container');
        if (!container) return;

        container.innerHTML = `
            <div class="empty-workout">
                <p style="color: #ef4444;">❌ ${message}</p>
            </div>
        `;
    }
}

// ============================================================================
// DÉMARRAGE
// ============================================================================
const app = new App();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

console.log('📱 App loaded');
