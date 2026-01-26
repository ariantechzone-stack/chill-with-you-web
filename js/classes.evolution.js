const evolutions = {
  monk: { name: "Zen Master", condition: s => s.monkSilent >= 20 },
  owl: { name: "Midnight Sage", condition: s => s.owlNight >= 10 }
};

function checkEvolutions(progress) {
  Object.entries(evolutions).forEach(([id, evo]) => {
    if (progress[id] >= (evo.conditionThreshold || 0)) {
      progress.evolution[id] = evo.name;
    }
  });
}

