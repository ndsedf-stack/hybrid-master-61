/**
 * TIMER MANAGER - VERSION AMÉLIORÉE v1.1
 * Gestion complète du timer de repos avec contrôles avancés
 * 
 * Fonctionnalités:
 * - Démarrage automatique après validation série
 * - Contrôles: Pause, Resume, Stop, Skip, Reset
 * - Ajustement: +15s / -15s
 * - Affichage: Temps + Exercice + Série
 * - Notification: Son/Vibration à la fin
 * - Progress bar circulaire
 */

export default class TimerManager {
    constructor() {
        // État du timer
        this.isRunning = false;
        this.isPaused = false;
        this.timeRemaining = 0;
        this.initialTime = 0;
        this.timerId = null;
        
        // Contexte (exercice en cours)
        this.currentExercise = null;
        this.currentSet = null;
        
        // Références DOM
        this.widget = null;
        this.progressRing = null;
        
        // Configuration
        this.config = {
            soundEnabled: true,
            vibrationEnabled: true,
            autoStart: true
        };
        
        // Initialiser le widget
        this.initWidget();
    }
    
    /**
     * Initialise le widget DOM (appelé une seule fois)
     */
    initWidget() {
        // Vérifier si le widget existe déjà
        this.widget = document.getElementById('timer-widget');
        
        if (!this.widget) {
            console.error('❌ Widget timer introuvable dans le DOM');
            return;
        }
        
        // Récupérer les éléments
        this.progressRing = this.widget.querySelector('.timer-progress-ring circle');
        
        // Attacher les event listeners
        this.attachListeners();
        
        console.log('✅ TimerManager initialisé');
    }
    
    /**
     * Attache les event listeners aux boutons
     */
    attachListeners() {
        const pauseBtn = document.getElementById('timer-pause');
        const resetBtn = document.getElementById('timer-reset');
        const closeBtn = document.getElementById('timer-close');
        const add15Btn = document.getElementById('timer-add-15');
        const sub15Btn = document.getElementById('timer-sub-15');
        const skipBtn = document.getElementById('timer-skip');
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                if (this.isPaused) {
                    this.resume();
                } else {
                    this.pause();
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.stop());
        }
        
        if (add15Btn) {
            add15Btn.addEventListener('click', () => this.addTime(15));
        }
        
        if (sub15Btn) {
            sub15Btn.addEventListener('click', () => this.addTime(-15));
        }
        
