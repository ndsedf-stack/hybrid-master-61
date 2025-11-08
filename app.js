/**
 * APP.JS - FICHIER PRINCIPAL
 * Gestion centralisée de l'application
 */

import WorkoutSession from './scripts/modules/workout-session.js';
import WorkoutRenderer from './scripts/ui/workout-renderer.js';
import TimerManager from './scripts/modules/timer-manager.js';

class App {
  constructor() {
    this.workoutSession = null;
    this.workoutRenderer = null;
    this.timerManager = null;
    this.currentWorkout = null;
  }

  async init() {
    try {
      console.log('🚀 Initialisation de l\'application...');

      // Créer des données de test directement
      this.currentWorkout = {
        name: "Séance A - Push",
        exercises: [
          {
            name: "Développé Couché",
            sets: 4,
            reps: 8,
            weight: 80,
            restTime: 120
          },
          {
            name: "Développé Incliné",
            sets: 3,
            reps: 10,
            weight: 60,
            restTime: 90
          },
          {
            name: "Dips",
            sets: 3,
            reps: 12,
            weight: 0,
            restTime: 90
          }
        ]
      };

      // Initialiser les managers
      this.workoutSession = new WorkoutSession();
      this.workoutRenderer = new WorkoutRenderer();
      this.timerManager = new TimerManager();

      // Initialiser le renderer
      this.workoutRenderer.init();

      // Initialiser le timer
      this.timerManager.init();

      // Connecter workoutRenderer au timerManager
      this.workoutRenderer.timerManager = this.timerManager;

      // Afficher la séance
      this.workoutRenderer.render(this.currentWorkout);

      // Attacher les événements
      this.attachEvents();

      console.log('✅ Application initialisée avec succès !');

    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation:', error);
    }
  }

  attachEvents() {
    // Événement pour valider une série
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('validate-set')) {
        const setRow = e.target.closest('.set-row');
        const exerciseIndex = parseInt(setRow.dataset.exerciseIndex);
        const setIndex = parseInt(setRow.dataset.setIndex);
        
        this.handleSetValidation(exerciseIndex, setIndex, setRow);
      }
    });
  }

  handleSetValidation(exerciseIndex, setIndex, setRow) {
    // Récupérer les valeurs
    const repsInput = setRow.querySelector('.reps-input');
    const weightInput = setRow.querySelector('.weight-input');

    const actualReps = parseInt(repsInput.value) || 0;
    const actualWeight = parseFloat(weightInput.value) || 0;

    // Valider visuellement
    setRow.classList.add('completed');
    const button = setRow.querySelector('.validate-set');
    button.textContent = '✓';
    button.disabled = true;

    console.log(`✅ Série validée: Ex${exerciseIndex + 1} - Set${setIndex + 1} - ${actualReps}x${actualWeight}kg`);

    // Démarrer le timer automatiquement
    const exercise = this.currentWorkout.exercises[exerciseIndex];
    const restTime = exercise.restTime || 90;
    const exerciseName = exercise.name;
    const setNumber = setIndex + 1;

    this.timerManager.start(restTime, exerciseName, setNumber);
  }
}

// Initialiser l'application au chargement
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
