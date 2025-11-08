// ====================================================================
// HYBRID MASTER 51 - PROGRAMME COMPLET DÉFINITIF
// ====================================================================
// Version : 1.0 Finale
// Date : Novembre 2025
// Durée : 26 semaines
// Fréquence : 3 séances/semaine (Dimanche, Mardi, Vendredi)
// Objectif : +4.5-5.5 kg masse maigre, progression force optimale
// ====================================================================

// HELPER : Calculer progression de poids
function calculateWeight(baseWeight, week, increment, frequency) {
  const progressions = Math.floor((week - 1) / frequency);
  const newWeight = baseWeight + (progressions * increment);
  
  // Deload semaines 6, 12, 18, 24, 26 : -40%
  const isDeload = [6, 12, 18, 24, 26].includes(week);
  return isDeload ? Math.round(newWeight * 0.6 * 2) / 2 : newWeight;
}

// HELPER : Déterminer technique bloc
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

// HELPER : Exercice biceps dimanche (rotation)
function getBicepExercise(week) {
  const block = getBlockTechnique(week).block;
  // Bloc 1 & 3 : Incline Curl / Bloc 2 & 4 : Spider Curl
  return (block === 1 || block === 3) ? "Incline Curl" : "Spider Curl";
}

// ====================================================================
// GÉNÉRATEUR PROGRAMME 26 SEMAINES
// ====================================================================

