/**
 * TIMER MANAGER - Gestion du timer de repos
 * Module autonome pour le compte à rebours entre les séries
 * 
 * Fonctionnalités:
 * - Compte à rebours configurable
 * - Notifications visuelles et sonores
 * - Pause/Reprise
 * - Configuration via roue de paramètres
 */

export default class TimerManager {
    constructor() {
        this.timeRemaining = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.config = {
            soundEnabled: true,
            vibrationEnabled: true,
            autoStart: true
        };
        
        this.initUI();
        this.loadConfig();
    }

    /**
     * Initialise l'interface du timer
     */
    initUI() {
        // Vérifier si l'UI existe déjà
        if (document.getElementById('timer-widget')) return;

        const timerHTML = `
            <div id="timer-widget" class="timer-widget hidden">
                <div class="timer-content">
                    <div class="timer-display">
                        <span class="timer-minutes">00</span>
                        <span class="timer-separator">:</span>
                        <span class="timer-seconds">00</span>
                    </div>
                    <div class="timer-controls">
                        <button id="timer-pause-btn" class="timer-btn">⏸️ Pause</button>
                        <button id="timer-reset-btn" class="timer-btn">🔄 Reset</button>
                        <button id="timer-settings-btn" class="timer-btn">⚙️</button>
                    </div>
                </div>
            </div>

            <div id="timer-settings-modal" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Paramètres du Timer</h3>
                        <button id="close-timer-settings" class="close-btn">✕</button>
                    </div>
                    <div class="modal-body">
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="timer-sound" checked>
                                Son activé
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="timer-vibration" checked>
                                Vibration activée
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="timer-autostart" checked>
                                Démarrage automatique
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', timerHTML);
        this.initEventListeners();
    }

    /**
     * Initialise les écouteurs d'événements
     */
    initEventListeners() {
        // Bouton Pause/Reprise
        document.getElementById('timer-pause-btn')?.addEventListener('click', () => {
            if (this.isRunning) {
                this.pause();
            } else {
                this.resume();
            }
        });

        // Bouton Reset
        document.getElementById('timer-reset-btn')?.addEventListener('click', () => {
            this.reset();
        });

        // Bouton Paramètres
        document.getElementById('timer-settings-btn')?.addEventListener('click', () => {
            this.openSettings();
        });

        // Fermer modal paramètres
        document.getElementById('close-timer-settings')?.addEventListener('click', () => {
            this.closeSettings();
        });

        // Sauvegarder paramètres
        document.getElementById('timer-sound')?.addEventListener('change', (e) => {
            this.config.soundEnabled = e.target.checked;
            this.saveConfig();
        });

        document.getElementById('timer-vibration')?.addEventListener('change', (e) => {
            this.config.vibrationEnabled = e.target.checked;
            this.saveConfig();
        });

        document.getElementById('timer-autostart')?.addEventListener('change', (e) => {
            this.config.autoStart = e.target.checked;
            this.saveConfig();
        });
    }

    /**
     * Démarre le timer avec un temps donné (en secondes)
     */
    start(seconds) {
        this.reset();
        this.timeRemaining = seconds;
        this.isRunning = true;
        this.updateDisplay();
        this.show();
        
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
    }

    /**
     * Tick du timer (appelé chaque seconde)
     */
    tick() {
        if (!this.isRunning) return;

        this.timeRemaining--;
        this.updateDisplay();

        if (this.timeRemaining <= 0) {
            this.complete();
        }
    }

    /**
     * Met en pause le timer
     */
    pause() {
        this.isRunning = false;
        const pauseBtn = document.getElementById('timer-pause-btn');
        if (pauseBtn) {
            pauseBtn.textContent = '▶️ Reprendre';
        }
    }

    /**
     * Reprend le timer
     */
    resume() {
        if (this.timeRemaining > 0) {
            this.isRunning = true;
            const pauseBtn = document.getElementById('timer-pause-btn');
            if (pauseBtn) {
                pauseBtn.textContent = '⏸️ Pause';
            }
        }
    }

    /**
     * Réinitialise le timer
     */
    reset() {
        this.isRunning = false;
        this.timeRemaining = 0;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.updateDisplay();
        this.hide();
        
        const pauseBtn = document.getElementById('timer-pause-btn');
        if (pauseBtn) {
            pauseBtn.textContent = '⏸️ Pause';
        }
    }

    /**
     * Timer terminé
     */
    complete() {
        this.reset();
        this.notify();
    }

    /**
     * Notifications (son + vibration)
     */
    notify() {
        // Son
        if (this.config.soundEnabled) {
            this.playSound();
        }

        // Vibration
        if (this.config.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }

        // Notification visuelle
        this.showNotification();
    }

    /**
     * Joue un son de notification
     */
    playSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }

    /**
     * Affiche une notification visuelle
     */
    showNotification() {
        const notification = document.createElement('div');
        notification.className = 'timer-notification';
        notification.textContent = '✅ Repos terminé !';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Met à jour l'affichage du timer
     */
    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;

        const minutesEl = document.querySelector('.timer-minutes');
        const secondsEl = document.querySelector('.timer-seconds');

        if (minutesEl) {
            minutesEl.textContent = String(minutes).padStart(2, '0');
        }
        if (secondsEl) {
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }
    }

    /**
     * Affiche le widget timer
     */
    show() {
        const widget = document.getElementById('timer-widget');
        if (widget) {
            widget.classList.remove('hidden');
        }
    }

    /**
     * Cache le widget timer
     */
    hide() {
        const widget = document.getElementById('timer-widget');
        if (widget) {
            widget.classList.add('hidden');
        }
    }

    /**
     * Ouvre le modal des paramètres
     */
    openSettings() {
        const modal = document.getElementById('timer-settings-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    /**
     * Ferme le modal des paramètres
     */
    closeSettings() {
        const modal = document.getElementById('timer-settings-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Charge la configuration depuis localStorage
     */
    loadConfig() {
        const saved = localStorage.getItem('timer-config');
        if (saved) {
            this.config = JSON.parse(saved);
            this.applyConfig();
        }
    }

    /**
     * Sauvegarde la configuration dans localStorage
     */
    saveConfig() {
        localStorage.setItem('timer-config', JSON.stringify(this.config));
    }

    /**
     * Applique la configuration à l'UI
     */
    applyConfig() {
        const soundCheckbox = document.getElementById('timer-sound');
        const vibrationCheckbox = document.getElementById('timer-vibration');
        const autostartCheckbox = document.getElementById('timer-autostart');

        if (soundCheckbox) soundCheckbox.checked = this.config.soundEnabled;
        if (vibrationCheckbox) vibrationCheckbox.checked = this.config.vibrationEnabled;
        if (autostartCheckbox) autostartCheckbox.checked = this.config.autoStart;
    }
}
