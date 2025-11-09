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
      console.log('🛠️ Rendu exercice :', ex.name);
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

    console.log(`📋 Génération séries pour ${exercise.name} :`, seriesArray);

    const grid = document.createElement('div');
    grid.className = 'series-container';

    seriesArray.forEach((serie, index) => {
      const serieItem = document.createElement('div');
      serieItem.className = 'serie-item';
      serieItem.dataset.exerciseId = exercise.id;

      const number = document.createElement('div');
      number.className = 'serie-number';
      number.textContent = index + 1;

      const info = document.createElement('div');
      info.className = 'serie-info';

      const repsSpan = document.createElement('div');
      repsSpan.className = 'serie-reps';
      repsSpan.textContent = `${serie.reps} reps`;

      const weightSpan = document.createElement('div');
      weightSpan.className = 'serie-weight';
      weightSpan.textContent = `${serie.weight}kg`;

      info.appendChild(repsSpan);
      info.appendChild(weightSpan);

      const restDiv = document.createElement('div');
      restDiv.className = 'serie-rest';

      const restIcon = document.createElement('span');
      restIcon.className = 'rest-icon';
      restIcon.textContent = '🕒';

      const restTime = document.createElement('span');
      restTime.className = 'rest-time';
      restTime.textContent = `${serie.rest}s`;

      restDiv.appendChild(restIcon);
      restDiv.appendChild(restTime);

      const button = document.createElement('button');
      button.className = 'serie-check';
      button.dataset.exerciseId = exercise.id;
      button.dataset.setNumber = index + 1;

      const icon = document.createElement('span');
      icon.className = 'check-icon';
      button.appendChild(icon);

      serieItem.appendChild(number);
      serieItem.appendChild(info);
      serieItem.appendChild(restDiv);
      serieItem.appendChild(button);
      grid.appendChild(serieItem);
    });

    container.appendChild(grid);
  }
}