function generateProgram() {
  const program = {};
  
  for (let week = 1; week <= 26; week++) {
    const blockInfo = getBlockTechnique(week);
    const isDeload = [6, 12, 18, 24, 26].includes(week);
    
    program[`week${week}`] = {
      weekNumber: week,
      block: blockInfo.block,
      technique: blockInfo.technique,
      rpeTarget: blockInfo.rpe,
      isDeload: isDeload,
      
      // ============================================================
      // DIMANCHE : DOS + JAMBES LOURDES + BRAS (68 min - 31 séries)
      // ============================================================
      dimanche: {
        name: "DOS + JAMBES LOURDES + BRAS",
        duration: 68,
        totalSets: 31,
        exercises: [
          {
            id: `w${week}_dim_1`,
            name: "Trap Bar Deadlift",
            category: "compound",
            rpe: "7-8",
            muscle: ["dos", "jambes", "fessiers"],
            sets: 5,
            reps: "6-8",
            rpe: "7-8",
            weight: calculateWeight(75, week, 5, 3), // +5 kg / 3 sem
            rest: 120,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 2 && !isDeload ? "Rest-Pause série 5 : 6-8 reps → 20s → 2-3 reps" : 
                   blockInfo.block === 4 && !isDeload ? "Clusters série 5 : 3 reps → 20s → 2 reps → 20s → 2 reps" : 
                   "Exercice roi, technique parfaite obligatoire"
          },
          {
            id: `w${week}_dim_2`,
            name: "Goblet Squat",
            category: "compound",
           rpe: "7-8",
            rpe: "7-8",
            muscle: ["quadriceps", "fessiers"],
            sets: 4,
            reps: 10,
            weight: calculateWeight(25, week, 2.5, 2), // +2.5 kg / 2 sem (haltère)
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 3 && !isDeload ? "Drop-set série 4 : 10 reps → -25% → 8-10 reps" :
                   blockInfo.block === 4 && !isDeload ? "Série 4 : 10 reps complètes → 5 demi-reps (partials amplitude haute)" :
                   "Haltère tenu devant poitrine, descente contrôlée"
          },
          {
            id: `w${week}_dim_3`,
            name: "Leg Press",
            category: "compound",
            rpe: "7-8",
            muscle: ["quadriceps", "fessiers"],
            sets: 4,
            reps: 10,
            weight: calculateWeight(110, week, 10, 2), // +10 kg / 2 sem
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 3 && !isDeload ? "Drop-set série 4 : 10 reps → -25% → 10-12 reps" :
                   blockInfo.block === 4 && !isDeload ? "Clusters série 4 : 4 reps → 20s → 3 reps → 20s → 3 reps | Puis 10 reps complètes → 8 quarts de reps" :
                   "Pieds largeur épaules, amplitude complète"
          },
          {
            id: `w${week}_dim_4a`,
            name: "Lat Pulldown (prise large)",
            category: "compound",
            rpe: "7-8",
            muscle: ["dos"],
            sets: 4,
            reps: 10,
            weight: calculateWeight(60, week, 2.5, 2), // +2.5 kg / 2 sem
            rest: 90,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Landmine Press",
            notes: blockInfo.block === 3 && !isDeload ? "Drop-set série 4 : 10 reps → -20% → 8-10 reps" :
                   "SUPERSET avec Landmine Press | Prise 1.5× largeur épaules"
          },
          {
            id: `w${week}_dim_4b`,
            name: "Landmine Press",
            category: "compound",
            rpe: "7-8",
            muscle: ["pectoraux", "épaules"],
            sets: 4,
            reps: 10,
            weight: calculateWeight(35, week, 2.5, 2), // +2.5 kg / 2 sem
            rest: 90,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Lat Pulldown",
            notes: "SUPERSET avec Lat Pulldown | Barre calée dans coin ou landmine"
          },
          {
            id: `w${week}_dim_5`,
            name: "Rowing Machine (prise large)",
            category: "compound",
            rpe: "7-8",
            muscle: ["dos"],
            sets: 4,
            reps: 10,
            weight: calculateWeight(50, week, 2.5, 2), // +2.5 kg / 2 sem
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 3 && !isDeload ? "Myo-reps série 4 : 10 reps → 5s → 4 mini-sets de 4 reps" :
                   blockInfo.block === 4 && !isDeload ? "Myo-reps série 4 : 10 reps → 5s → 4 mini-sets de 4 reps" :
                   "Mains écartées, coudes vers extérieur, tirer vers bas des pecs"
          },
          {
            id: `w${week}_dim_6a`,
            name: getBicepExercise(week),
            category: "isolation",
            rpe: "7-8",
            muscle: ["biceps"],
            sets: 4,
            reps: 12,
            weight: calculateWeight(12, week, 2.5, 3), // +2.5 kg / 3 sem (haltère)
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Cable Pushdown",
            notes: blockInfo.block === 1 && !isDeload ? "SUPERSET | Pause 2s bras tendus (étirement maximal)" :
                   blockInfo.block === 3 && !isDeload ? "SUPERSET | Myo-reps série 4 : 12 reps → 5s → 4 mini-sets de 4 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps série 4 : 12 reps → 5s → 4 mini-sets de 4 reps" :
                   `SUPERSET | ${getBicepExercise(week) === "Incline Curl" ? "Incline 45° sur banc" : "Spider curl pupitre"}`
          },
          {
            id: `w${week}_dim_6b`,
            name: "Cable Pushdown",
            category: "isolation",
            rpe: "7-8",
            muscle: ["triceps"],
            sets: 3,
            reps: 12,
            weight: calculateWeight(20, week, 2.5, 3), // +2.5 kg / 3 sem
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: getBicepExercise(week),
            notes: blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps série 3 : 12 reps → 5s → 4 mini-sets de 4 reps" :
                   "SUPERSET | Coudes fixes le long du corps"
          }
        ]
      },
      
      // ============================================================
      // MARDI : PECS + ÉPAULES + TRICEPS (70 min - 35 séries)
      // ============================================================
      mardi: {
        name: "PECS + ÉPAULES + TRICEPS",
        duration: 70,
        totalSets: 35,
        exercises: [
          {
            id: `w${week}_mar_1`,
            name: "Dumbbell Press",
            category: "compound",
            rpe: "7-8",
            muscle: ["pectoraux", "épaules", "triceps"],
            sets: 5,
            reps: 10,
            weight: calculateWeight(22, week, 2.5, 3), // +2.5 kg / 3 sem (par haltère)
            rest: 105,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 2 && !isDeload ? "Rest-Pause série 5 : 10 reps → 20s → 3-4 reps" :
                   blockInfo.block === 3 && !isDeload ? "Drop-set série 5 : 10 reps → -25% → 8-10 reps" :
                   blockInfo.block === 4 && !isDeload ? "Clusters série 5 : 4 reps → 15s → 3 reps → 15s → 3 reps" :
                   "Banc plat, haltères rotation naturelle"
          },
          {
            id: `w${week}_mar_2`,
            name: "Cable Fly (poulies moyennes)",
            category: "isolation",
            rpe: "7-8",
            muscle: ["pectoraux"],
            sets: 4,
            reps: 12,
            weight: calculateWeight(10, week, 2.5, 3), // +2.5 kg / 3 sem
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 1 && !isDeload ? "Pause 2s bras écartés (étirement maximal pecs)" :
                   blockInfo.block === 3 && !isDeload ? "Drop-set série 4 : 12 reps → -25% → 10-12 reps | Myo-reps : 12 reps → 5s → 5 mini-sets de 5 reps" :
                   blockInfo.block === 4 && !isDeload ? "Myo-reps série 4 : 12 reps → 5s → 5 mini-sets de 5 reps" :
                   "Poulies hauteur épaules, bras semi-fléchis"
          },
          {
            id: `w${week}_mar_3`,
            name: "Leg Press léger",
            category: "compound",
            rpe: "7-8",
            muscle: ["quadriceps", "fessiers"],
            sets: 3,
            reps: 15,
            weight: calculateWeight(80, week, 10, 3), // +10 kg / 3 sem
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: "Activation légère jambes, pas de fatigue excessive"
          },
          {
            id: `w${week}_mar_4a`,
            name: "Extension Triceps Corde",
            category: "isolation",
            rpe: "7-8",
            muscle: ["triceps"],
            sets: 5,
            reps: 12,
            weight: calculateWeight(20, week, 2.5, 3), // +2.5 kg / 3 sem
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Lateral Raises",
            notes: blockInfo.block === 3 && !isDeload ? "SUPERSET | Drop-set série 5 : 12 reps → -20% → 10-12 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps série 5 : 12 reps → 5s → 4 mini-sets de 4 reps" :
                   "SUPERSET | Corde poulie haute, coudes fixes"
          },
          {
            id: `w${week}_mar_4b`,
            name: "Lateral Raises",
            category: "isolation",
            rpe: "7-8",
            muscle: ["épaules"],
            sets: 5,
            reps: 15,
            weight: calculateWeight(8, week, 2.5, 4), // +2.5 kg / 4 sem (haltère)
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Extension Triceps Corde",
            notes: blockInfo.block === 1 && !isDeload ? "SUPERSET | Pause 1s bras horizontaux" :
                   blockInfo.block === 3 && !isDeload ? "SUPERSET | Drop-set série 5 : 15 reps → -25% → 12-15 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps série 5 : 15 reps → 5s → 5 mini-sets de 5 reps" :
                   "SUPERSET | Coudes légèrement fléchis, monter à l'horizontal"
          },
          {
            id: `w${week}_mar_5`,
            name: "Face Pull",
            category: "isolation",
            rpe: "7-8",
            muscle: ["épaules", "dos"],
            sets: 5,
            reps: 15,
            weight: calculateWeight(20, week, 2.5, 3), // +2.5 kg / 3 sem
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 1 && !isDeload ? "Pause 1s contraction arrière" :
                   blockInfo.block === 3 && !isDeload ? "Myo-reps série 5 : 15 reps → 5s → 5 mini-sets de 5 reps" :
                   blockInfo.block === 4 && !isDeload ? "Myo-reps série 5 : 15 reps → 5s → 5 mini-sets de 5 reps" :
                   "Corde poulie haute, tirer vers visage, rotation externe"
          },
          {
            id: `w${week}_mar_6`,
            name: "Rowing Machine (prise serrée)",
            category: "compound",
            rpe: "7-8",
            muscle: ["dos"],
            sets: 4,
            reps: 12,
            weight: calculateWeight(50, week, 2.5, 2), // +2.5 kg / 2 sem
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: "Mains largeur épaules, coudes le long du corps, tirer vers nombril"
          },
          {
            id: `w${week}_mar_7`,
            name: "Overhead Extension (corde, assis)",
            category: "isolation",
            rpe: "7-8",
            muscle: ["triceps"],
            sets: 4,
            reps: 12,
            weight: calculateWeight(15, week, 2.5, 3), // +2.5 kg / 3 sem
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 3 && !isDeload ? "Myo-reps série 4 : 12 reps → 5s → 4 mini-sets de 4 reps" :
                   blockInfo.block === 4 && !isDeload ? "Myo-reps série 4 : 12 reps → 5s → 4 mini-sets de 4 reps" :
                   "Corde poulie haute, assis, étirement triceps maximal"
          }
        ]
      },
      
      // ============================================================
      // VENDREDI : DOS + JAMBES LÉGÈRES + BRAS + ÉPAULES (73 min - 33 séries)
      // ============================================================
      vendredi: {
        name: "DOS + JAMBES LÉGÈRES + BRAS + ÉPAULES",
        duration: 73,
        totalSets: 33,
        exercises: [
          {
            id: `w${week}_ven_1`,
            name: "Landmine Row",
            category: "compound",
            rpe: "7-8",
            muscle: ["dos"],
            sets: 5,
            reps: 10,
            weight: calculateWeight(55, week, 2.5, 2), // +2.5 kg / 2 sem
            rest: 105,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 2 && !isDeload ? "Rest-Pause série 5 : 10 reps → 20s → 3-4 reps" :
                   blockInfo.block === 3 && !isDeload ? "Drop-set série 5 : 10 reps → -20% → 8-10 reps" :
                   blockInfo.block === 4 && !isDeload ? "Clusters série 5 : 4 reps → 15s → 3 reps → 15s → 3 reps" :
                   "Barre calée, une main, tirer vers hanche"
          },
          {
            id: `w${week}_ven_2a`,
            name: "Leg Curl",
            category: "isolation",
            rpe: "7-8",
            muscle: ["ischios"],
            sets: 5,
            reps: 12,
            weight: calculateWeight(40, week, 5, 3), // +5 kg / 3 sem
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Leg Extension",
            notes: blockInfo.block === 3 && !isDeload ? "SUPERSET | Drop-set série 5 : 12 reps → -25% → 10-12 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Série 5 : 12 reps complètes → 6-8 partials (amplitude haute)" :
                   "SUPERSET | Allongé ou assis selon machine"
          },
          {
            id: `w${week}_ven_2b`,
            name: "Leg Extension",
            category: "isolation",
            rpe: "7-8",
            muscle: ["quadriceps"],
            sets: 4,
            reps: 15,
            weight: calculateWeight(35, week, 5, 3), // +5 kg / 3 sem
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Leg Curl",
            notes: blockInfo.block === 3 && !isDeload ? "SUPERSET | Drop-set série 4 : 15 reps → -25% → 12-15 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Série 4 : 15 reps complètes → 10 partials (derniers 30°)" :
                   "SUPERSET | Extension complète, contraction 1s en haut"
          },
          {
            id: `w${week}_ven_3a`,
            name: "Cable Fly",
            category: "isolation",
            rpe: "7-8",
            muscle: ["pectoraux"],
            sets: 4,
            reps: 15,
            weight: calculateWeight(10, week, 2.5, 3), // +2.5 kg / 3 sem
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Dumbbell Fly",
            notes: blockInfo.block === 3 && !isDeload ? "SUPERSET | Myo-reps série 4 : 15 reps → 5s → 5 mini-sets de 5 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps série 4 : 15 reps → 5s → 5 mini-sets de 5 reps" :
                   "SUPERSET | Poulies moyennes, étirement maximal"
          },
          {
            id: `w${week}_ven_3b`,
            name: "Dumbbell Fly",
            category: "isolation",
            rpe: "7-8",
            muscle: ["pectoraux"],
            sets: 4,
            reps: 12,
            weight: calculateWeight(10, week, 2.5, 3), // +2.5 kg / 3 sem (haltère)
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Cable Fly",
            notes: blockInfo.block === 1 && !isDeload ? "SUPERSET | Pause 2s bras écartés (étirement pecs)" :
                   blockInfo.block === 3 && !isDeload ? "SUPERSET | Drop-set série 4 : 12 reps → -25% → 10-12 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps série 4 : 12 reps → 5s → 4 mini-sets de 4 reps" :
                   "SUPERSET | Banc plat, amplitude complète"
          },
          {
            id: `w${week}_ven_4a`,
            name: "EZ Bar Curl",
            category: "isolation",
            rpe: "7-8",
            muscle: ["biceps"],
            sets: 5,
            reps: 12,
            weight: calculateWeight(25, week, 2.5, 3), // +2.5 kg / 3 sem
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "Overhead Extension",
            notes: blockInfo.block === 1 && !isDeload ? "SUPERSET | Pause 2s bras tendus (étirement biceps)" :
                   blockInfo.block === 3 && !isDeload ? "SUPERSET | Myo-reps série 5 : 12 reps → 5s → 4 mini-sets de 4 reps" :
                   blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps série 5 : 12 reps → 5s → 4 mini-sets de 4 reps" :
                   "SUPERSET | Barre EZ, coudes fixes"
          },
          {
            id: `w${week}_ven_4b`,
            name: "Overhead Extension",
            category: "isolation",
            rpe: "7-8",
            muscle: ["triceps"],
            sets: 3,
            reps: 12,
            weight: calculateWeight(15, week, 2.5, 3), // +2.5 kg / 3 sem
            rest: 75,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            isSuperset: true,
            supersetWith: "EZ Bar Curl",
            notes: blockInfo.block === 4 && !isDeload ? "SUPERSET | Myo-reps série 3 : 12 reps → 5s → 4 mini-sets de 4 reps" :
                   "SUPERSET | Corde poulie haute, assis, étirement maximal"
          },
          {
            id: `w${week}_ven_5`,
            name: "Lateral Raises",
            category: "isolation",
            rpe: "7-8",
            muscle: ["épaules"],
            sets: 3,
            reps: 15,
            weight: calculateWeight(8, week, 2.5, 4), // +2.5 kg / 4 sem (haltère)
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: blockInfo.block === 4 && !isDeload ? "Myo-reps série 3 : 15 reps → 5s → 5 mini-sets de 5 reps" :
                   "Coudes légèrement fléchis, monter à l'horizontal"
          },
          {
            id: `w${week}_ven_6`,
            name: "Wrist Curl",
            category: "isolation",
            rpe: "7-8",
            muscle: ["avant-bras"],
            sets: 3,
            reps: 20,
            weight: calculateWeight(30, week, 2.5, 4), // +2.5 kg / 4 sem
            rest: 45,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: "Assis, avant-bras sur cuisses, flexion poignets"
          }
        ]
      },
      
      // ============================================================
      // MAISON : HAMMER CURL (Mardi soir + Jeudi soir)
      // ============================================================
      maison: {
        name: "HAMMER CURL MAISON",
        duration: 5,
        totalSets: 3,
        daysPerWeek: ["Mardi soir", "Jeudi soir"],
        exercises: [
          {
            id: `w${week}_maison_1`,
            name: "Hammer Curl",
            category: "isolation",
            rpe: "7-8",
            muscle: ["biceps", "avant-bras"],
            sets: 3,
            reps: 12,
            weight: calculateWeight(12, week, 2.5, 3), // +2.5 kg / 3 sem (haltère)
            rest: 60,
            tempo: isDeload ? "4-1-2" : (week <= 5 ? "3-1-2" : "2-1-2"),
            notes: "À faire à la maison, Mardi ET Jeudi soir, prise marteau (neutre)"
          }
        ]
      }
    };
  }
  
  return program;
}