        if (skipBtn) {
            skipBtn.addEventListener('click', () => this.skip());
        }
    }
    
    /**
     * Démarre le timer
     * @param {number} seconds - Durée en secondes
     * @param {string} exerciseName - Nom de l'exercice (optionnel)
     * @param {number} setNumber - Numéro de série (optionnel)
     */
    start(seconds, exerciseName = null, setNumber = null) {
        // Arrêter le timer en cours si existant
        if (this.isRunning) {
            this.stop();
        }
        
        // Initialiser
        this.timeRemaining = seconds;
        this.initialTime = seconds;
        this.isRunning = true;
        this.isPaused = false;
        this.currentExercise = exerciseName;
        this.currentSet = setNumber;
        
        // Afficher le widget
        this.show();
        
        // Mettre à jour l'affichage initial
        this.updateDisplay();
        
        // Démarrer le compte à rebours
        this.timerId = setInterval(() => {
            if (!this.isPaused) {
                this.timeRemaining--;
                
                this.updateDisplay();
                
                // Timer terminé
                if (this.timeRemaining <= 0) {
                    this.onComplete();
                }
            }
        }, 1000);
        
        console.log(`⏱️ Timer démarré: ${seconds}s`);
    }
    
    /**
     * Met le timer en pause
     */
    pause() {
        if (!this.isRunning) return;
        
        this.isPaused = true;
        
        // Changer le bouton pause en resume
        const pauseBtn = document.getElementById('timer-pause');
        if (pauseBtn) {
            pauseBtn.innerHTML = '▶️ Reprendre';
        }
        
        console.log('⏸️ Timer en pause');
    }
    
    /**
     * Reprend le timer après pause
     */
    resume() {
        if (!this.isRunning) return;
        
        this.isPaused = false;
        
        // Changer le bouton resume en pause
        const pauseBtn = document.getElementById('timer-pause');
        if (pauseBtn) {
            pauseBtn.innerHTML = '⏸️ Pause';
        }
        
        console.log('▶️ Timer repris');
    }
    
    /**
     * Arrête complètement le timer et cache le widget
     */
    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        
        this.isRunning = false;
        this.isPaused = false;
        this.timeRemaining = 0;
        this.initialTime = 0;
        this.currentExercise = null;
        this.currentSet = null;
        
        this.hide();
        
        console.log('⏹️ Timer arrêté');
    }
    
    /**
     * Recommence le timer avec le temps initial
     */
    reset() {
        if (!this.isRunning) return;
        
        this.timeRemaining = this.initialTime;
        this.isPaused = false;
        
        // Réinitialiser le bouton pause
        const pauseBtn = document.getElementById('timer-pause');
        if (pauseBtn) {
            pauseBtn.innerHTML = '⏸️ Pause';
        }
        
        this.updateDisplay();
        
        console.log('🔄 Timer réinitialisé');
    }
    
    /**
     * Passe le timer (skip)
     */
    skip() {
        console.log('⏭️ Timer passé');
        this.stop();
    }
    
    /**
     * Ajoute ou retire du temps
     * @param {number} seconds - Secondes à ajouter (positif) ou retirer (négatif)
     */
    addTime(seconds) {
        if (!this.isRunning) return;
        
        this.timeRemaining += seconds;
        
        // Ne pas descendre en dessous de 0
        if (this.timeRemaining < 0) {
            this.timeRemaining = 0;
        }
        
        this.updateDisplay();
        
        const action = seconds > 0 ? '+' : '';
        console.log(`⏱️ ${action}${seconds}s (reste: ${this.timeRemaining}s)`);
    }
    
    /**
     * Met à jour l'affichage du timer
     */
    updateDisplay() {
        // Temps
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        
        const minutesElement = document.getElementById('timer-minutes');
        const secondsElement = document.getElementById('timer-seconds');
        
        if (minutesElement) {
            minutesElement.textContent = String(minutes).padStart(2, '0');
        }
        
        if (secondsElement) {
            secondsElement.textContent = String(seconds).padStart(2, '0');
        }
        
        // Exercice + Série
        const exerciseInfoElement = document.getElementById('timer-exercise-info');
        if (exerciseInfoElement && this.currentExercise) {
            const setInfo = this.currentSet ? ` - Série ${this.currentSet}` : '';
            exerciseInfoElement.textContent = `${this.currentExercise}${setInfo}`;
        }
        
        // Progress bar circulaire
        if (this.progressRing && this.initialTime > 0) {
            const progress = (this.timeRemaining / this.initialTime) * 100;
            const circumference = 2 * Math.PI * 54; // rayon = 54
            const offset = circumference - (progress / 100) * circumference;
            
            this.progressRing.style.strokeDashoffset = offset;
        }
    }
    
    /**
     * Appelé quand le timer se termine
     */
    onComplete() {
        // Arrêter le timer
        clearInterval(this.timerId);
        this.timerId = null;
        this.isRunning = false;
        
        // Notification
        this.showNotification();
        
        // Son
        if (this.config.soundEnabled) {
            this.playSound();
        }
        
        // Vibration
        if (this.config.vibrationEnabled && 'vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
        
        // Cacher automatiquement après 3 secondes
        setTimeout(() => {
            this.hide();
        }, 3000);
        
        console.log('✅ Timer terminé !');
    }
    
    /**
     * Affiche une notification
     */
    showNotification() {
        const notification = document.getElementById('timer-notification');
        if (!notification) return;
        
        notification.classList.add('show');
        
        // Cacher après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    /**
     * Joue un son (simple beep avec Web Audio API)
     */
    playSound() {
        try {
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
        } catch (error) {
            console.log('Son non disponible:', error);
        }
    }
    
    /**
     * Affiche le widget
     */
    show() {
        if (this.widget) {
            this.widget.classList.remove('hidden');
        }
    }
    
    /**
     * Cache le widget
     */
    hide() {
        if (this.widget) {
            this.widget.classList.add('hidden');
        }
    }
    
    /**
     * Charge la configuration depuis localStorage
     */
    loadConfig() {
        try {
            const saved = localStorage.getItem('timer-config');
            if (saved) {
                this.config = { ...this.config, ...JSON.parse(saved) };
            }
        } catch (error) {
            console.error('Erreur chargement config timer:', error);
        }
    }
    
    /**
     * Sauvegarde la configuration
     */
    saveConfig() {
        try {
            localStorage.setItem('timer-config', JSON.stringify(this.config));
        } catch (error) {
            console.error('Erreur sauvegarde config timer:', error);
        }
    }
}
