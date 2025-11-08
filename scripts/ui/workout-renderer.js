/**
 * WORKOUT RENDERER - VERSION PREMIUM
 * Affichage texte des reps/poids, validation visuelle
 */
export default class WorkoutRenderer {
  constructor() {
    this.container = null;
  }

  init() {
    this.container = document.getElementById('workout-container');
    if (!this.container) {
      console.error('❌ Conteneur workout introuvable');
    }
  }

  /**
   * Affiche un workout complet
   */
  render(workout) {
    if (!this.container) {
      console.error('❌ Container non initialisé');
      return;
    }

    this.container.innerHTML = `
      <div class="workout-header">
        <h2>${workout.name}</h2>
        <p class="workout-date">${new Date(workout.date).toLocaleDateString('fr-FR')}</p>
      </div>
      <div class="exercises-list">
        ${workout.exercises.map((ex, idx) => this.renderExercise(ex, idx)).join('')}
      </div>
    `;

    console.log('✅ Workout rendu:', workout.name);
  }

  /**
   * Affiche un exercice avec ses séries
   */
  renderExercise(exercise, exerciseIndex) {
    const sets = exercise.sets || [];
    
    return `
      <div class="exercise-card" data-exercise-index="${exerciseIndex}">
        <div class="exercise-header">
          <h3>${exercise.name}</h3>
          <span class="sets-count">${sets.length} série(s)</span>
        </div>
        
        <div class="sets-container">
          ${sets.map((set, setIndex) => this.renderSet(set, exerciseIndex, setIndex)).join('')}
        </div>

        <button class="btn-add-set" data-exercise-index="${exerciseIndex}">
          + Ajouter une série
        </button>
      </div>
    `;
  }

  /**
   * Affiche une série individuelle
   */
  renderSet(set, exerciseIndex, setIndex) {
    const isCompleted = set.completed || false;
    const completedClass = isCompleted ? 'completed' : '';
    
    return `
      <div class="set-row ${completedClass}" 
           data-exercise-index="${exerciseIndex}" 
           data-set-index="${setIndex}">
        
        <div class="set-number">Set ${setIndex + 1}</div>
        
        <div class="set-inputs">
          <div class="input-group">
            <label>Reps</label>
            <input type="number" 
                   class="input-reps" 
                   value="${set.reps || ''}" 
                   placeholder="0"
                   ${isCompleted ? 'disabled' : ''}>
          </div>
          
          <div class="input-group">
            <label>Poids (kg)</label>
            <input type="number" 
                   class="input-weight" 
                   value="${set.weight || ''}" 
                   placeholder="0"
                   step="0.5"
                   ${isCompleted ? 'disabled' : ''}>
          </div>
        </div>

        <button class="btn-validate-set ${isCompleted ? 'validated' : ''}" 
                data-exercise-index="${exerciseIndex}" 
                data-set-index="${setIndex}"
                ${isCompleted ? 'disabled' : ''}>
          ${isCompleted ? '✓ Validé' : 'Valider'}
        </button>
      </div>
    `;
  }

  /**
   * Met à jour l'affichage d'une série après validation
   */
  updateSetDisplay(exerciseIndex, setIndex, setData) {
    const setRow = document.querySelector(
      `.set-row[data-exercise-index="${exerciseIndex}"][data-set-index="${setIndex}"]`
    );
    
    if (!setRow) {
      console.error('❌ Set row introuvable');
      return;
    }

    // Ajouter la classe "completed"
    setRow.classList.add('completed');

    // Désactiver les inputs
    const inputs = setRow.querySelectorAll('input');
    inputs.forEach(input => input.disabled = true);

    // Mettre à jour le bouton
    const validateBtn = setRow.querySelector('.btn-validate-set');
    if (validateBtn) {
      validateBtn.textContent = '✓ Validé';
      validateBtn.classList.add('validated');
      validateBtn.disabled = true;
    }

    console.log(`✅ Set ${setIndex + 1} mis à jour visuellement`);
  }

  /**
   * Ajoute une nouvelle série à un exercice
   */
  addSetToExercise(exerciseIndex) {
    const exerciseCard = document.querySelector(
      `.exercise-card[data-exercise-index="${exerciseIndex}"]`
    );
    
    if (!exerciseCard) {
      console.error('❌ Exercise card introuvable');
      return;
    }

    const setsContainer = exerciseCard.querySelector('.sets-container');
    const currentSetsCount = setsContainer.querySelectorAll('.set-row').length;
    
    const newSet = {
      reps: null,
      weight: null,
      completed: false
    };

    const newSetHTML = this.renderSet(newSet, exerciseIndex, currentSetsCount);
    setsContainer.insertAdjacentHTML('beforeend', newSetHTML);

    console.log(`✅ Nouvelle série ajoutée à l'exercice ${exerciseIndex}`);
  }

  /**
   * Vide le conteneur
   */
  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
