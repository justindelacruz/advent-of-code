const { parentPort, workerData } = require("worker_threads");

const findLocation = (maps, seed) => {
  let currentValue = seed;

  Object.entries(maps).forEach(([, mapEntries]) => {
    let hasMapping = false;

    mapEntries.forEach(({ sourceStart, destinationStart, rangeLength }) => {
      if (!hasMapping && currentValue >= sourceStart && currentValue < sourceStart + rangeLength) {
        const diff = currentValue - sourceStart;
        currentValue = destinationStart + diff;
        hasMapping = true;
      }
    });
  });

  return currentValue;
};

const { seedRanges, maps } = workerData;

let lowestLocation = Infinity;

seedRanges.forEach(({ start, length }) => {
  console.log(start, length);
  for (let seed = start; seed < start + length; seed++) {
    const location = findLocation(maps, seed);
    lowestLocation = Math.min(lowestLocation, location);
  }
});

parentPort.postMessage(lowestLocation);
