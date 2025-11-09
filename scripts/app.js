// ===============================
// APP.JS - Hybrid Master 61
// Gestion des timers classique et immersif
// ===============================

// ----------- UTILITAIRE FORMATAGE TEMPS -----------
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// ----------- TIMER CLASSIQUE WIDGET -----------
let classicInterval;
let classicRemaining = 0;

function startClassicTimer(duration) {
  const widget = document.getElementById("timer-widget");
  const timeDisplay = document.getElementById("timer-time");

  widget.setAttribute("aria-hidden", "false");
  widget.classList.add("active");

  classicRemaining = duration;
  timeDisplay.textContent = formatTime(classicRemaining);

  clearInterval(classicInterval);
  classicInterval = setInterval(() => {
    classicRemaining--;
    timeDisplay.textContent = formatTime(classicRemaining);
    if (classicRemaining <= 0) {
      clearInterval(classicInterval);
      widget.classList.remove("active");
      widget.setAttribute("aria-hidden", "true");
    }
  }, 1000);
}

// Boutons du widget classique
document.getElementById("timer-pause").addEventListener("click", () => {
  if (classicInterval) {
    clearInterval(classicInterval);
    classicInterval = null;
  } else if (classicRemaining > 0) {
    startClassicTimer(classicRemaining);
  }
});

document.getElementById("timer-reset").addEventListener("click", () => {
  clearInterval(classicInterval);
  startClassicTimer(120); // reset à 2 min par défaut
});

document.getElementById("timer-skip").addEventListener("click", () => {
  clearInterval(classicInterval);
  document.getElementById("timer-widget").classList.remove("active");
});

document.getElementById("timer-minus-15").addEventListener("click", () => {
  classicRemaining = Math.max(0, classicRemaining - 15);
  document.getElementById("timer-time").textContent = formatTime(classicRemaining);
});

document.getElementById("timer-plus-15").addEventListener("click", () => {
  classicRemaining += 15;
  document.getElementById("timer-time").textContent = formatTime(classicRemaining);
});

document.getElementById("timer-close").addEventListener("click", () => {
  clearInterval(classicInterval);
  document.getElementById("timer-widget").classList.remove("active");
});

// ----------- TIMER IMMERSIF YOUJORUS -----------
let youjorusInterval;
let youjorusRemaining = 0;

function showYoujorusTimer(duration, label) {
  const overlay = document.getElementById("youjorus-timer");
  const timeDisplay = document.getElementById("youjorus-time");
  const labelDisplay = document.getElementById("youjorus-label");

  overlay.setAttribute("aria-hidden", "false");
  overlay.style.display = "flex";
  labelDisplay.textContent = label;

  youjorusRemaining = duration;
  timeDisplay.textContent = formatTime(youjorusRemaining);

  clearInterval(youjorusInterval);
  youjorusInterval = setInterval(() => {
    youjorusRemaining--;
    timeDisplay.textContent = formatTime(youjorusRemaining);
    if (youjorusRemaining <= 0) {
      clearInterval(youjorusInterval);
      overlay.style.display = "none";
      overlay.setAttribute("aria-hidden", "true");
    }
  }, 1000);
}

// Boutons immersif
document.getElementById("youjorus-pause").addEventListener("click", () => {
  if (youjorusInterval) {
    clearInterval(youjorusInterval);
    youjorusInterval = null;
  } else if (youjorusRemaining > 0) {
    showYoujorusTimer(youjorusRemaining, document.getElementById("youjorus-label").textContent);
  }
});

document.getElementById("youjorus-skip").addEventListener("click", () => {
  clearInterval(youjorusInterval);
  document.getElementById("youjorus-timer").style.display = "none";
  document.getElementById("youjorus-timer").setAttribute("aria-hidden", "true");
});

// ----------- DECLENCHEMENT SUR ACTION UTILISATEUR -----------
// Exemple : déclenchement manuel via bouton ou logique de séries
// Aucun timer n'est lancé automatiquement au démarrage !

document.addEventListener("serieDone", (e) => {
  // e.detail.duration = durée du repos en secondes
  // e.detail.label = texte (ex: "REST")
  showYoujorusTimer(e.detail.duration || 120, e.detail.label || "REST");
});

// Exemple de test manuel (à supprimer en prod)
// document.getElementById("workout-container").addEventListener("click", () => {
//   showYoujorusTimer(240, "RUN");
// });