// ====================================================================
// GÉNÉRATION DU PROGRAMME COMPLET
// ====================================================================
export const PROGRAM = generateProgram();

// ====================================================================
// INFORMATIONS SUPPLÉMENTAIRES
// ====================================================================
export const PROGRAM_INFO = {
  name: "Hybrid Master 51",
  version: "1.0 Définitive",
  duration: 26,
  weeksPerBlock: {
    block1: [1, 2, 3, 4, 5],
    deload1: [6],
    block2: [7, 8, 9, 10, 11],
    deload2: [12],
    block3: [13, 14, 15, 16, 17],
    deload3: [18],
    block4: [19, 20, 21, 22, 23],
    deload4: [24],
    block5: [25],
    deload5: [26]
  },
  workoutsPerWeek: 3,
  daysOfWeek: ["Dimanche", "Mardi", "Vendredi"],
  homeworkDays: ["Mardi soir", "Jeudi soir"],
  
  blockTechniques: {
    block1: {
      name: "Fondations Techniques",
      weeks: "1-5",
      technique: "Tempo 3-1-2",
      description: "3s descente, 1s pause, 2s montée",
      pauses: "Cable Fly (2s), Dumbbell Fly (2s), Incline Curl (2s), EZ Bar Curl (2s), Lateral Raises (1s), Face Pull (1s)",
      rpe: "6-7"
    },
    block2: {
      name: "Surcharge Progressive",
      weeks: "7-11",
      technique: "Rest-Pause",
      description: "Dernière série exercices principaux : reps complètes → 20s repos → 2-4 reps supplémentaires",
      exercises: "Trap Bar DL S5, Dumbbell Press S5, Landmine Row S5",
      rpe: "7-8"
    },
    block3: {
      name: "Surcompensation Métabolique",
      weeks: "13-17",
      technique: "Drop-sets + Myo-reps",
      description: "Drop-sets (-25%) dernière série | Myo-reps isolations (reps → 5s → 4-5 mini-sets)",
      dropSets: "Goblet Squat, Leg Press, Lat Pulldown, Dumbbell Press, Cable Fly, Extension Triceps, Lateral Raises, Landmine Row, Leg Curl, Leg Extension, Dumbbell Fly",
      myoReps: "Face Pull, Overhead Extension, Incline Curl, Cable Fly, Rowing Machine",
      rpe: "8"
    },
    block4: {
      name: "Intensification Maximale",
      weeks: "19-23",
      technique: "Clusters + Myo-reps + Partials",
      description: "Clusters exercices lourds | Myo-reps TOUTES isolations | Partials fin de série jambes",
      clusters: "Trap Bar DL, Dumbbell Press, Landmine Row, Leg Press",
      myoReps: "Face Pull, Lateral Raises, Overhead Extension, Cable Fly, Dumbbell Fly, Spider Curl, EZ Bar Curl, Rowing Machine, Extension Triceps",
      partials: "Goblet Squat (+5 demi-reps), Leg Press (+8 quarts), Leg Curl (+6-8 partials), Leg Extension (+10 partials)",
      rpe: "8-9"
    },
    block5: {
      name: "Peak Week",
      weeks: "25",
      technique: "Intensité maximale",
      description: "Semaine de test de force, charges maximales",
      rpe: "8-9"
    }
  },
  
  deloadProtocol: {
    weeks: [6, 12, 18, 24, 26],
    loadReduction: "-40%",
    tempo: "4-1-2",
    rpe: "5-6",
    purpose: "Récupération complète, prévention surentraînement, consolidation gains"
  },
  
  bicepsRotation: {
    block1: "Incline Curl",
    block2: "Spider Curl",
    block3: "Incline Curl",
    block4: "Spider Curl",
    reason: "Incline = étirement maximal | Spider = contraction maximale | Rotation optimise hypertrophie"
  },
  
  expectedResults: {
    leanMass: "+4.5 à 5.5 kg",
    armCircumference: "+2.5 à 3 cm",
    chestCircumference: "+3.5 à 4 cm",
    shoulderCircumference: "+3 à 3.5 cm",
    backCircumference: "+4 à 5 cm",
    thighCircumference: "+3 à 3.5 cm",
    trapBarDeadlift: "75 kg → 120 kg (+45 kg)",
    dumbbellPress: "22 kg → 45 kg/haltère (+23 kg)",
    legPress: "110 kg → 240 kg (+130 kg)",
    rowingMachine: "50 kg → 82.5 kg (+32.5 kg)",
    completionRate: "95%+",
    injuryRisk: "<5%"
  },
  
  weeklyVolume: {
    quadriceps: { direct: 16, indirect: 7, total: 23, frequency: 3, optimal: "18-24" },
    hamstrings: { direct: 10, indirect: 7, total: 17, frequency: 2, optimal: "14-20" },
    glutes: { direct: 9, indirect: 10, total: 19, frequency: 3, optimal: "14-20" },
    back: { direct: 22, indirect: 8, total: 30, frequency: 3, optimal: "18-24" },
    chest: { direct: 17, indirect: 5, total: 22, frequency: 3, optimal: "16-22" },
    rearDelts: { direct: 9, indirect: 3, total: 12, frequency: 2, optimal: "10-14" },
    lateralDelts: { direct: 8, indirect: 2, total: 10, frequency: 3, optimal: "6-10" },
    biceps: { direct: 9, indirect: 10, total: 19, frequency: 3, optimal: "14-20" },
    triceps: { direct: 15, indirect: 5, total: 20, frequency: 3, optimal: "12-18" },
    forearms: { direct: 3, indirect: 13, total: 16, frequency: 3, optimal: "6-12" }
  },
  
  nutrition: {
    protein: "2g/kg poids corps (priorité absolue)",
    carbs: "3-4g/kg (énergie entraînement)",
    fats: "0.8-1g/kg (hormones, santé)",
    surplus: "+300 à +500 kcal/jour",
    preWorkout: "30-40g protéines + 50-60g glucides (1-2h avant)",
    postWorkout: "30g whey + 50g glucides rapides (dans les 30 min)",
    beforeBed: "30g caséine ou fromage blanc + ZMA",
    hydration: "3L/jour minimum + 500ml/heure training"
  },
  
  supplementation: {
    mandatory: {
      protein: "2g/kg poids corps répartis",
      creatine: "5g/jour post-training",
      collagen: "10g/jour matin à jeun",
      omega3: "3g/jour (EPA/DHA) avec repas",
      vitaminD3: "4000 UI/jour matin",
      zma: "Selon étiquette 30 min avant coucher",
      wheyIsolate: "30g post-training immédiat",
      fastCarbs: "50g post-training",
      electrolytes: "1 dose pendant training"
    },
    optional: {
      glucosamineChondroitin: "1500mg/jour (santé articulaire)",
      curcumin: "500mg matin (anti-inflammatoire)",
      magnesiumBisglycinate: "400mg soir (récupération)"
    }
  },
  
  recovery: {
    sleep: "7h30 minimum (optimal 8h)",
    bedtime: "Régulier, chambre fraîche 18-19°C, obscurité totale",
    overtrainingSignals: [
      "Insomnie persistante (>3 nuits)",
      "Douleur articulaire aiguë",
      "Fatigue extrême constante",
      "Perte motivation totale",
      "Régression force 2 séances consécutives",
      "Fréquence cardiaque repos +10 bpm vs normale"
    ],
    actionIfOvertrained: [
      "Deload anticipé immédiat (1 sem -50%)",
      "Sommeil 9h minimum",
      "Massage/kiné si douleurs",
      "Retour progressif"
    ]
  },
  
  warmup: {
    phase1: "Cardio léger 5 min (vélo/rameur) 60-70% FC max",
    phase2: "Mobilité articulaire 5 min (rotations épaules, cat-cow, leg swings, rotations poignets/chevilles, dislocations épaules)",
    phase3: "Échauffement spécifique par exercice lourd : 40% 8 reps → 60% 5 reps → 80% 3 reps → 90% 1 rep → 100% série travail"
  },
  
  safetyRules: {
    golden: [
      "Technique > Charge TOUJOURS",
      "Douleur ≠ Courbature (courbature = OK / douleur articulaire = STOP)",
      "Progression conservative (ne JAMAIS sauter échelon)",
      "Respiration : inspirer descente, expirer montée",
      "Amplitude contrôlée (privilégier complète sauf si douleur)"
    ],
    stopSignals: [
      "Douleur aiguë articulaire",
      "Craquement/claquement tendon",
      "Engourdissement/fourmillement",
      "Perte force soudaine",
      "Vertiges/nausées",
      "Douleur thoracique"
    ]
  },
  
  progressionCriteria: {
    increase: "RPE ≤6 sur 2 séances consécutives + technique parfaite + aucune douleur",
    maintain: "RPE 7-8 constant + technique légèrement dégradée dernières reps",
    decrease: "RPE >9 deux séances consécutives + technique dégradée + douleur articulaire"
  }
};

