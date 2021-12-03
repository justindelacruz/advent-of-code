const solvePartOne = (input) => {
  let count = 0;
  let prev = input[0];
  for (const next of input) {
    if (next > prev) {
      count += 1;
    }

    prev = next;
  }

  console.log(count);
};

const solvePartTwo = (input) => {
  let count = 0;
  let prev = input[0];
  const threeSlidingWindow = [];

  for (let i = 0; i < input.length; i++) {
    const sum = (input[i] + input[i+1] + input[i+2]) || 0;
    threeSlidingWindow.push(sum);
  }

  const answer = solvePartOne(threeSlidingWindow);

  console.log(answer);
}


const input = require('./day-1-input.json');
// const input = require('./day-1-sample.json');

// solvePartOne(input);
solvePartTwo(input);
