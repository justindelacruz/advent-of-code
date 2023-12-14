// https://adventofcode.com/2023/day/14
import { strict as assert } from "node:assert";
import { print, readTextFile } from "./utils";

const inputFilename = "./inputs/day-14.txt";
const exampleFilename = "./inputs/day-14-example.txt";

const ROUND_ROCK = "O";
const GROUND = ".";
const CUBE_ROCK = "#";

const rotate90 = (inputs: string[]) => {
  const rotatedInput = [];

  for (let i = 0; i < inputs[0].length; i++) {
    let newRow: string = "";
    for (let j = inputs.length - 1; j >= 0; j--) {
      newRow += inputs[j][i];
    }
    rotatedInput.push(newRow);
  }

  rotatedInput.forEach((row, i) => {
    inputs[i] = row;
  });
};

const tiltRight = (inputs: string[]): string[] => {
  const tilted: string[] = [];

  inputs.forEach((rocks, i) => {
    const newRow: string[] = [];

    let numRoundRocks = 0;
    for (let i = 0; i < rocks.length; i++) {
      if (rocks[i] === ROUND_ROCK) {
        numRoundRocks += 1;
      } else if (rocks[i] === GROUND) {
        newRow.push(GROUND);
      } else {
        while (numRoundRocks > 0) {
          newRow.push(ROUND_ROCK);
          numRoundRocks--;
        }
        newRow.push(CUBE_ROCK);
      }
    }

    while (numRoundRocks > 0) {
      newRow.push(ROUND_ROCK);
      numRoundRocks--;
    }

    tilted.push(newRow.join(""));
  });

  return tilted;
};

const calculateLoad = (inputs: string[]): number => {
  let load = 0;

  inputs.forEach((rocks, i) => {
    const numRocks = rocks.split("").filter((rock) => rock === ROUND_ROCK).length;
    load += numRocks * (inputs.length - i);
  });

  return load;
};

const partOne = (inputs: string[], solution?: number) => {
  const rocks = structuredClone(inputs);
  rotate90(rocks);
  const tilted = tiltRight(rocks);
  rotate90(tilted); // reset back to original orientation
  rotate90(tilted); // reset back to original orientation
  rotate90(tilted); // reset back to original orientation
  const totalLoad = calculateLoad(tilted);

  print("");
  print(`Tilt the platform so that the rounded rocks all roll north.
Afterward, what is the total load on the north support beams?`);
  print(totalLoad);

  if (solution) {
    assert(totalLoad === solution);
  }
};

const partTwo = (inputs: string[], solution?: number) => {
  let rocks = structuredClone(inputs);

  const loads: number[] = [];

  let cycles = 125;
  while (cycles > 0) {
    rotate90(rocks);

    const tiltedNorth = tiltRight(rocks);
    rotate90(tiltedNorth);

    const tiltedWest = tiltRight(tiltedNorth);
    rotate90(tiltedWest);

    const tiltedSouth = tiltRight(tiltedWest);
    rotate90(tiltedSouth); // reset board

    const tilted4 = tiltRight(tiltedSouth);

    const load = calculateLoad(tilted4);
    loads.push(load);

    rocks = tilted4;
    cycles--;
  }

  /**
   * I have no idea how to code the actual solution _in code_. However...
   *
   * Brute force: I could just run this code 1000000000 times, but it would have taken hours.
   *
   * I wanted to see if I could spot any patterns that would make this problem easier to solve.
   * So, I inputted the "total loads after each cycle" into a line chart. Like magic, I saw a
   * pattern right away.
   *
   * After a brief period of erratic values, I noticed that the "total loads" followed
   * a perfectly regular wave.
   *
   * In particular:
   *    * The first 80 values showed unpredictable behavior
   *    * Starting from the 81st value, I saw a predictable loop in "total loads"
   *    * The loop repeated every 17 cycles
   *
   * With this information, I can reliably predict any arbitrary "total load after # cycles"
   * using this formula:
   *
   *    total load = (# of cycles - 80) % 17
   *
   * This formula varies depending on the input. For example, in the example input,
   * the formula is more like this:
   *
   *    total load = (# of cycles - 3) % 7
   */
  const startOfLoop = 80;
  const mod = 17;
  const loop = loads.slice(startOfLoop, startOfLoop + mod);

  const targetCycles = 1000000000;
  const targetMod = (targetCycles - 1 - startOfLoop) % mod;
  const totalLoad = loop[targetMod];

  print("");
  print(
    `What number do you get after summarizing the new reflection line
  in each pattern in your notes?`,
  );
  print(totalLoad);

  if (solution) {
    assert(totalLoad === solution);
  }
};

export default function (): void {
  const example = readTextFile(exampleFilename);
  const input = readTextFile(inputFilename);

  print("Part 1 (Example) ===============================================");
  partOne(example, 136);
  print("");

  print("Part 1 =========================================================");
  partOne(input, 109098);
  print("");

  // print("Part 2 (Example) ===============================================");
  // partTwo(example);
  // print("");

  print("Part 2 ===================");
  partTwo(input, 100064);
}