// ====================================================================
// CLASSE PROGRAMDATA (API)
// ====================================================================
export class ProgramData {
  constructor() {
    this.program = PROGRAM;
    this.info = PROGRAM_INFO;
    this.currentWeek = 1;
  }
  
  // Récupérer une semaine complète
  getWeek(weekNumber) {
    if (weekNumber < 1 || weekNumber > 26) {
      throw new Error(`Semaine invalide : ${weekNumber}. Doit être entre 1 et 26.`);
    }
    return this.program[`week${weekNumber}`];
  }
  
  // Récupérer un workout spécifique d'une semaine
  getWorkout(weekNumber, day) {
    const week = this.getWeek(weekNumber);
    const validDays = ['dimanche', 'mardi', 'vendredi', 'maison'];
    
    if (!validDays.includes(day.toLowerCase())) {
      throw new Error(`Jour invalide : ${day}. Doit être dimanche, mardi, vendredi ou maison.`);
    }
    
    return week[day.toLowerCase()];
  }
  
  // Récupérer tous les exercices d'un workout
  getWorkoutExercises(weekNumber, day) {
    const workout = this.getWorkout(weekNumber, day);
    return workout.exercises;
  }
  
  // Récupérer la progression d'un exercice sur 26 semaines
  getExerciseProgression(exerciseName) {
    const progression = [];
    
    for (let week = 1; week <= 26; week++) {
      const weekData = this.getWeek(week);
      
      ['dimanche', 'mardi', 'vendredi', 'maison'].forEach(day => {
        const workout = weekData[day];
        const exercise = workout.exercises.find(ex => ex.name === exerciseName);
        
        if (exercise) {
          progression.push({
            week: week,
            day: day,
            weight: exercise.weight,
            sets: exercise.sets,
            reps: exercise.reps,
            technique: weekData.technique,
            isDeload: weekData.isDeload
          });
        }
      });
    }
    
    return progression;
  }
  
