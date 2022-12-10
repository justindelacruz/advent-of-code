// https://adventofcode.com/2022/day/5
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-05.txt";

const parseStackInput = (input: string[]): string[][] => {
  const stacks: string[][] = [];

  input.forEach((line) => {
    if (line.startsWith(" ") || line.startsWith("[")) {
      for (let i = 0; i < line.length; i = i + 4) {
        const crate = line[i + 1];
        const column = i / 4;

        if (!stacks[column]) {
          stacks[column] = [];
        }

        if (/[A-Z]/g.test(crate)) {
          stacks[column].push(crate);
        }
      }
    }
  });

  return stacks;
};

const doRearrangementProcedure9000 = (input: string[], stacks: string[][]) => {
  input.forEach((line) => {
    if (line.startsWith("move")) {
      const result = /move (\d*?) from (\d*?) to (\d*)/.exec(line);
      const [, numToMoveStr, fromStackStr, toStackStr] = result ?? [];

      const numToMove = parseInt(numToMoveStr, 10);
      const fromStack = parseInt(fromStackStr, 10) - 1;
      const toStack = parseInt(toStackStr, 10) - 1;

      for (let i = 0; i < numToMove; i++) {
        // `stacks` is updated in place
        const crate = stacks[fromStack].shift() ?? "";
        stacks[toStack].unshift(crate);
      }
    }
  });
};

const doRearrangementProcedure9001 = (input: string[], stacks: string[][]) => {
  input.forEach((line) => {
    if (line.startsWith("move")) {
      const result = /move (\d*?) from (\d*?) to (\d*)/.exec(line);
      const [, numToMoveStr, fromStackStr, toStackStr] = result ?? [];

      const numToMove = parseInt(numToMoveStr, 10);
      const fromStack = parseInt(fromStackStr, 10) - 1;
      const toStack = parseInt(toStackStr, 10) - 1;

      const cratesToMove = stacks[fromStack].slice(0, numToMove);
      stacks[fromStack] = stacks[fromStack].slice(numToMove);
      stacks[toStack] = cratesToMove.concat(stacks[toStack]);
    }
  });
};

const getCratesAtTop = (stacks: string[][]) => {
  let cratesAtTop = "";

  stacks.forEach((stack) => {
    cratesAtTop += stack[0];
  });

  return cratesAtTop;
};

const partOne = (input: string[]) => {
  const stacks = parseStackInput(input);
  doRearrangementProcedure9000(input, stacks);
  const cratesAtTop = getCratesAtTop(stacks);

  print(`[Part 1] Crates that appear at the top of each stack: ${cratesAtTop}`);
  assert(cratesAtTop === "CFFHVVHNC");
};

const partTwo = (input: string[]) => {
  const stacks = parseStackInput(input);
  doRearrangementProcedure9001(input, stacks);
  const cratesAtTop = getCratesAtTop(stacks);

  print(`[Part 2] Crates that appear at the top of each stack: ${cratesAtTop}`);
  assert(cratesAtTop === "FSZWBPTBG");
};

export default function () {
  const input = readTextFile(inputFilename);

  partOne(input);
  partTwo(input);
}
