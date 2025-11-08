/**
 * HYBRID MASTER 51 - APPLICATION COMPLÈTE AVEC PROGRAMME RÉEL
 * Version finale avec program-data.js intégré
 */

// ============================================================================
// TIMER MANAGER
// ============================================================================
class TimerManager {
    constructor() {
        this.seconds = 0;
        this.isRunning = false;
        this.isFinished = false;
        this.interval = null;
        this.targetSeconds = null;
        this.onTick = null;
        this.onComplete = null;
        this.display = null;
        this.startBtn = null;
        this.pauseBtn = null;
        this.resetBtn = null;
    }

    init() {
        this.display = document.getElementById('timer-display');
        this.startBtn = document.getElementById('timer-start');
        this.pauseBtn = document.getElementById('timer-pause');
        this.resetBtn = document.getElementById('timer-reset');

        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.start());
        }
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.pause());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.reset());
        }

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.toggle();
            }
        });

        this.updateDisplay();
        this.updateButtons();
        console.log('✅ TimerManager initialisé');
    }

    start(targetSeconds = null) {
        if (this.isRunning) return;
        this.isRunning = true;
        this.isFinished = false;
        this.targetSeconds = targetSeconds;
        
        if (this.display) {
            this.display.classList.remove('finished');
        }

        this.interval = setInterval(() => {
            this.seconds++;
            this.updateDisplay();
            if (this.onTick) this.onTick(this.seconds);
            if (this.targetSeconds && this.seconds >= this.targetSeconds) {
                this.complete();
            }
        }, 1000);

        this.updateButtons();
        this.updateDisplay();
    }

    pause() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.updateButtons();
        this.updateDisplay();
    }

    toggle() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    }

    reset() {
        this.pause();
        this.seconds = 0;
        this.targetSeconds = null;
        this.isFinished = false;
        if (this.display) {
            this.display.classList.remove('finished');
        }
        this.updateDisplay();
        this.updateButtons();
    }

    complete() {
        this.pause();
        this.isFinished = true;
        if (this.display) {
            this.display.classList.add('finished');
        }
        this.playSound();
        this.showVisualNotification();
        if (this.onComplete) this.onComplete(this.seconds);
        this.updateDisplay();
    }

    showVisualNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            color: white; padding: 30px 50px; border-radius: 15px;
            font-size: 2rem; font-weight: bold; z-index: 10000;
            box-shadow: 0 10px 40px rgba(220, 53, 69, 0.6);
            animation: alert-bounce 0.5s ease-out;
        `;
        notification.textContent = '⏱️ Timer terminé !';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes alert-bounce {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transition = 'opacity 0.5s ease-out';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) document.body.removeChild(notification);
                if (style.parentNode) document.head.removeChild(style);
            }, 500);
        }, 3000);
    }

    playSound() {
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvPaiTcIG2m98OScTgwOUKru97RgGgU7k9n0x3QoBS1+zPLaizsJHGu+8eadUQ0PWKvm9LFeFQU=');
            audio.play().catch(() => {});
        } catch (e) {
            console.log('Son non disponible');
        }
    }

    formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        if (this.display) {
            this.display.textContent = this.formatTime(this.seconds);
            this.display.classList.toggle('running', this.isRunning);
            this.display.classList.toggle('paused', !this.isRunning && this.seconds > 0 && !this.isFinished);
            this.display.classList.toggle('finished', this.isFinished);
        }
    }

    updateButtons() {
        if (this.startBtn) {
            this.startBtn.style.display = this.isRunning ? 'none' : 'inline-flex';
        }
        if (this.pauseBtn) {
            this.pauseBtn.style.display = this.isRunning ? 'inline-flex' : 'none';
        }
    }
}

// ============================================================================
// PROGRAMME DATA - INTÉGRÉ DANS APP.JS
// ============================================================================
function calculateWeight(baseWeight, week, increment, frequency) {
    const progressions = Math.floor((week - 1) / frequency);
    const newWeight = baseWeight + (progressions * increment);
    const isDeload = [6, 12, 18, 24, 26].includes(week);
    return isDeload ? Math.round(newWeight * 0.6 * 2) / 2 : newWeight;
}

function getBlockTechnique(week) {
    if (week <= 5) return { block: 1, technique: "Tempo 3-1-2", rpe: "6-7" };
    if (week === 6) return { block: 1, technique: "Deload", rpe: "5-6" };
    if (week <= 11) return { block: 2, technique: "Rest-Pause", rpe: "7-8" };
    if (week === 12) return { block: 2, technique: "Deload", rpe: "5-6" };
    if (week <= 17) return { block: 3, technique: "Drop-sets + Myo-reps", rpe: "8" };
    if (week === 18) return { block: 3, technique: "Deload", rpe: "5-6" };
    if (week <= 23) return { block: 4, technique: "Clusters + Myo-reps + Partials", rpe: "8-9" };
    if (week === 24) return { block: 4, technique: "Deload", rpe: "5-6" };
    if (week === 25) return { block: 5, technique: "Peak Week", rpe: "8-9" };
    return { block: 5, technique: "Deload Final", rpe: "5-6" };
}

function getBicepExercise(week) {
    const block = getBlockTechnique(week).block;
    return (block === 1 || block === 3) ? "Incline Curl" : "Spider Curl";
}

class ProgramGenerator {
    generateWeek(week) {
        const blockInfo = getBlockTechnique(week);
        const isDeload = [6, 12, 18, 24, 26].includes(week);
        
        return {
            weekNumber: week,
            block: blockInfo.block,
            technique: blockInfo.technique,
            rpeTarget: blockInfo.rpe,
            isDeload: isDeload,
            dimanche: this.generateDimanche(week, blockInfo, isDeload),
            mardi: this.generateMardi(week, blockInfo, isDeload),
            vendredi: this.generateVendredi(week, blockInfo, isDeload),
            maison: this.generateMaison(week, blockInfo, isDeload)
        };
    }

    generateDimanche(week, blockInfo, isDeload) {
        const bicepExercise = getBicepExercise(week);
        return {
            name: "DOS + JAMBES LOURDES + BRAS",
            duration: 68,
            totalSets: 31,
            exercises: [
                {
                    id: `w${week}_dim_trapbar`,
                    name: "Trap Bar Deadlift",
                    category: "compound",
                    muscle: ["dos", "jambes", "fessiers"],
                    sets: 5,
                    reps: "6-8",
                    weight: calculateWeight(75, week, 5, 3),
                    rest: 120,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: blockInfo.block === 2 && !isDeload ? "🔥 Rest-Pause série 5 : 6-8 reps → 20s → 2-3 reps" : 
                           blockInfo.block === 4 && !isDeload ? "🔥 Clusters série 5 : 3 reps → 20s → 2 reps → 20s → 2 reps" : 
                           "Exercice roi, technique parfaite obligatoire"
                },
                {
                    id: `w${week}_dim_goblet`,
                    name: "Goblet Squat",
                    category: "compound",
                    muscle: ["quadriceps", "fessiers"],
                    sets: 4,
                    reps: 10,
                    weight: calculateWeight(25, week, 2.5, 2),
                    rest: 75,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: blockInfo.block === 3 && !isDeload ? "🔥 Drop-set série 4 : 10 reps → -25% → 8-10 reps" :
                           blockInfo.block === 4 && !isDeload ? "🔥 Série 4 : 10 reps complètes → 5 demi-reps (partials)" :
                           "Haltère devant poitrine, descente contrôlée"
                },
                {
                    id: `w${week}_dim_legpress`,
                    name: "Leg Press",
                    category: "compound",
                    muscle: ["quadriceps", "fessiers"],
                    sets: 4,
                    reps: 10,
                    weight: calculateWeight(110, week, 10, 2),
                    rest: 75,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: blockInfo.block === 3 && !isDeload ? "🔥 Drop-set série 4 : 10 reps → -25% → 10-12 reps" :
                           blockInfo.block === 4 && !isDeload ? "🔥 Clusters série 4 + Partials : 4→20s→3→20s→3 puis 10 reps + 8 quarts" :
                           "Pieds largeur épaules, amplitude complète"
                },
                {
                    id: `w${week}_dim_latpull`,
                    name: "Lat Pulldown (prise large)",
                    category: "compound",
                    muscle: ["dos"],
                    sets: 4,
                    reps: 10,
                    weight: calculateWeight(60, week, 2.5, 2),
                    rest: 90,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    isSuperset: true,
                    supersetWith: "Landmine Press",
                    notes: blockInfo.block === 3 && !isDeload ? "🔥 Drop-set série 4 : 10 reps → -20% → 8-10 reps | ⚡ SUPERSET" :
                           "⚡ SUPERSET avec Landmine Press | Prise 1.5× largeur épaules"
                },
                {
                    id: `w${week}_dim_landmine`,
                    name: "Landmine Press",
                    category: "compound",
                    muscle: ["pectoraux", "épaules"],
                    sets: 4,
                    reps: 10,
                    weight: calculateWeight(35, week, 2.5, 2),
                    rest: 90,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    isSuperset: true,
                    supersetWith: "Lat Pulldown",
                    notes: "⚡ SUPERSET avec Lat Pulldown | Barre calée dans coin"
                },
                {
                    id: `w${week}_dim_rowing`,
                    name: "Rowing Machine (prise large)",
                    category: "compound",
                    muscle: ["dos"],
                    sets: 4,
                    reps: 10,
                    weight: calculateWeight(50, week, 2.5, 2),
                    rest: 75,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: blockInfo.block === 3 && !isDeload ? "🔥 Myo-reps série 4 : 10 reps → 5s → 4 mini-sets de 4 reps" :
                           blockInfo.block === 4 && !isDeload ? "🔥 Myo-reps série 4 : 10 reps → 5s → 4 mini-sets de 4 reps" :
                           "Mains écartées, coudes vers extérieur, tirer vers bas des pecs"
                },
                {
                    id: `w${week}_dim_bicep`,
                    name: bicepExercise,
                    category: "isolation",
                    muscle: ["biceps"],
                    sets: 4,
                    reps: 12,
                    weight: calculateWeight(12, week, 2.5, 3),
                    rest: 75,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    isSuperset: true,
                    supersetWith: "Cable Pushdown",
                    notes: blockInfo.block === 1 && !isDeload ? "⚡ SUPERSET | Pause 2s bras tendus (étirement maximal)" :
                           blockInfo.block === 3 && !isDeload ? "⚡ SUPERSET | 🔥 Myo-reps série 4 : 12 reps → 5s → 4 mini-sets" :
                           blockInfo.block === 4 && !isDeload ? "⚡ SUPERSET | 🔥 Myo-reps série 4 : 12 reps → 5s → 4 mini-sets" :
                           `⚡ SUPERSET | ${bicepExercise === "Incline Curl" ? "Banc incliné 45°" : "Spider curl pupitre"}`
                },
                {
                    id: `w${week}_dim_pushdown`,
                    name: "Cable Pushdown",
                    category: "isolation",
                    muscle: ["triceps"],
                    sets: 3,
                    reps: 12,
                    weight: calculateWeight(20, week, 2.5, 3),
                    rest: 75,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    isSuperset: true,
                    supersetWith: bicepExercise,
                    notes: blockInfo.block === 4 && !isDeload ? "⚡ SUPERSET | 🔥 Myo-reps série 3 : 12 reps → 5s → 4 mini-sets" :
                           "⚡ SUPERSET | Coudes fixes le long du corps"
                }
            ]
        };
    }

    generateMardi(week, blockInfo, isDeload) {
        return {
            name: "PECS + ÉPAULES + TRICEPS",
            duration: 70,
            totalSets: 35,
            exercises: [
                {
                    id: `w${week}_mar_dbpress`,
                    name: "Dumbbell Press",
                    category: "compound",
                    muscle: ["pectoraux", "épaules", "triceps"],
                    sets: 5,
                    reps: 10,
                    weight: calculateWeight(22, week, 2.5, 3),
                    rest: 105,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: blockInfo.block === 2 && !isDeload ? "🔥 Rest-Pause série 5 : 10 reps → 20s → 3-4 reps" :
                           blockInfo.block === 3 && !isDeload ? "🔥 Drop-set série 5 : 10 reps → -25% → 8-10 reps" :
                           blockInfo.block === 4 && !isDeload ? "🔥 Clusters série 5 : 4 reps → 15s → 3 reps → 15s → 3 reps" :
                           "Banc plat, haltères rotation naturelle"
                },
                {
                    id: `w${week}_mar_cablefly`,
                    name: "Cable Fly (poulies moyennes)",
                    category: "isolation",
                    muscle: ["pectoraux"],
                    sets: 4,
                    reps: 12,
                    weight: calculateWeight(10, week, 2.5, 3),
                    rest: 60,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: blockInfo.block === 1 && !isDeload ? "Pause 2s bras écartés (étirement maximal pecs)" :
                           blockInfo.block === 3 && !isDeload ? "🔥 Drop-set série 4 : 12 reps → -25% → 10-12 reps | 🔥 Myo-reps : 12→5s→5 mini-sets" :
                           blockInfo.block === 4 && !isDeload ? "🔥 Myo-reps série 4 : 12 reps → 5s → 5 mini-sets de 5 reps" :
                           "Poulies hauteur épaules, bras semi-fléchis"
                },
                {
                    id: `w${week}_mar_leglight`,
                    name: "Leg Press léger",
                    category: "compound",
                    muscle: ["quadriceps", "fessiers"],
                    sets: 3,
                    reps: 15,
                    weight: calculateWeight(80, week, 10, 3),
                    rest: 60,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: "Activation légère jambes, pas de fatigue excessive"
                },
                {
                    id: `w${week}_mar_triceps`,
                    name: "Extension Triceps Corde",
                    category: "isolation",
                    muscle: ["triceps"],
                    sets: 5,
                    reps: 12,
                    weight: calculateWeight(20, week, 2.5, 3),
                    rest: 75,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    isSuperset: true,
                    supersetWith: "Lateral Raises",
                    notes: blockInfo.block === 3 && !isDeload ? "⚡ SUPERSET | 🔥 Drop-set série 5 : 12 reps → -20% → 10-12 reps" :
                           blockInfo.block === 4 && !isDeload ? "⚡ SUPERSET | 🔥 Myo-reps série 5 : 12 reps → 5s → 4 mini-sets" :
                           "⚡ SUPERSET | Corde poulie haute, coudes fixes"
                },
                {
                    id: `w${week}_mar_lateral`,
                    name: "Lateral Raises",
                    category: "isolation",
                    muscle: ["épaules"],
                    sets: 5,
                    reps: 15,
                    weight: calculateWeight(8, week, 2.5, 4),
                    rest: 75,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    isSuperset: true,
                    supersetWith: "Extension Triceps Corde",
                    notes: blockInfo.block === 1 && !isDeload ? "⚡ SUPERSET | Pause 1s bras horizontaux" :
                           blockInfo.block === 3 && !isDeload ? "⚡ SUPERSET | 🔥 Drop-set série 5 : 15 reps → -25% → 12-15 reps" :
                           blockInfo.block === 4 && !isDeload ? "⚡ SUPERSET | 🔥 Myo-reps série 5 : 15 reps → 5s → 5 mini-sets" :
                           "⚡ SUPERSET | Coudes légèrement fléchis, monter à l'horizontal"
                },
                {
                    id: `w${week}_mar_facepull`,
                    name: "Face Pull",
                    category: "isolation",
                    muscle: ["épaules", "dos"],
                    sets: 5,
                    reps: 15,
                    weight: calculateWeight(20, week, 2.5, 3),
                    rest: 60,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: blockInfo.block === 1 && !isDeload ? "Pause 1s contraction arrière" :
                           blockInfo.block === 3 && !isDeload ? "🔥 Myo-reps série 5 : 15 reps → 5s → 5 mini-sets de 5 reps" :
                           blockInfo.block === 4 && !isDeload ? "🔥 Myo-reps série 5 : 15 reps → 5s → 5 mini-sets de 5 reps" :
                           "Corde poulie haute, tirer vers visage, rotation externe"
                },
                {
                    id: `w${week}_mar_rowingtight`,
                    name: "Rowing Machine (prise serrée)",
                    category: "compound",
                    muscle: ["dos"],
                    sets: 4,
                    reps: 12,
                    weight: calculateWeight(50, week, 2.5, 2),
                    rest: 75,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: "Mains largeur épaules, coudes le long du corps, tirer vers nombril"
                },
                {
                    id: `w${week}_mar_overhead`,
                    name: "Overhead Extension (corde, assis)",
                    category: "isolation",
                    muscle: ["triceps"],
                    sets: 4,
                    reps: 12,
                    weight: calculateWeight(15, week, 2.5, 3),
                    rest: 60,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: blockInfo.block === 3 && !isDeload ? "🔥 Myo-reps série 4 : 12 reps → 5s → 4 mini-sets de 4 reps" :
                           blockInfo.block === 4 && !isDeload ? "🔥 Myo-reps série 4 : 12 reps → 5s → 4 mini-sets de 4 reps" :
                           "Corde poulie haute, assis, étirement triceps maximal"
                }
            ]
        };
    }

    generateVendredi(week, blockInfo, isDeload) {
        return {
            name: "DOS + JAMBES LÉGÈRES + BRAS + ÉPAULES",
            duration: 73,
            totalSets: 33,
            exercises: [
                {
                    id: `w${week}_ven_landrow`,
                    name: "Landmine Row",
                    category: "compound",
                    muscle: ["dos"],
                    sets: 5,
                    reps: 10,
                    weight: calculateWeight(55, week, 2.5, 2),
                    rest: 105,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: blockInfo.block === 2 && !isDeload ? "🔥 Rest-Pause série 5 : 10 reps → 20s → 3-4 reps" :
                           blockInfo.block === 3 && !isDeload ? "🔥 Drop-set série 5 : 10 reps → -20% → 8-10 reps" :
                           blockInfo.block === 4 && !isDeload ? "🔥 Clusters série 5 : 4 reps → 15s → 3 reps → 15s → 3 reps" :
                           "Barre calée, une main, tirer vers hanche"
                },
                {
                    id: `w${week}_ven_legcurl`,
                    name: "Leg Curl",
                    category: "isolation",
                    muscle: ["ischios"],
                    sets: 5,
                    reps: 12,
                    weight: calculateWeight(40, week, 5, 3),
                    rest: 75,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    isSuperset: true,
                    supersetWith: "Leg Extension",
                    notes: blockInfo.block === 3 && !isDeload ? "⚡ SUPERSET | 🔥 Drop-set série 5 : 12 reps → -25% → 10-12 reps" :
                           blockInfo.block === 4 && !isDeload ? "⚡ SUPERSET | 🔥 Série 5 : 12 reps complètes → 6-8 partials (amplitude haute)" :
                           "⚡ SUPERSET | Allongé ou assis selon machine"
                },
                {
                    id: `w${week}_ven_legext`,
                    name: "Leg Extension",
                    category: "isolation",
                    muscle: ["quadriceps"],
                    sets: 4,
                    reps: 15,
                    weight: calculateWeight(35, week, 5, 3),
                    rest: 75,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    isSuperset: true,
                    supersetWith: "Leg Curl",
                    notes: blockInfo.block === 3 && !isDeload ? "⚡ SUPERSET | 🔥 Drop-set série 4 : 15 reps → -25% → 12-15 reps" :
                           blockInfo.block === 4 && !isDeload ? "⚡ SUPERSET | 🔥 Série 4 : 15 reps complètes → 10 partials (derniers 30°)" :
                           "⚡ SUPERSET | Extension complète, contraction 1s en haut"
                },
                {
                    id: `w${week}_ven_cablefly`,
                    name: "Cable Fly",
                    category: "isolation",
                    muscle: ["pectoraux"],
                    sets: 4,
                    reps: 15,
                    weight: calculateWeight(10, week, 2.5, 3),
                    rest: 60,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    isSuperset: true,
                    supersetWith: "Dumbbell Fly",
                    notes: blockInfo.block === 3 && !isDeload ? "⚡ SUPERSET | 🔥 Myo-reps série 4 : 15 reps → 5s → 5 mini-sets" :
                           blockInfo.block === 4 && !isDeload ? "⚡ SUPERSET | 🔥 Myo-reps série 4 : 15 reps → 5s → 5 mini-sets" :
                           "⚡ SUPERSET | Poulies moyennes, étirement maximal"
                },
                {
                    id: `w${week}_ven_dbfly`,
                    name: "Dumbbell Fly",
                    category: "isolation",
                    muscle: ["pectoraux"],
                    sets: 4,
                    reps: 12,
                    weight: calculateWeight(10, week, 2.5, 3),
                    rest: 60,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    isSuperset: true,
                    supersetWith: "Cable Fly",
                    notes: blockInfo.block === 1 && !isDeload ? "⚡ SUPERSET | Pause 2s bras écartés (étirement pecs)" :
                           blockInfo.block === 3 && !isDeload ? "⚡ SUPERSET | 🔥 Drop-set série 4 : 12 reps → -25% → 10-12 reps" :
                           blockInfo.block === 4 && !isDeload ? "⚡ SUPERSET | 🔥 Myo-reps série 4 : 12 reps → 5s → 4 mini-sets" :
                           "⚡ SUPERSET | Banc plat, amplitude complète"
                },
                {
                    id: `w${week}_ven_ezbarcurl`,
                    name: "EZ Bar Curl",
                    category: "isolation",
                    muscle: ["biceps"],
                    sets: 5,
                    reps: 12,
                    weight: calculateWeight(25, week, 2.5, 3),
                    rest: 75,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    isSuperset: true,
                    supersetWith: "Overhead Extension",
                    notes: blockInfo.block === 1 && !isDeload ? "⚡ SUPERSET | Pause 2s bras tendus (étirement biceps)" :
                           blockInfo.block === 3 && !isDeload ? "⚡ SUPERSET | 🔥 Myo-reps série 5 : 12 reps → 5s → 4 mini-sets" :
                           blockInfo.block === 4 && !isDeload ? "⚡ SUPERSET | 🔥 Myo-reps série 5 : 12 reps → 5s → 4 mini-sets" :
                           "⚡ SUPERSET | Barre EZ, coudes fixes"
                },
                {
                    id: `w${week}_ven_overhead2`,
                    name: "Overhead Extension",
                    category: "isolation",
                    muscle: ["triceps"],
                    sets: 3,
                    reps: 12,
                    weight: calculateWeight(15, week, 2.5, 3),
                    rest: 75,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    isSuperset: true,
                    supersetWith: "EZ Bar Curl",
                    notes: blockInfo.block === 4 && !isDeload ? "⚡ SUPERSET | 🔥 Myo-reps série 3 : 12 reps → 5s → 4 mini-sets" :
                           "⚡ SUPERSET | Corde poulie haute, assis, étirement maximal"
                },
                {
                    id: `w${week}_ven_lateral2`,
                    name: "Lateral Raises",
                    category: "isolation",
                    muscle: ["épaules"],
                    sets: 3,
                    reps: 15,
                    weight: calculateWeight(8, week, 2.5, 4),
                    rest: 60,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: blockInfo.block === 4 && !isDeload ? "🔥 Myo-reps série 3 : 15 reps → 5s → 5 mini-sets" :
                           "Coudes légèrement fléchis, monter à l'horizontal"
                },
                {
                    id: `w${week}_ven_wrist`,
                    name: "Wrist Curl",
                    category: "isolation",
                    muscle: ["avant-bras"],
                    sets: 3,
                    reps: 20,
                    weight: calculateWeight(30, week, 2.5, 4),
                    rest: 45,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: "Assis, avant-bras sur cuisses, flexion poignets"
                }
            ]
        };
    }

    generateMaison(week, blockInfo, isDeload) {
        return {
            name: "HAMMER CURL MAISON",
            duration: 5,
            totalSets: 3,
            daysPerWeek: ["Mardi soir", "Jeudi soir"],
            exercises: [
                {
                    id: `w${week}_maison_hammer`,
                    name: "Hammer Curl",
                    category: "isolation",
                    muscle: ["biceps", "avant-bras"],
                    sets: 3,
                    reps: 12,
                    weight: calculateWeight(12, week, 2.5, 3),
                    rest: 60,
                    tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
                    notes: "À faire à la maison, Mardi ET Jeudi soir, prise marteau (neutre)"
                }
            ]
        };
    }
}

// ============================================================================
// APPLICATION PRINCIPALE
// ============================================================================
class App {
    constructor() {
        this.currentWeek = 1;
        this.maxWeeks = 26;
        this.currentDay = 'dimanche'; // dimanche, mardi, vendredi
        this.completedSets = new Map();
        this.programGenerator = new ProgramGenerator();
        this.timerManager = null;
        this.defaultRestTime = 90;
    }

    async init() {
        console.log('🚀 Démarrage Hybrid Master 51...');

        try {
            this.timerManager = new TimerManager();
            this.timerManager.init();
            console.log('✅ TimerManager initialisé');

            this.attachEventListeners();
            console.log('✅ Événements attachés');

            this.updateWeekDisplay();
            this.renderCurrentWorkout();
            console.log('✅ Application prête !');

        } catch (error) {
            console.error('❌ Erreur:', error);
            this.showError('Erreur de chargement: ' + error.message);
        }
    }

    attachEventListeners() {
        const prevBtn = document.getElementById('prev-week');
        const nextBtn = document.getElementById('next-week');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.changeWeek(-1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.changeWeek(1);
            });
        }

        const settingsBtn = document.querySelector('.btn-icon.btn-secondary');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openTimerSettings();
            });
        }

        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavClick(index);
            });
        });

        document.addEventListener('click', (e) => {
            const checkButton = e.target.closest('.serie-check');
            if (!checkButton) return;
            e.preventDefault();
            e.stopPropagation();
            this.handleSetCompletion(checkButton);
        });

        console.log('✅ Event listeners attachés');
    }

    openTimerSettings() {
        const modal = document.createElement('div');
        modal.className = 'timer-settings-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>⚙️ Paramètres du Timer</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="settings-group">
                        <label for="rest-time">Temps de repos par défaut</label>
                        <div class="time-picker">
                            <button class="time-btn" data-action="decrease">−</button>
                            <div class="time-display">
                                <input type="number" 
                                       id="rest-time" 
                                       value="${this.defaultRestTime}" 
                                       min="15" 
                                       max="300" 
                                       step="15">
                                <span>secondes</span>
                            </div>
                            <button class="time-btn" data-action="increase">+</button>
                        </div>
                        <div class="time-presets">
                            <button class="preset-btn" data-time="30">30s</button>
                            <button class="preset-btn" data-time="45">45s</button>
                            <button class="preset-btn" data-time="60">60s</button>
                            <button class="preset-btn" data-time="90">90s</button>
                            <button class="preset-btn" data-time="120">2min</button>
                            <button class="preset-btn" data-time="180">3min</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-cancel">Annuler</button>
                    <button class="btn-primary modal-save">Enregistrer</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.textContent = `
            .timer-settings-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; }
            .modal-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); }
            .modal-content { position: relative; background: #1a1f2e; border-radius: 16px; width: 90%; max-width: 400px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); animation: modalSlideIn 0.3s ease-out; }
            @keyframes modalSlideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .modal-header { padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; }
            .modal-header h2 { margin: 0; font-size: 1.5rem; color: #ffffff; }
            .modal-close { background: none; border: none; font-size: 2rem; color: #9ca3af; cursor: pointer; line-height: 1; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; transition: all 0.2s; }
            .modal-close:hover { background: rgba(255,255,255,0.1); color: #ffffff; }
            .modal-body { padding: 24px; }
            .settings-group { display: flex; flex-direction: column; gap: 16px; }
            .settings-group label { font-size: 0.9rem; color: #9ca3af; font-weight: 500; }
            .time-picker { display: flex; align-items: center; gap: 16px; justify-content: center; }
            .time-btn { width: 48px; height: 48px; border-radius: 12px; background: #ff6b35; border: none; color: white; font-size: 1.5rem; font-weight: bold; cursor: pointer; transition: all 0.2s; }
            .time-btn:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(255,107,53,0.4); }
            .time-btn:active { transform: scale(0.95); }
            .time-display { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); padding: 12px 20px; border-radius: 12px; }
            .time-display input { width: 80px; font-size: 1.8rem; font-weight: bold; background: none; border: none; color: #ffffff; text-align: center; }
            .time-display span { color: #9ca3af; font-size: 0.9rem; }
            .time-presets { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
            .preset-btn { padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #ffffff; cursor: pointer; transition: all 0.2s; font-weight: 500; }
            .preset-btn:hover { background: rgba(255,107,53,0.2); border-color: #ff6b35; }
            .modal-footer { padding: 24px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 12px; justify-content: flex-end; }
            .modal-footer button { padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; transition: all 0.2s; }
            .btn-secondary { background: rgba(255,255,255,0.1); color: #ffffff; }
            .btn-secondary:hover { background: rgba(255,255,255,0.15); }
            .btn-primary { background: #ff6b35; color: white; }
            .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,107,53,0.4); }
        `;
        document.head.appendChild(style);

        const restTimeInput = modal.querySelector('#rest-time');
        const decreaseBtn = modal.querySelector('[data-action="decrease"]');
        const increaseBtn = modal.querySelector('[data-action="increase"]');
        const presetBtns = modal.querySelectorAll('.preset-btn');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const saveBtn = modal.querySelector('.modal-save');
        const overlay = modal.querySelector('.modal-overlay');

        decreaseBtn.addEventListener('click', () => {
            const current = parseInt(restTimeInput.value);
            restTimeInput.value = Math.max(15, current - 15);
        });

        increaseBtn.addEventListener('click', () => {
            const current = parseInt(restTimeInput.value);
            restTimeInput.value = Math.min(300, current + 15);
        });

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                restTimeInput.value = btn.dataset.time;
            });
        });

        const closeModal = () => {
            modal.remove();
            style.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        saveBtn.addEventListener('click', () => {
            this.defaultRestTime = parseInt(restTimeInput.value);
            this.showSuccess(`Temps de repos défini à ${this.defaultRestTime}s`);
            closeModal();
            console.log(`⚙️ Temps de repos: ${this.defaultRestTime}s`);
        });
    }

    handleSetCompletion(checkButton) {
        const exerciseId = checkButton.dataset.exerciseId;
        const setNumber = parseInt(checkButton.dataset.setNumber);
        const serieItem = checkButton.closest('.serie-item');
        
        if (!serieItem) {
            console.error('❌ Serie item introuvable');
            return;
        }

        const isCompleted = serieItem.classList.toggle('completed');
        
        const checkIcon = checkButton.querySelector('.check-icon');
        if (checkIcon) {
            checkIcon.textContent = isCompleted ? '✓' : '';
        }

        if (!this.completedSets.has(exerciseId)) {
            this.completedSets.set(exerciseId, new Set());
        }

        const sets = this.completedSets.get(exerciseId);
        if (isCompleted) {
            sets.add(setNumber);
        } else {
            sets.delete(setNumber);
        }

        console.log(`${isCompleted ? '✅' : '❌'} Série ${setNumber} de ${exerciseId}`);

        if (isCompleted) {
            const restParam = serieItem.querySelector('.serie-rest .rest-time');
            let restSeconds = this.defaultRestTime;
            
            if (restParam) {
                const text = restParam.textContent;
                const match = text.match(/(\d+)/);
                if (match) {
                    restSeconds = parseInt(match[1]);
                }
            }

            const timerSection = document.querySelector('.timer-section');
            if (timerSection) {
                timerSection.style.display = 'block';
            }

            this.timerManager.reset();
            this.timerManager.start(restSeconds);
        }
    }

    changeWeek(direction) {
        const newWeek = this.currentWeek + direction;

        if (newWeek < 1 || newWeek > this.maxWeeks) {
            console.log('⚠️ Limite atteinte');
            return;
        }

        this.currentWeek = newWeek;
        console.log(`📅 Semaine ${this.currentWeek}`);
        
        this.updateWeekDisplay();
        this.renderCurrentWorkout();
    }

    updateWeekDisplay() {
        const weekDisplay = document.getElementById('week-display');
        if (!weekDisplay) return;

        const blockInfo = getBlockTechnique(this.currentWeek);
        const isDeload = [6, 12, 18, 24, 26].includes(this.currentWeek);

        weekDisplay.innerHTML = `
            <div class="week-current">Semaine ${this.currentWeek}/${this.maxWeeks}</div>
            <div class="week-date">
                Bloc ${blockInfo.block} • ${blockInfo.technique} 
                ${isDeload ? '🔵 DELOAD' : ''}
            </div>
        `;

        const prevBtn = document.getElementById('prev-week');
        const nextBtn = document.getElementById('next-week');

        if (prevBtn) prevBtn.disabled = this.currentWeek === 1;
        if (nextBtn) nextBtn.disabled = this.currentWeek === this.maxWeeks;
    }

    renderCurrentWorkout() {
        const container = document.getElementById('workout-container');
        if (!container) return;

        const weekData = this.programGenerator.generateWeek(this.currentWeek);
        const workout = weekData[this.currentDay];

        if (!workout || !workout.exercises || workout.exercises.length === 0) {
            container.innerHTML = '<div class="empty-workout"><p>🏖️ Jour de repos</p></div>';
            return;
        }

        // Boutons de sélection de jour
        const daySelector = `
            <div class="day-selector" style="display: flex; gap: 8px; margin-bottom: 20px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px;">
                <button class="day-btn ${this.currentDay === 'dimanche' ? 'active' : ''}" data-day="dimanche">
                    💪 Dimanche<br><small>${weekData.dimanche.name}</small>
                </button>
                <button class="day-btn ${this.currentDay === 'mardi' ? 'active' : ''}" data-day="mardi">
                    🔥 Mardi<br><small>${weekData.mardi.name}</small>
                </button>
                <button class="day-btn ${this.currentDay === 'vendredi' ? 'active' : ''}" data-day="vendredi">
                    ⚡ Vendredi<br><small>${weekData.vendredi.name}</small>
                </button>
            </div>
            <style>
                .day-btn { flex: 1; padding: 12px; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; cursor: pointer; transition: all 0.2s; font-size: 14px; font-weight: 600; }
                .day-btn small { font-size: 10px; font-weight: 400; opacity: 0.7; display: block; margin-top: 4px; }
                .day-btn:hover { background: rgba(255,107,53,0.2); border-color: #ff6b35; }
                .day-btn.active { background: #ff6b35; border-color: #ff6b35; }
            </style>
        `;

        const html = daySelector + this.generateWorkoutHTML(workout, weekData.isDeload);
        container.innerHTML = html;

        // Attacher événements boutons jour
        const dayBtns = container.querySelectorAll('.day-btn');
        dayBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentDay = btn.dataset.day;
                this.renderCurrentWorkout();
            });
        });
    }

    generateWorkoutHTML(workout, isDeload) {
        let html = `
            <div class="workout-info" style="background: ${isDeload ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,107,53,0.1)'}; padding: 16px; border-radius: 12px; margin-bottom: 20px;">
                <h2 style="margin: 0 0 8px 0; color: ${isDeload ? '#3b82f6' : '#ff6b35'};">
                    ${workout.name}
                </h2>
                <div style="display: flex; gap: 16px; font-size: 14px; opacity: 0.8;">
                    <span>⏱️ ${workout.duration} min</span>
                    <span>📊 ${workout.totalSets} séries</span>
                    ${isDeload ? '<span>🔵 DELOAD -40%</span>' : ''}
                </div>
            </div>
        `;

        workout.exercises.forEach((exercise, index) => {
            const prevExercise = index > 0 ? workout.exercises[index - 1] : null;
            const isInSuperset = exercise.isSuperset;
            const startOfSuperset = isInSuperset && (!prevExercise || !prevExercise.isSuperset || prevExercise.supersetWith !== exercise.name);

            if (startOfSuperset) {
                html += '<div class="superset-group" style="border: 2px solid #ff6b35; border-radius: 12px; padding: 16px; margin-bottom: 20px; background: rgba(255,107,53,0.05);">';
                html += '<div style="color: #ff6b35; font-weight: bold; margin-bottom: 12px;">⚡ SUPERSET</div>';
            }

            html += `
                <div class="exercise-card slide-up" style="margin-bottom: 16px;">
                    <div class="exercise-header strength">
                        <span class="exercise-icon">💪</span>
                        <div class="exercise-title">
                            <h3 class="exercise-name">${exercise.name}</h3>
                            <div class="exercise-details">
                                <span>🎯 ${Array.isArray(exercise.muscle) ? exercise.muscle.join(', ') : exercise.muscle}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="exercise-body">
                        <div class="exercise-params">
                            <div class="param-item">
                                <div class="param-label">SÉRIES</div>
                                <div class="param-value">${exercise.sets}</div>
                            </div>
                            <div class="param-item">
                                <div class="param-label">REPS</div>
                                <div class="param-value">${exercise.reps}</div>
                            </div>
                            <div class="param-item">
                                <div class="param-label">POIDS</div>
                                <div class="param-value">${exercise.weight}kg</div>
                            </div>
                            <div class="param-item">
                                <div class="param-label">REPOS</div>
                                <div class="param-value">${exercise.rest}s</div>
                            </div>
                        </div>
                        
                        ${exercise.tempo ? `
                            <div style="margin: 12px 0; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 8px; font-size: 14px;">
                                <strong>Tempo:</strong> ${exercise.tempo}
                            </div>
                        ` : ''}
                        
                        ${exercise.notes ? `
                            <div style="margin: 12px 0; padding: 12px; background: rgba(255,107,53,0.1); border-left: 3px solid #ff6b35; border-radius: 4px; font-size: 14px;">
                                ${exercise.notes}
                            </div>
                        ` : ''}
                        
                        <div class="series-container">
                            ${this.generateSetsHTML(exercise)}
                        </div>
                    </div>
                </div>
            `;

            const nextExercise = index < workout.exercises.length - 1 ? workout.exercises[index + 1] : null;
            const endOfSuperset = isInSuperset && (!nextExercise || !nextExercise.isSuperset || nextExercise.supersetWith !== exercise.supersetWith);
            
            if (endOfSuperset) {
                html += '</div>'; // Ferme superset-group
            }
        });

        return html;
    }

    generateSetsHTML(exercise) {
        const sets = [];
        for (let i = 1; i <= exercise.sets; i++) {
            const isCompleted = this.completedSets.has(exercise.id) && 
                               this.completedSets.get(exercise.id).has(i);
            
            sets.push(`
                <div class="serie-item ${isCompleted ? 'completed' : ''}" data-set-number="${i}">
                    <div class="serie-number">${i}</div>
                    <div class="serie-info">
                        <div class="serie-reps">${exercise.reps} reps</div>
                        <div class="serie-weight">${exercise.weight}kg</div>
                    </div>
                    <div class="serie-rest">
                        <span class="rest-icon">⏱️</span>
                        <span class="rest-time">${exercise.rest}s repos</span>
                    </div>
                    <button 
                        class="serie-check" 
                        data-exercise-id="${exercise.id}"
                        data-set-number="${i}"
                    >
                        <span class="check-icon">${isCompleted ? '✓' : ''}</span>
                    </button>
                </div>
            `);
        }
        return sets.join('');
    }

    handleNavClick(index) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        navItems[index].classList.add('active');

        const container = document.getElementById('workout-container');
        if (!container) return;

        switch(index) {
            case 0:
                this.renderCurrentWorkout();
                break;
            case 1:
                this.renderStats();
                break;
            case 2:
                this.renderProgress();
                break;
            case 3:
                this.renderProfile();
                break;
        }

        console.log(`📱 Onglet ${index}`);
    }

    renderStats() {
        const container = document.getElementById('workout-container');
        const weekData = this.programGenerator.generateWeek(this.currentWeek);
        
        let totalSets = 0;
        let totalWeight = 0;
        
        ['dimanche', 'mardi', 'vendredi'].forEach(day => {
            weekData[day].exercises.forEach(ex => {
                totalSets += ex.sets;
                const repsNum = typeof ex.reps === 'string' ? parseInt(ex.reps.split('-')[0]) : ex.reps;
                totalWeight += ex.sets * repsNum * ex.weight;
            });
        });

        container.innerHTML = `
            <div class="stats-container" style="padding: 20px;">
                <h2 style="color: #ff6b35; margin-bottom: 24px;">📊 Statistiques Semaine ${this.currentWeek}</h2>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px;">
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #ff6b35;">${totalSets}</div>
                        <div style="opacity: 0.7; margin-top: 8px;">Séries totales</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: bold; color: #ff6b35;">${Math.round(totalWeight)}kg</div>
                        <div style="opacity: 0.7; margin-top: 8px;">Volume total</div>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                    <h3 style="margin: 0 0 16px 0;">📅 Séances de la semaine</h3>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="padding: 12px; background: rgba(255,107,53,0.1); border-radius: 8px;">
                            <strong>Dimanche:</strong> ${weekData.dimanche.name}<br>
                            <small style="opacity: 0.7;">${weekData.dimanche.totalSets} séries • ${weekData.dimanche.duration} min</small>
                        </div>
                        <div style="padding: 12px; background: rgba(255,107,53,0.1); border-radius: 8px;">
                            <strong>Mardi:</strong> ${weekData.mardi.name}<br>
                            <small style="opacity: 0.7;">${weekData.mardi.totalSets} séries • ${weekData.mardi.duration} min</small>
                        </div>
                        <div style="padding: 12px; background: rgba(255,107,53,0.1); border-radius: 8px;">
                            <strong>Vendredi:</strong> ${weekData.vendredi.name}<br>
                            <small style="opacity: 0.7;">${weekData.vendredi.totalSets} séries • ${weekData.vendredi.duration} min</small>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(59, 130, 246, 0.1); padding: 20px; border-radius: 12px;">
                    <h3 style="margin: 0 0 12px 0; color: #3b82f6;">🏠 Travail à domicile</h3>
                    <p style="margin: 0;">
                        <strong>Hammer Curl:</strong> ${weekData.maison.exercises[0].sets}×${weekData.maison.exercises[0].reps} @ ${weekData.maison.exercises[0].weight}kg<br>
                        <small style="opacity: 0.7;">Mardi soir + Jeudi soir</small>
                    </p>
                </div>
            </div>
        `;
    }

    renderProgress() {
        const container = document.getElementById('workout-container');
        
        // Calculer progression de quelques exercices clés
        const exercises = ['Trap Bar Deadlift', 'Dumbbell Press', 'Leg Press'];
        let progressHTML = '';

        exercises.forEach(exName => {
            const weekData = [];
            for (let w = 1; w <= this.currentWeek; w++) {
                const week = this.programGenerator.generateWeek(w);
                ['dimanche', 'mardi', 'vendredi'].forEach(day => {
                    const ex = week[day].exercises.find(e => e.name === exName);
                    if (ex) {
                        weekData.push({ week: w, weight: ex.weight, deload: week.isDeload });
                    }
                });
            }

            if (weekData.length > 0) {
                const startWeight = weekData[0].weight;
                const currentWeight = weekData[weekData.length - 1].weight;
                const gain = currentWeight - startWeight;
                const gainPercent = Math.round((gain / startWeight) * 100);

                progressHTML += `
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                        <h3 style="margin: 0 0 16px 0;">${exName}</h3>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                            <div>
                                <div style="font-size: 0.85rem; opacity: 0.7;">Semaine 1</div>
                                <div style="font-size: 1.5rem; font-weight: bold;">${startWeight}kg</div>
                            </div>
                            <div style="display: flex; align-items: center;">
                                <div style="font-size: 1.5rem; color: #22c55e;">→</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.85rem; opacity: 0.7;">Semaine ${this.currentWeek}</div>
                                <div style="font-size: 1.5rem; font-weight: bold; color: #ff6b35;">${currentWeight}kg</div>
                            </div>
                        </div>
                        <div style="background: rgba(34, 197, 94, 0.1); padding: 12px; border-radius: 8px; text-align: center;">
                            <strong style="color: #22c55e;">+${gain}kg (+${gainPercent}%)</strong>
                        </div>
                    </div>
                `;
            }
        });

        container.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="color: #ff6b35; margin-bottom: 24px;">📈 Progression</h2>
                ${progressHTML}
                
                <div style="background: rgba(255,107,53,0.1); padding: 20px; border-radius: 12px; border-left: 4px solid #ff6b35;">
                    <h3 style="margin: 0 0 12px 0;">🎯 Objectifs S26</h3>
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
                        <li>Trap Bar DL: 75kg → 120kg (+45kg)</li>
                        <li>Dumbbell Press: 22kg → 45kg (+23kg)</li>
                        <li>Leg Press: 110kg → 240kg (+130kg)</li>
                        <li>Masse maigre: +4.5 à 5.5kg</li>
                        <li>Tour de bras: +2.5 à 3cm</li>
                    </ul>
                </div>
            </div>
        `;
    }

    renderProfile() {
        const container = document.getElementById('workout-container');
        const blockInfo = getBlockTechnique(this.currentWeek);
        
        container.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="color: #ff6b35; margin-bottom: 24px;">👤 Profil</h2>
                
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                    <h3 style="margin: 0 0 16px 0;">📋 Informations Programme</h3>
                    <div style="display: grid; gap: 12px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="opacity: 0.7;">Nom:</span>
                            <strong>Hybrid Master 51</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="opacity: 0.7;">Durée totale:</span>
                            <strong>26 semaines</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="opacity: 0.7;">Séances/semaine:</span>
                            <strong>3 (+ 2 maison)</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="opacity: 0.7;">Objectif:</span>
                            <strong>Hypertrophie</strong>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(255,107,53,0.1); padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                    <h3 style="margin: 0 0 16px 0;">📍 Position actuelle</h3>
                    <div style="display: grid; gap: 12px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="opacity: 0.7;">Semaine:</span>
                            <strong>${this.currentWeek}/26</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="opacity: 0.7;">Bloc:</span>
                            <strong>Bloc ${blockInfo.block}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="opacity: 0.7;">Technique:</span>
                            <strong>${blockInfo.technique}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="opacity: 0.7;">RPE cible:</span>
                            <strong>${blockInfo.rpe}</strong>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(59, 130, 246, 0.1); padding: 20px; border-radius: 12px;">
                    <h3 style="margin: 0 0 16px 0; color: #3b82f6;">🔵 Deloads programmés</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${[6, 12, 18, 24, 26].map(w => `
                            <div style="padding: 8px 16px; background: ${w === this.currentWeek ? '#3b82f6' : 'rgba(59, 130, 246, 0.2)'}; border-radius: 8px; font-weight: 600;">
                                S${w}
                            </div>
                        `).join('')}
                    </div>
                    <p style="margin: 16px 0 0 0; font-size: 0.9rem; opacity: 0.8;">
                        Les deloads réduisent les charges de 40% pour favoriser la récupération
                    </p>
                </div>

                <div style="margin-top: 24px; padding: 20px; background: rgba(34, 197, 94, 0.1); border-radius: 12px; border-left: 4px solid #22c55e;">
                    <h3 style="margin: 0 0 12px 0; color: #22c55e;">💪 Conseils</h3>
                    <ul style="margin: 0; padding-left: 20px; line-height: 1.8; font-size: 0.95rem;">
                        <li>Technique parfaite > Charges lourdes</li>
                        <li>Sommeil 7h30+ non négociable</li>
                        <li>Protéines: 2g/kg poids corps</li>
                        <li>Hydratation: 3L/jour minimum</li>
                        <li>Écouter son corps (douleur = stop)</li>
                    </ul>
                </div>
            </div>
        `;
    }

    showError(message) {
        const container = document.getElementById('workout-container');
        if (!container) return;

        container.innerHTML = `
            <div class="empty-workout">
                <p style="color: #ef4444;">❌ ${message}</p>
            </div>
        `;
    }

    showSuccess(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #22c55e;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease-out;
        `;
        toast.textContent = message;

        const style = document.createElement('style');
        style.textContent = '@keyframes slideDown { from { opacity: 0; transform: translateX(-50%) translateY(-20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }';
        document.head.appendChild(style);

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s';
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) document.body.removeChild(toast);
                if (style.parentNode) document.head.removeChild(style);
            }, 300);
        }, 3000);
    }
}

// ============================================================================
// DÉMARRAGE
// ============================================================================
const app = new App();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

console.log('🏆 Hybrid Master 51 - Version Complète Chargée');
