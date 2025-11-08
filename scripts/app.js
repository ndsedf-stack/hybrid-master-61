/**
 * APP.JS - FICHIER PRINCIPAL
 * Gestion centralisée de l'application
 */

import WorkoutManager from './scripts/modules/workout-manager.js';
import WorkoutRenderer from './scripts/ui/workout-renderer.js';
import TimerManager from './scripts/modules/timer-manager.js';

class App {
  constructor() {
    this.workoutManager = new WorkoutManager();
    this.workoutRenderer = new WorkoutRenderer();
    this.timerManager = new TimerManager();
    this.currentWorkout = null;
  }

  /**
   * Initialise l'application
   */
  async init() {
    console.log('🚀 Initialisation de l\'application...');

    // Initialiser les modules
    this.workoutRenderer.init();
    this.timerManager.init();

    // Charger les workouts
    await this.workoutManager.loadWorkouts();

    // Attacher les événements globaux
    this.attachGlobalEvents();

    // Charger le workout actuel (ou le dernier)
    this.loadCurrentWorkout();

    console.log('✅ Application initialisée avec succès !');
  }

  /**
   * Charge le workout actuel
   */
  loadCurrentWorkout() {
    const workouts = this.workoutManager.getWorkouts();
    
    if (workouts.length === 0) {
      console.warn('⚠️ Aucun workout disponible');
      return;
    }

    // Charger le premier workout par défaut
    this.currentWorkout = workouts[0];
    this.workoutRenderer.render(this.currentWorkout);
    
    console.log('✅ Workout chargé:', this.currentWorkout.name);
  }

  /**
   * Attache les événements globaux (délégation d'événements)
   */
  attachGlobalEvents() {
    const container = document.getElementById('workout-container');
    if (!container) return;

    // Délégation d'événements sur le conteneur principal
    container.addEventListener('click', (e) => {
      const target = e.target;

      // Bouton "Valider" une série
      if (target.classList.contains('btn-validate-set')) {
        this.handleValidateSet(target);
      }

      // Bouton "Ajouter une série"
      if (target.classList.contains('btn-add-set')) {
        this.handleAddSet(target);
      }
    });

    // Écouter les changements dans les inputs (reps/weight)
    container.addEventListener('input', (e) => {
      if (e.target.classList.contains('input-reps') || 
          e.target.classList.contains('input-weight')) {
        this.handleInputChange(e.target);
      }
    });
  }

  /**
   * Gère la validation d'une série
   */
  handleValidateSet(button) {
    const exerciseIndex = parseInt(button.dataset.exerciseIndex);
    const setIndex = parseInt(button.dataset.setIndex);

    const setRow = button.closest('.set-row');
    const repsInput = setRow.querySelector('.input-reps');
    const weightInput = setRow.querySelector('.input-weight');

    const reps = parseInt(repsInput.value) || 0;
    const weight = parseFloat(weightInput.value) || 0;

    if (reps === 0) {
      alert('⚠️ Veuillez entrer un nombre de répétitions');
      return;
    }

    // Mettre à jour les données
    const setData = {
      reps: reps,
      weight: weight,
      completed: true,
      timestamp: new Date().toISOString()
    };

    this.workoutManager.updateSet(
      this.currentWorkout.id,
      exerciseIndex,
      setIndex,
      setData
    );

    // Mettre à jour l'affichage
    this.workoutRenderer.updateSetDisplay(exerciseIndex, setIndex, setData);

    // Sauvegarder
    this.workoutManager.saveWorkouts();

    console.log(`✅ Série validée: Ex${exerciseIndex} Set${setIndex} - ${reps}x${weight}kg`);

    // DÉMARRER LE TIMER après validation
    this.startRestTimer(exerciseIndex, setIndex);
  }

  /**
   * Démarre le timer de repos après validation d'une série
   */
  startRestTimer(exerciseIndex, setIndex) {
    if (!this.currentWorkout) return;

    const exercise = this.currentWorkout.exercises[exerciseIndex];
    if (!exercise) return;

    // Temps de repos par défaut : 90 secondes (personnalisable)
    const restTime = exercise.restTime || 90;
    
    // Nombre total de séries
    const totalSets = exercise.sets.length;
    
    // Numéro de la série qui vient d'être validée
    const completedSetNumber = setIndex + 1;

    // Ne pas démarrer le timer si c'est la dernière série
    if (completedSetNumber >= totalSets) {
      console.log('🏁 Dernière série validée, pas de timer');
      return;
    }

    // Démarrer le timer
    this.timerManager.start(
      restTime,
      exercise.name,
      completedSetNumber,
      totalSets
    );

    console.log(`⏱️ Timer démarré: ${restTime}s après Set ${completedSetNumber}`);
  }

  /**
   * Gère l'ajout d'une série
   */
  handleAddSet(button) {
    const exerciseIndex = parseInt(button.dataset.exerciseIndex);

    // Ajouter la série dans les données
    const newSet = {
      reps: null,
      weight: null,
      completed: false
    };

    this.workoutManager.addSet(this.currentWorkout.id, exerciseIndex, newSet);

    // Mettre à jour l'affichage
    this.workoutRenderer.addSetToExercise(exerciseIndex);

    // Sauvegarder
    this.workoutManager.saveWorkouts();

    console.log(`✅ Nouvelle série ajoutée à l'exercice ${exerciseIndex}`);
  }

  /**
   * Gère les changements dans les inputs (auto-save)
   */
  handleInputChange(input) {
    const setRow = input.closest('.set-row');
    if (!setRow) return;

    const exerciseIndex = parseInt(setRow.dataset.exerciseIndex);
    const setIndex = parseInt(setRow.dataset.setIndex);

    const repsInput = setRow.querySelector('.input-reps');
    const weightInput = setRow.querySelector('.input-weight');

    const reps = parseInt(repsInput.value) || null;
    const weight = parseFloat(weightInput.value) || null;

    // Mettre à jour les données (sans marquer comme completed)
    this.workoutManager.updateSet(
      this.currentWorkout.id,
      exerciseIndex,
      setIndex,
      { reps, weight }
    );

    // Auto-save (debounced)
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.workoutManager.saveWorkouts();
      console.log('💾 Auto-save effectué');
    }, 500);
  }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

console.log('✅ App.js chargé avec succès');
