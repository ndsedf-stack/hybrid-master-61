/**
 * TIMER MANAGER - VERSION PREMIUM
 * Gestion du timer de repos entre séries
 */
export default class TimerManager {
  constructor() {
    this.timerInterval = null;
    this.remainingTime = 0;
    this.initialTime = 0;
    this.isRunning = false;
    this.currentExercise = null;
    this.currentSetNumber = 0;
    
    // Éléments DOM
    this.timerWidget = null;
    this.timeDisplay = null;
    this.progressCircle = null;
    this.exerciseNameDisplay = null;
    this.setNumberDisplay = null;
  }

  /**
   * Initialise le timer (appelé depuis app.js)
   */
  init() {
    this.timerWidget = document.getElementById('timer-widget');
    this.timeDisplay = document.getElementById('timer-time');
    this.progressCircle = document.querySelector('.timer-progress-circle');
    this.exerciseNameDisplay = document.getElementById('timer-exercise-name');
    this.setNumberDisplay = document.getElementById('timer-set-number');

    if (!this.timerWidget) {
      console.error('❌ Timer widget introuvable dans le DOM');
      return;
    }

    this.attachEventListeners();
    console.log('✅ TimerManager initialisé');
  }

  /**
   * Attache les événements aux boutons
   */
  attachEventListeners() {
    // Bouton Pause/Resume
    const pauseBtn = document.getElementById('timer-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.togglePause());
    }

    // Bouton -15s
    const minus15Btn = document.getElementById('timer-minus-15');
    if (minus15Btn) {
      minus15Btn.addEventListener('click', () => this.adjustTime(-15));
    }

    // Bouton +15s
    const plus15Btn = document.getElementById('timer-plus-15');
    if (plus15Btn) {
      plus15Btn.addEventListener('click', () => this.adjustTime(15));
    }

    // Bouton Reset
    const resetBtn = document.getElementById('timer-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }

    // Bouton Skip
    const skipBtn = document.getElementById('timer-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => this.skip());
    }

    // Bouton Close
    const closeBtn = document.getElementById('timer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }
  }

  /**
   * Démarre le timer avec un temps de repos (en secondes)
   */
  start(seconds, exerciseName = '', setNumber = 0, totalSets = 0) {
    this.stop(); // Arrête tout timer en cours

    this.initialTime = seconds;
    this.remainingTime = seconds;
    this.currentExercise = exerciseName;
    this.currentSetNumber = setNumber;

    // Afficher le nom de l'exercice et numéro de série
    if (this.exerciseNameDisplay) {
      this.exerciseNameDisplay.textContent = exerciseName || 'Exercice';
    }
    if (this.setNumberDisplay) {
      this.setNumberDisplay.textContent = `Set ${setNumber}/${totalSets}`;
    }

    this.show();
    this.updateDisplay();
    this.resume();

    console.log(`⏱️ Timer démarré: ${seconds}s pour ${exerciseName} - Set ${setNumber}`);
  }

  /**
   * Reprend le timer
   */
  resume() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.timerInterval = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 0) {
        this.onTimerEnd();
      } else {
        this.updateDisplay();
      }
    }, 1000);

    // Mettre à jour le bouton pause
    const pauseBtn = document.getElementById('timer-pause');
    if (pauseBtn) {
      pauseBtn.textContent = 'Pause';
    }
  }

  /**
   * Met le timer en pause
   */
  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    clearInterval(this.timerInterval);

    const pauseBtn = document.getElementById('timer-pause');
    if (pauseBtn) {
      pauseBtn.textContent = 'Resume';
    }

    console.log('⏸️ Timer en pause');
  }

  /**
   * Toggle pause/resume
   */
  togglePause() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * Arrête complètement le timer
   */
  stop() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  /**
   * Réinitialise le timer au temps initial
   */
  reset() {
    this.stop();
    this.remainingTime = this.initialTime;
    this.updateDisplay();
    this.resume();
    console.log('🔄 Timer réinitialisé');
  }

  /**
   * Ajuste le temps (+/- secondes)
   */
  adjustTime(seconds) {
    this.remainingTime += seconds;
    if (this.remainingTime < 0) {
      this.remainingTime = 0;
    }
    this.updateDisplay();
    console.log(`⏱️ Temps ajusté de ${seconds}s`);
  }

  /**
   * Skip le timer (passer directement à la fin)
   */
  skip() {
    this.stop();
    this.hide();
    console.log('⏭️ Timer skippé');
  }

  /**
   * Appelé quand le timer arrive à 0
   */
  onTimerEnd() {
    this.stop();
    this.playNotification();
    this.vibrate();
    this.hide();
    console.log('✅ Timer terminé !');
  }

  /**
   * Met à jour l'affichage du temps et de la barre circulaire
   */
  updateDisplay() {
    // Affichage du temps (MM:SS)
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    if (this.timeDisplay) {
      this.timeDisplay.textContent = timeString;
    }

    // Mise à jour de la barre de progression circulaire
    if (this.progressCircle && this.initialTime > 0) {
      const percentage = (this.remainingTime / this.initialTime) * 100;
      const circumference = 2 * Math.PI * 54; // rayon = 54
      const offset = circumference - (percentage / 100) * circumference;
      
      this.progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
      this.progressCircle.style.strokeDashoffset = offset;
    }
  }

  /**
   * Affiche le widget timer
   */
  show() {
    if (this.timerWidget) {
      this.timerWidget.classList.add('active');
    }
  }

  /**
   * Cache le widget timer
   */
  hide() {
    if (this.timerWidget) {
      this.timerWidget.classList.remove('active');
    }
  }

  /**
   * Joue un son de notification
   */
  playNotification() {
    // Son système simple (beep)
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
   * Vibre (sur mobile uniquement)
   */
  vibrate() {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }
}
