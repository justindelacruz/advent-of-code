const solvePartOne = (input) => {
  console.log(input);

  let aim = 0;
  let depth = 0;
  let position = 0; // horizontal position

  for (let i = 0; i < input.length; i++) {
    let [command, unit] = input[i].split(' ');
    const numUnit = parseInt(unit, 10);

    switch (command) {
      case 'forward': {
        position += numUnit;
        depth += aim * numUnit;
        break;
      }
      case 'up': {
        aim -= numUnit;
        break;
      }
      case 'down': {
        aim += numUnit;
        break;
      }
    }
    console.log(command, numUnit);
  }
  console.log({ depth, position });

  console.log('depth x position', depth * position);
}

// const input = require('./day-2-sample.json');
const input = require('./day-2-input.json');
solvePartOne(input);
