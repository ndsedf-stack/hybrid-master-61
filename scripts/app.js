/**
 * HYBRID MASTER 60 - APPLICATION COMPLÈTE STANDALONE
 * Version sans imports - Tout dans un seul fichier
 */

// ============================================================================
// TIMER MANAGER
// ============================================================================
class TimerManager {
    constructor() {
        this.seconds = 0;
        this.isRunning = false;
        this.isFinished = false;
        this.interval = null;
        this.targetSeconds = null;
        this.onTick = null;
        this.onComplete = null;

        // Éléments DOM
        this.display = null;
        this.startBtn = null;
        this.pauseBtn = null;
        this.resetBtn = null;
    }

    init() {
        this.display = document.getElementById('timer-display');
        this.startBtn = document.getElementById('timer-start');
        this.pauseBtn = document.getElementById('timer-pause');
        this.resetBtn = document.getElementById('timer-reset');

        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.start());
        }
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.pause());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.reset());
        }

        // Raccourci clavier ESPACE
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.toggle();
            }
        });

        this.updateDisplay();
        this.updateButtons();
        console.log('✅ TimerManager initialisé');
    }

    start(targetSeconds = null) {
        if (this.isRunning) return;

        this.isRunning = true;
        this.isFinished = false;
        this.targetSeconds = targetSeconds;
        
        if (this.display) {
            this.display.classList.remove('finished');
        }

        this.interval = setInterval(() => {
            this.seconds++;
            this.updateDisplay();

            if (this.onTick) {
                this.onTick(this.seconds);
            }

            if (this.targetSeconds && this.seconds >= this.targetSeconds) {
                this.complete();
            }
        }, 1000);

        this.updateButtons();
        this.updateDisplay();
    }

    pause() {
        if (!this.isRunning) return;

        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }

        this.updateButtons();
        this.updateDisplay();
    }

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    reset() {
        this.pause();
        this.seconds = 0;
        this.targetSeconds = null;
        this.isFinished = false;
        
        if (this.display) {
            this.display.classList.remove('finished');
        }
        
        this.updateDisplay();
        this.updateButtons();
    }

    complete() {
        this.pause();
        this.isFinished = true;
        
        if (this.display) {
            this.display.classList.add('finished');
        }
        
        this.playSound();
        this.showVisualNotification();
        
        if (this.onComplete) {
            this.onComplete(this.seconds);
        }

        this.updateDisplay();
    }

    showVisualNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white;
            padding: 30px 50px;
            border-radius: 15px;
            font-size: 2rem;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 10px 40px rgba(220, 53, 69, 0.6);
            animation: alert-bounce 0.5s ease-out;
        `;
        notification.textContent = '⏱️ Timer terminé !';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes alert-bounce {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transition = 'opacity 0.5s ease-out';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
                if (style.parentNode) {
                    document.head.removeChild(style);
                }
            }, 500);
        }, 3000);
    }

    playSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvPaiTcIG2m98OScTgwOUKru97RgGgU7k9n0x3QoBS1+zPLaizsJHGu+8eadUQ0PWKvm9LFeFQU=');
            audio.play().catch(() => {});
        } catch (e) {
            console.log('Son non disponible');
        }
    }

    formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        if (this.display) {
            this.display.textContent = this.formatTime(this.seconds);

            this.display.classList.toggle('running', this.isRunning);
            this.display.classList.toggle('paused', !this.isRunning && this.seconds > 0 && !this.isFinished);
            this.display.classList.toggle('finished', this.isFinished);
        }
    }

    updateButtons() {
        if (this.startBtn) {
            this.startBtn.style.display = this.isRunning ? 'none' : 'inline-flex';
        }
        if (this.pauseBtn) {
            this.pauseBtn.style.display = this.isRunning ? 'inline-flex' : 'none';
        }
    }
}

// ============================================================================
// APPLICATION PRINCIPALE
// ============================================================================
class App {
    constructor() {
        this.currentWeek = 1;
        this.maxWeeks = 26;
        this.currentDay = 0;
        this.completedSets = new Map();
        
        this.timerManager = null;
        this.defaultRestTime = 90;
    }

    async init() {
        console.log('🚀 Démarrage de l\'application...');

        try {
            // Initialiser le Timer Manager
            this.timerManager = new TimerManager();
            this.timerManager.init();
            console.log('✅ TimerManager initialisé');

            // Attacher les événements
            this.attachEventListeners();
            console.log('✅ Événements attachés');

            // Afficher la séance
            this.renderCurrentWorkout();
            console.log('✅ Application prête !');

        } catch (error) {
            console.error('❌ Erreur:', error);
            this.showError('Erreur de chargement: ' + error.message);
        }
    }

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

        // Bouton paramètres
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

        // Checkboxes
        document.addEventListener('click', (e) => {
            const checkButton = e.target.closest('.serie-check');
            if (!checkButton) return;

            e.preventDefault();
            e.stopPropagation();

            this.handleSetCompletion(checkButton);
        });

        console.log('✅ Event listeners attachés');
    }

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

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            .timer-settings-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; }
            .modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); }
            .modal-content { position: relative; background: #1a1f2e; border-radius: 16px; width: 90%; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); animation: modalSlideIn 0.3s ease-out; }
            @keyframes modalSlideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .modal-header { padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; }
            .modal-header h2 { margin: 0; font-size: 1.5rem; color: #ffffff; }
            .modal-close { background: none; border: none; font-size: 2rem; color: #9ca3af; cursor: pointer; line-height: 1; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.2s; }
            .modal-close:hover { background: rgba(255,255,255,0.1); color: #ffffff; }
            .modal-body { padding: 24px; }
            .settings-group { display: flex; flex-direction: column; gap: 16px; }
            .settings-group label { font-size: 0.9rem; color: #9ca3af; font-weight: 500; }
            .time-picker { display: flex; align-items: center; gap: 16px; justify-content: center; }
            .time-btn { width: 48px; height: 48px; border-radius: 12px; background: #ff6b35; border: none; color: white; font-size: 1.5rem; font-weight: bold; cursor: pointer; transition: all 0.2s; }
            .time-btn:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(255,107,53,0.4); }
            .time-btn:active { transform: scale(0.95); }
            .time-display { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); padding: 12px 20px; border-radius: 12px; }
            .time-display input { width: 80px; font-size: 1.8rem; font-weight: bold; background: none; border: none; color: #ffffff; text-align: center; }
            .time-display span { color: #9ca3af; font-size: 0.9rem; }
            .time-presets { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
            .preset-btn { padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #ffffff; cursor: pointer; transition: all 0.2s; font-weight: 500; }
            .preset-btn:hover { background: rgba(255,107,53,0.2); border-color: #ff6b35; }
            .modal-footer { padding: 24px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 12px; justify-content: flex-end; }
            .modal-footer button { padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; }
            .btn-secondary { background: rgba(255,255,255,0.1); color: #ffffff; }
            .btn-secondary:hover { background: rgba(255,255,255,0.15); }
            .btn-primary { background: #ff6b35; color: white; }
            .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,107,53,0.4); }
        `;
        document.head.appendChild(style);

        // Event listeners
        const restTimeInput = modal.querySelector('#rest-time');
        const decreaseBtn = modal.querySelector('[data-action="decrease"]');
        const increaseBtn = modal.querySelector('[data-action="increase"]');
        const presetBtns = modal.querySelectorAll('.preset-btn');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const saveBtn = modal.querySelector('.modal-save');
        const overlay = modal.querySelector('.modal-overlay');

        decreaseBtn.addEventListener('click', () => {
            const current = parseInt(restTimeInput.value);
            restTimeInput.value = Math.max(15, current - 15);
        });

        increaseBtn.addEventListener('click', () => {
            const current = parseInt(restTimeInput.value);
            restTimeInput.value = Math.min(300, current + 15);
        });

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                restTimeInput.value = btn.dataset.time;
            });
        });

        const closeModal = () => {
            modal.remove();
            style.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        saveBtn.addEventListener('click', () => {
            this.defaultRestTime = parseInt(restTimeInput.value);
            this.showSuccess(`Temps de repos défini à ${this.defaultRestTime}s`);
            closeModal();
            console.log(`⚙️ Temps de repos: ${this.defaultRestTime}s`);
        });
    }

    handleSetCompletion(checkButton) {
        const exerciseId = checkButton.dataset.exerciseId;
        const setNumber = parseInt(checkButton.dataset.setNumber);
        const serieItem = checkButton.closest('.serie-item');
        
        if (!serieItem) {
            console.error('❌ Serie item introuvable');
            return;
        }

        const isCompleted = serieItem.classList.toggle('completed');
        
        const checkIcon = checkButton.querySelector('.check-icon');
        if (checkIcon) {
            checkIcon.textContent = isCompleted ? '✓' : '';
        }

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

        if (isCompleted) {
            const restParam = serieItem.querySelector('.serie-rest .rest-time');
            let restSeconds = this.defaultRestTime;
            
            if (restParam) {
                const text = restParam.textContent;
                const match = text.match(/(\d+)/);
                if (match) {
                    restSeconds = parseInt(match[1]);
                }
            }

            const timerSection = document.querySelector('.timer-section');
            if (timerSection) {
                timerSection.style.display = 'block';
            }

            this.timerManager.reset();
            this.timerManager.start(restSeconds);
        }
    }

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

        const prevBtn = document.getElementById('prev-week');
        const nextBtn = document.getElementById('next-week');

        if (prevBtn) prevBtn.disabled = this.currentWeek === 1;
        if (nextBtn) nextBtn.disabled = this.currentWeek === this.maxWeeks;
    }

    renderCurrentWorkout() {
        const container = document.getElementById('workout-container');
        if (!container) return;

        const workout = this.getDemoWorkout();

        if (!workout) {
            container.innerHTML = '<div class="empty-workout"><p>🏖️ Repos aujourd\'hui</p></div>';
            return;
        }

        const html = this.generateWorkoutHTML(workout);
        container.innerHTML = html;
    }

    generateWorkoutHTML(workout) {
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

    showError(message) {
        const container = document.getElementById('workout-container');
        if (!container) return;

        container.innerHTML = `
            <div class="empty-workout">
                <p style="color: #ef4444;">❌ ${message}</p>
            </div>
        `;
    }

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #22c55e;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease-out;
        `;
        toast.textContent = message;

        const style = document.createElement('style');
        style.textContent = '@keyframes slideDown { from { opacity: 0; transform: translateX(-50%) translateY(-20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }';
        document.head.appendChild(style);

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s';
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) document.body.removeChild(toast);
                if (style.parentNode) document.head.removeChild(style);
            }, 300);
        }, 3000);
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

console.log('📱 App loaded - Version Standalone');
