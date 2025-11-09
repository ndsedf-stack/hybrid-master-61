// ===============================
// APP.JS - Hybrid Master 61
// Gestion du timer classique uniquement
// ===============================

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

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
  startClassicTimer(120); // reset à 2 min
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