  // Récupérer tous les exercices uniques du programme
  getAllExercises() {
    const exercisesSet = new Set();
    
    for (let week = 1; week <= 26; week++) {
      const weekData = this.getWeek(week);
      
      ['dimanche', 'mardi', 'vendredi', 'maison'].forEach(day => {
        weekData[day].exercises.forEach(ex => {
          exercisesSet.add(ex.name);
        });
      });
    }
    
    return Array.from(exercisesSet).sort();
  }
  
  // Calculer volume total d'une semaine
  getWeekVolume(weekNumber) {
    const week = this.getWeek(weekNumber);
    let totalSets = 0;
    let totalReps = 0;
    let totalWeight = 0;
    
    ['dimanche', 'mardi', 'vendredi', 'maison'].forEach(day => {
      week[day].exercises.forEach(ex => {
        totalSets += ex.sets;
        const repsNum = typeof ex.reps === 'string' ? 
          parseInt(ex.reps.split('-')[0]) : ex.reps;
        totalReps += ex.sets * repsNum;
        totalWeight += ex.sets * repsNum * ex.weight;
      });
    });
    
    return {
      totalSets,
      totalReps,
      totalWeight: Math.round(totalWeight),
      weekNumber
    };
  }
  
  // Récupérer toutes les semaines
  getAllWeeks() {
    const weeks = [];
    for (let i = 1; i <= 26; i++) {
      weeks.push(this.getWeek(i));
    }
    return weeks;
  }
  
