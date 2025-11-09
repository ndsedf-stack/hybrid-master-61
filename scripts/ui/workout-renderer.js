export default class WorkoutRenderer {
  constructor() {
    this.container = document.getElementById('workout-container');
    this.timerManager = null;
  }

  init() {
    this.container.innerHTML = '';
  }

  render(workout, week) {
    this.container.innerHTML = '';

    const header = document.createElement('h2');
    header.textContent = `${workout.name} - BLOCK ${week.block} - ${week.technique}`;
    this.container.appendChild(header);

    workout.exercises.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'exercise-card';

      const title = document.createElement('h3');
      title.textContent = ex.name;
      card.appendChild(title);

      const meta = document.createElement('div');
      meta.className = 'meta';

      const metaItems = [
        `Séries: ${ex.sets}`,
        `Reps: ${ex.reps}`,
        `Poids: ${ex.weight}kg`,
        `Tempo: ${ex.tempo}`,
        `RPE: ${ex.rpe}`
      ];

      metaItems.forEach(text => {
        const span = document.createElement('span');
        span.className = 'meta-item';
        span.textContent = text;
        meta.appendChild(span);
      });

      card.appendChild(meta);
      this.renderSeries(ex, card);
      this.container.appendChild(card);
    });
  }

  renderSeries(exercise, container) {
    const sets = exercise.sets;
    const reps = exercise.reps;
    const weight = exercise.weight;
    const rest = exercise.rest;

    const seriesArray = typeof sets === 'number'
      ? Array.from({ length: sets }, () => ({ reps, weight, rest }))
      : Array.isArray(sets)
      ? sets
      : [sets];

    const grid = document.createElement('div');
    grid.className = 'sets-grid';

    seriesArray.forEach((serie, index) => {
      const setDiv = document.createElement('div');
      setDiv.className = 'set pending';
      setDiv.dataset.exerciseId = exercise.id;

      const label = document.createElement('span');
      label.className = 'set-label';
      label.textContent = `Série ${index + 1}`;

      const info = document.createElement('span');
      info.className = 'set-info';
      info.textContent = `${serie.reps} reps • ${serie.weight}kg`;

      const button = document.createElement('button');
      button.className = 'serie-check';
      button.className = 'serie-check';
      button.dataset.exerciseId = exercise.id;
      button.dataset.setNumber = index + 1;

      const icon = document.createElement('span');
      icon.className = 'check-icon';
      button.appendChild(icon);

      setDiv.appendChild(label);
      setDiv.appendChild(info);
      setDiv.appendChild(button);
      grid.appendChild(setDiv);
    });

    container.appendChild(grid);
  }
}
