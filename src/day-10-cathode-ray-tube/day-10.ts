// https://adventofcode.com/2022/day/10
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-10.txt";

const Operations = {
  noop: "noop",
  addx: "addx",
} as const;
type OperationKeys = keyof typeof Operations;

const OperationCycles: Record<OperationKeys, number> = {
  noop: 1,
  addx: 2,
} as const;

const partOne = (inputs: string[]) => {
  let cycle = 0;
  let x = 1; // "X" CPU register
  const signalStrengths: number[] = [];

  inputs.forEach((input) => {
    const [operation, valueStr] = input.split(" ") as [OperationKeys, string];

    const cyclesForOperation = OperationCycles[operation];
    for (let i = 0; i < cyclesForOperation; i++) {
      // Increase cycle count
      cycle += 1;

      // Update signal strengths
      if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
        signalStrengths.push(cycle * x);
      }
    }

    if (operation === Operations.addx) {
      const value = parseInt(valueStr, 10);
      x += value;
    }
  });

  const signalStrengthSum = signalStrengths.reduce((acc, currentValue) => acc + currentValue, 0);
  print(`[Part 1] The sum of these signal strengths is ${signalStrengthSum}`);
  console.assert(signalStrengthSum === 17380);
};

const partTwo = (inputs: string[]) => {
  const crtRowWidth = 40;
  let cycle = 0;
  let x = 1; // "X" CPU register
  let render = "";

  inputs.forEach((input) => {
    const [operation, valueStr] = input.split(" ") as [OperationKeys, string];
    const cyclesForOperation = OperationCycles[operation];

    for (let i = 0; i < cyclesForOperation; i++) {
      // Add line break at the end of a CRT line
      if (cycle > 0 && cycle % crtRowWidth === 0) {
        render += "\n";
      }

      // Render 3-pixel wide character, if needed
      if (Math.abs((cycle % crtRowWidth) - x) <= 1) {
        render += "#";
      } else {
        render += ".";
      }

      // Increase cycle count
      cycle += 1;
    }

    if (operation === Operations.addx) {
      const value = parseInt(valueStr, 10);
      x += value;
    }
  });

  print(render);
  assert(
    render ===
      `####..##...##..#..#.####.###..####..##..
#....#..#.#..#.#..#....#.#..#.#....#..#.
###..#....#....#..#...#..#..#.###..#....
#....#.##.#....#..#..#...###..#....#....
#....#..#.#..#.#..#.#....#.#..#....#..#.
#.....###..##...##..####.#..#.####..##..`
  );
};

export default function () {
  const inputs = readTextFile(inputFilename);

  partOne(inputs);
  partTwo(inputs);
}
