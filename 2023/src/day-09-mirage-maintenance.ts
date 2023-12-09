// https://adventofcode.com/2023/day/9
import { strict as assert } from "node:assert";
import { print, readTextFile } from "./utils";

const inputFilename = "./inputs/day-09.txt";
const exampleFilename = "./inputs/day-09-example.txt";

const getExtrapolatedValuesSum = (values: number[]): number => {
  const extrapolatedValues: number[] = [values[values.length - 1]];

  let currentRow: number[] = [...values];
  let isAllZero;
  while (!isAllZero) {
    isAllZero = true;

    let nextRow: number[] = [];
    let currentValue = currentRow.shift() ?? 0;
    currentRow.forEach((value) => {
      const difference = value - currentValue;
      nextRow.push(difference);
      currentValue = value;
      if (difference !== 0) {
        isAllZero = false;
      }
      currentRow = nextRow;
    });
    extrapolatedValues.push(currentRow[currentRow.length - 1]);
  }

  return extrapolatedValues.reduce((acc, num) => acc + num);
};

const partOne = (inputs: string[], solution?: number) => {
  let sum = 0;
  inputs.forEach((input) => {
    const values = input.split(" ").map((str) => parseInt(str, 10));

    const extrapolatedValuesSum = getExtrapolatedValuesSum(values);
    sum += extrapolatedValuesSum;
  });

  print("What is the sum of these extrapolated values?");
  print(sum);

  if (solution) {
    assert(sum === solution);
  }
};

const partTwo = (inputs: string[], solution?: number) => {
  let sum = 0;
  inputs.forEach((input) => {
    const values = input
      .split(" ")
      .map((str) => parseInt(str, 10))
      .reverse();

    const extrapolatedValuesSum = getExtrapolatedValuesSum(values);
    sum += extrapolatedValuesSum;
  });

  print("What is the sum of these extrapolated values?");
  print(sum);

  if (solution) {
    assert(sum === solution);
  }
};

export default function (): void {
  const example = readTextFile(exampleFilename);
  const input = readTextFile(inputFilename);

  print("Part 1 (Example) ===================");
  partOne(example, 114);
  print("");

  print("Part 1 ============================");
  partOne(input, 2098530125);
  print("");

  print("Part 2 (Example) ===================");
  partTwo(example, 2);
  print("");

  print("Part 2 ===================");
  partTwo(input);
}