  // Vérifier si une semaine est un deload
  isDeloadWeek(weekNumber) {
    return [6, 12, 18, 24, 26].includes(weekNumber);
  }
  
  // Récupérer le bloc d'une semaine
  getBlock(weekNumber) {
    const week = this.getWeek(weekNumber);
    return week.block;
  }
  
  // Récupérer la technique d'une semaine
  getTechnique(weekNumber) {
    const week = this.getWeek(weekNumber);
    return week.technique;
  }
  
  // Exporter en JSON
  exportToJSON() {
    return JSON.stringify({
      program: this.program,
      info: this.info
    }, null, 2);
  }
  
  // Importer depuis JSON
  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.program = data.program;
      this.info = data.info;
      return true;
    } catch (error) {
      console.error('Erreur import JSON:', error);
      return false;
    }
  }
  
  // Valider la structure du programme
  validateProgram() {
    const errors = [];
    
    // Vérifier 26 semaines
    if (Object.keys(this.program).length !== 26) {
      errors.push(`Nombre de semaines incorrect : ${Object.keys(this.program).length} au lieu de 26`);
    }
    
    // Vérifier chaque semaine
    for (let week = 1; week <= 26; week++) {
      try {
        const weekData = this.getWeek(week);
        
        // Vérifier jours obligatoires
        ['dimanche', 'mardi', 'vendredi', 'maison'].forEach(day => {
          if (!weekData[day]) {
            errors.push(`Semaine ${week} : jour ${day} manquant`);
          } else if (!weekData[day].exercises || weekData[day].exercises.length === 0) {
            errors.push(`Semaine ${week}, ${day} : aucun exercice`);
          }
        });
        
        // Vérifier propriétés obligatoires
        if (!weekData.block) errors.push(`Semaine ${week} : propriété 'block' manquante`);
        if (!weekData.technique) errors.push(`Semaine ${week} : propriété 'technique' manquante`);
        
      } catch (error) {
        errors.push(`Semaine ${week} : ${error.message}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors,
      totalWeeks: Object.keys(this.program).length,
      totalExercises: this.getAllExercises().length
    };
  }
}

// ====================================================================
// EXPORT PAR DÉFAUT
// ====================================================================
export default new ProgramData();
