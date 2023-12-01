const getCommonBits = (input) => input.reduce((acc, value) => {
  for (let i = 0; i < value.length; i++) {
    acc[i] = value[i] === '1' ? (acc[i] || 0) + 1 : (acc[i] || 0);
  }

  return acc;
}, [])

const isMostCommonValue = (value, inputLength) => value >= (inputLength - value);

const getMostCommonBits = (input, inputLength) => input.reduce((acc, value) => {
  const mostCommonBit = isMostCommonValue(value, inputLength) ? 1 : 0;
  acc += mostCommonBit;

  return acc;
}, '');

const getLeastCommonBits = (input, inputLength) => input.reduce((acc, value) => {
  const mostCommonBit = isMostCommonValue(value, inputLength) ? 0 : 1;
  acc += mostCommonBit;

  return acc;
}, '');

const solvePartOne = (input) => {
  const commonBits = getCommonBits(input);
  const mostCommonBits = getMostCommonBits(commonBits, input.length);
  const leastCommonBits = getLeastCommonBits(commonBits, input.length);

  const gammaRate = parseInt(mostCommonBits, 2);
  const epsilonRate = parseInt(leastCommonBits, 2);

  console.log({ gammaRate, epsilonRate, commonBits, mostCommonBits, leastCommonBits })

  return gammaRate * epsilonRate;
}

const solvePartTwo = (input) => {
  // Calculate oxygenGeneratorRating
  let oxygenGeneratorRating = input.slice(); // clone input
  let i = 0;
  do {
    const commonBits = getCommonBits(oxygenGeneratorRating);
    const mostCommonBits = getMostCommonBits(commonBits, oxygenGeneratorRating.length);
    let mostCommonBit = mostCommonBits[i];
    oxygenGeneratorRating = oxygenGeneratorRating.filter(value => value[i] === mostCommonBit);

    console.log({ oxygenGeneratorRating, mostCommonBits, mostCommonBit, i });
    i += 1;
  } while (oxygenGeneratorRating.length > 1 && i < input[0].length)
  oxygenGeneratorRating = parseInt(oxygenGeneratorRating[0], 2);

  // Calculate co2ScrubberRating
  let co2ScrubberRating = input.slice(); // clone input
  i = 0;
  do {
    const commonBits = getCommonBits(co2ScrubberRating);
    const leastCommonBits = getLeastCommonBits(commonBits, co2ScrubberRating.length);
    let mostCommonBit = leastCommonBits[i];
    co2ScrubberRating = co2ScrubberRating.filter(value => value[i] === mostCommonBit);

    console.log({ co2ScrubberRating, leastCommonBits, mostCommonBit, i });
    i += 1;
  } while (co2ScrubberRating.length > 1 && i < input[0].length)
  co2ScrubberRating = parseInt(co2ScrubberRating[0], 2);

  return oxygenGeneratorRating * co2ScrubberRating;
}


// const input = require('./day-3-sample.json');
const input = require('./day-3-input.json');
// const solution = solvePartOne(input);
const solution = solvePartTwo(input);

console.log({ solution })
