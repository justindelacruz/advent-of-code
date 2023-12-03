// https://adventofcode.com/2023/day/3
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-03.txt";
// const inputFilename = "./inputs/day-03-sample.txt";

const isDigit = (c: string) => {
  return /\d/.test(c);
};

const makeNumberBoard = (inputs: string[]): string[][] => {
  const rows = inputs.length;
  const board = new Array(rows);

  for (let i = 0; i < board.length; i++) {
    board[i] = new Array(inputs[0].length);
  }

  return board;
};

const getBoardValue = (inputs: string[], row: number, col: number, result = ""): string => {
  if (isDigit(inputs[row][col])) {
    return getBoardValue(inputs, row, col + 1, result + inputs[row][col]);
  }

  return result;
};

const fillNumberBoard = (inputs: string[], board: string[][]) => {
  for (let row = 0; row < inputs.length; row++) {
    const input = inputs[row];
    let prevValue: string | null = null;
    for (let col = 0; col < input.length; col++) {
      const value = getBoardValue(inputs, row, col);

      if (value === "") {
        // No number found; reset prevValue
        prevValue = null;
        continue;
      }

      if (prevValue) {
        // Continuation of a number
        board[row][col] = prevValue;
      } else {
        // Start of a new number
        const newValue = value;
        board[row][col] = newValue;
        prevValue = newValue;
      }
    }
  }
};

const partOne = (inputs: string[]) => {
  const board = makeNumberBoard(inputs);
  fillNumberBoard(inputs, board);

  const partNumbers: string[] = [];

  for (let row = 0; row < inputs.length; row++) {
    const input = inputs[row];
    for (let col = 0; col < input.length; col++) {
      const isSymbol = /[^\d^.]/.test(input[col]);
      if (isSymbol) {
        const localParts: Set<string> = new Set();

        localParts.add(board?.[row - 1]?.[col - 1]); // top left
        localParts.add(board?.[row - 1]?.[col]); // top
        localParts.add(board?.[row - 1]?.[col + 1]); // top right
        localParts.add(board?.[row]?.[col - 1]); // left
        localParts.add(board?.[row]?.[col + 1]); // right
        localParts.add(board?.[row + 1]?.[col - 1]); // bottom left
        localParts.add(board?.[row + 1]?.[col]); // bottom
        localParts.add(board?.[row + 1]?.[col + 1]); // bottom right

        localParts.forEach((localPart) => {
          partNumbers.push(localPart);
        });
      }
    }
  }

  let sum = 0;
  partNumbers.forEach((partNumber) => {
    if (partNumber !== undefined) {
      sum += parseInt(partNumber, 10);
    }
  });

  print("What is the sum of all of the part numbers in the engine schematic?");
  print(sum);
  assert(sum == 559667);
};

const partTwo = (inputs: string[]) => {
  const board = makeNumberBoard(inputs);
  fillNumberBoard(inputs, board);

  const gearRatios: number[] = [];

  for (let row = 0; row < inputs.length; row++) {
    const input = inputs[row];
    for (let col = 0; col < input.length; col++) {
      const value = input[col];
      const isSymbol = /[^\d^.]/.test(value);
      if (isSymbol) {
        const localParts: Set<string> = new Set();
        localParts.add(board?.[row - 1]?.[col - 1]); // top left
        localParts.add(board?.[row - 1]?.[col]); // top
        localParts.add(board?.[row - 1]?.[col + 1]); // top right
        localParts.add(board?.[row]?.[col - 1]); // left
        localParts.add(board?.[row]?.[col + 1]); // right
        localParts.add(board?.[row + 1]?.[col - 1]); // bottom left
        localParts.add(board?.[row + 1]?.[col]); // bottom
        localParts.add(board?.[row + 1]?.[col + 1]); // bottom right

        let numAdjacentParts = 0;
        if (value === "*") {
          localParts.forEach((localPart) => {
            if (localPart !== undefined) {
              numAdjacentParts += 1;
            }
          });
        }

        if (numAdjacentParts === 2) {
          const parts = [...localParts.values()].filter(Boolean);
          const gearRatio = parseInt(parts[0], 10) * parseInt(parts[1], 10);
          gearRatios.push(gearRatio);
        }
      }
    }
  }

  let sum = 0;
  gearRatios.forEach((gearRatio) => {
    if (gearRatio !== undefined) {
      sum += gearRatio;
    }
  });

  print("What is the sum of all of the gear ratios in your engine schematic?");
  print(sum);
  assert(sum == 86841457);
};

export default function (): void {
  const input = readTextFile(inputFilename);

  print("Part 1:");
  partOne(input);

  print("");
  print("Part 2:");
  partTwo(input);
}
