/**
 * WORKOUT RENDERER - Affichage des séances avec supersets (style VALIDE)
 * Génère le HTML pour afficher les exercices avec leurs séries
 */

export default class WorkoutRenderer {
  constructor() {
    this.container = null;
    this.timerManager = null;
  }

  init() {
    this.container = document.getElementById('workout-container');
    if (!this.container) {
      console.error('❌ Container workout-container introuvable');
    }
  }

  render(workoutDay, week) {
    if (!this.container) return;

    if (!workoutDay || !workoutDay.exercises || workoutDay.exercises.length === 0) {
      this.container.innerHTML = `
        <div class="day">
          ${this.renderDayHeader(workoutDay?.name || 'Séance', week)}
          <div class="exercise-card">
            <div class="exercise-header"><h3>Repos</h3></div>
            <div class="exercise-body"><p>🏖️ Repos aujourd'hui !</p></div>
          </div>
        </div>`;
      return;
    }

    const blocks = this.groupSupersets(workoutDay.exercises);
    const exercisesHTML = blocks.map(block =>
      block.type === 'superset' ? this.renderSuperset(block.items) : this.renderExercise(block.items[0])
    ).join('');

    this.container.innerHTML = `
      <div class="day">
        ${this.renderDayHeader(workoutDay.name || 'Séance', week, workoutDay.muscles)}
        ${exercisesHTML}
      </div>`;
  }

  renderDayHeader(dayName, week, muscles = []) {
    const techniqueText = [
      week?.block ? `Bloc ${week.block}` : null,
      week?.technique ? `${week.technique}` : null,
      week?.isDeload ? 'Deload' : null
    ].filter(Boolean).join(' · ');

    const musclesText = muscles.length ? `<span class="badge technique">Muscles: ${muscles.join(', ')}</span>` : '';

    return `
      <div class="day-header">
        <h3>${dayName}</h3>
        <div class="badges">
          ${techniqueText ? `<span class="badge technique">${techniqueText}</span>` : ''}
          ${musclesText}
        </div>
      </div>`;
  }

  groupSupersets(exercises) {
    const result = [];
    let buffer = [];

    const isSupersetCandidate = ex => ex.superset || ex.setGroup;
    const arePairCandidates = (a, b) => a && b && a.category === b.category && a.rest === b.rest;

    for (let i = 0; i < exercises.length; i++) {
      const current = exercises[i];
      const next = exercises[i + 1];

      if (isSupersetCandidate(current)) {
        buffer.push(current);
        if (next && isSupersetCandidate(next)) continue;
        result.push({ type: 'superset', items: buffer.slice() });
        buffer = [];
        continue;
      }

      if (arePairCandidates(current, next)) {
        result.push({ type: 'superset', items: [current, next] });
        i++;
        continue;
      }

      result.push({ type: 'single', items: [current] });
    }

    if (buffer.length) result.push({ type: 'superset', items: buffer.slice() });
    return result;
  }

  renderSuperset(items) {
    const cards = items.map(ex => this.renderExercise(ex, { inline: true })).join('');
    const commonRest = items[0]?.rest ? `<div class="superset-rest">Repos: ${items[0].rest}s après le duo</div>` : '';
    return `<div class="superset"><div class="superset-label">Superset</div>${cards}${commonRest}</div>`;
  }

  renderExercise(exercise, options = {}) {
    const { id, name, type, category, muscles, sets, reps, weight, rpe, rest, tempo, notes, progression } = exercise;
    const icon = type === 'cardio' ? '🔥' : '💪';
    const typeClass = type === 'cardio' ? 'cardio' : 'strength';
    const musclesLabel = muscles?.length ? muscles.join(', ') : '';
    const setsLabel = Array.isArray(sets) ? `${sets.length}` : (typeof sets === 'number' ? sets : '-');

    const paramsHTML = this.renderParams({ sets, reps, weight, rpe, rest, tempo });
    const seriesHTML = this.renderSeries(exercise, id);
    const notesHTML = notes ? `<div class="exercise-notes"><div class="notes-title">📝 Notes</div><div class="notes-content">${notes}</div></div>` : '';
    const progressionHTML = progression ? this.renderProgression(progression) : '';

    const wrapperClasses = options.inline ? 'exercise-card inline' : 'exercise-card';

    return `
      <div class="${wrapperClasses}" data-exercise-id="${id}">
        <div class="exercise-header ${typeClass}">
          <span class="exercise-icon">${icon}</span>
          <div class="exercise-title">
            <h3 class="exercise-name">${name}</h3>
            <div class="exercise-details">
              ${category ? `<span>${category}</span>` : ''}
              ${musclesLabel ? `<span>🎯 ${musclesLabel}</span>` : ''}
            </div>
          </div>
          ${setsLabel !== '-' ? `<span class="sets-count">${setsLabel} séries</span>` : ''}
        </div>
        <div class="exercise-body">
          ${paramsHTML}
          ${seriesHTML}
          ${notesHTML}
          ${progressionHTML}
        </div>
      </div>`;
  }

  renderParams({ sets, reps, weight, rpe, rest, tempo }) {
    const params = [];
    if (sets) params.push({ label: 'Séries', value: Array.isArray(sets) ? sets.length : sets });
    if (reps) params.push({ label: 'Reps', value: reps });
    if (weight) params.push({ label: 'Poids', value: `${weight}kg` });
    if (tempo) params.push({ label: 'Tempo', value: tempo, className: 'tempo' });
    if (rpe) params.push({ label: 'RPE', value: rpe, className: 'rpe' });
    if (rest) params.push({ label: 'Repos', value: `${rest}s`, className: 'rest' });

    if (!params.length) return '';
    return `<div class="exercise-meta">${params.map(p => `<span class="meta-item ${p.className || ''}"><strong>${p.label}:</strong> ${p.value}</span>`).join('')}</div>`;
  }

  renderSeries(exercise, exerciseId) {
    const { sets, reps, weight, rest } = exercise;
    if (!sets || sets === 0) return '';

    let seriesArray = Array.isArray(sets)
      ? sets
      : typeof sets === 'number'
      ? Array.from({ length: sets }, () => ({ reps, weight, rest }))
      : [sets];

    const seriesHTML = seriesArray.map((set, index) => {
      const setNumber = index + 1;
      const weightText = set.weight ? `${set.weight}kg` : (weight ? `${weight}kg` : '');
      return `
        <div class="set pending" data-exercise-id="${exerciseId}" data-set-number="${setNumber}">
          <div><strong>S${setNumber}</strong></div>
          <div>${set.reps ?? reps} reps${weightText ? ` · ${weightText}` : ''}</div>
          ${set.rest ?? rest ? `<div class="set-rest">⏱️ ${set.rest ?? rest}s</div>` : ''}
          <button class="serie-check" data-exercise-id="${exerciseId}" data-set-number="${setNumber}">
            <span class="check-icon"></span>
          </button>
        </div>`;
    }).join('');

    return `<div class="sets-grid">${seriesHTML}</div>`;
  }

  renderProgression(progression) {
    const { from, to } = progression;
    if (from == null || to == null) return '';
    return `
      <div class="progression-card">
        <div class="progression-label"><span>☑️</span><span>Progression</span></div>
        <div class="progression-values">
          <span class="progression-from">${from}kg</span>
          <span class="progression-arrow">→</span>
          <span class="progression-to">${to}kg</span>
        </div>
      </div>`;
  }
}
