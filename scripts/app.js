import ProgramData from './program-data.js';
import WorkoutRenderer from './scripts/ui/workout-renderer.js';
import TimerManager from './scripts/modules/timer-manager.js';

class App {
  constructor() {
    this.renderer = new WorkoutRenderer();
    this.timer = new TimerManager();
    this.weekNumber = 1;
    this.dayName = 'dimanche';
  }

  async init() {
    console.log('🚀 Initialisation Hybrid Master 61...');
    this.renderer.init();
    this.timer.init();
    this.renderer.timerManager = this.timer;
    this.renderWorkout();
    this.attachEvents();
    console.log('✅ Application prête !');
  }

  renderWorkout() {
    const week = ProgramData.getWeek(this.weekNumber);
    const workoutDay = ProgramData.getWorkout(this.weekNumber, this.dayName);
    workoutDay.name = this.capitalize(this.dayName);
    workoutDay.muscles = this.extractMuscles(workoutDay.exercises);
    console.log('📦 Séance chargée :', workoutDay);
    this.renderer.render(workoutDay, week);

    const label = document.getElementById('current-week-label');
    if (label) label.textContent = `Semaine ${this.weekNumber}`;
  }

  attachEvents() {
    document.getElementById('nav-prev-week')?.addEventListener('click', () => {
      if (this.weekNumber > 1) {
        this.weekNumber--;
        this.renderWorkout();
      }
    });

    document.getElementById('nav-next-week')?.addEventListener('click', () => {
      if (this.weekNumber < 26) {
        this.weekNumber++;
        this.renderWorkout();
      }
    });

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.serie-check');
      if (!btn) return;

      const exerciseId = btn.dataset.exerciseId;
      const setNumber = parseInt(btn.dataset.setNumber);
      console.log(`✅ Série cochée : ${exerciseId} - Set ${setNumber}`);

      const serieItem = btn.closest('.serie-item');
      if (serieItem) {
        serieItem.classList.add('completed');
      }

      btn.querySelector('.check-icon').textContent = '✓';
      btn.disabled = true;

      const exercise = this.findExerciseById(exerciseId);
      if (exercise) {
        const restTime = exercise.rest || 90;
        this.timer.start(restTime, exercise.name, setNumber);
      }
    });
  }

  findExerciseById(id) {
    const workout = ProgramData.getWorkout(this.weekNumber, this.dayName);
    return workout.exercises.find(ex => ex.id === id || ex.name === id);
  }

  extractMuscles(exercises) {
    const muscles = new Set();
    exercises.forEach(ex => {
      if (Array.isArray(ex.muscles)) ex.muscles.forEach(m => muscles.add(m));
    });
    return Array.from(muscles);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
