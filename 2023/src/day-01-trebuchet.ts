// https://adventofcode.com/2023/day/1
import { strict as assert } from "node:assert";
import { print, readTextFile } from "./utils";

const inputFilename = "./inputs/day-01.txt";

const partOne = (input: string[]) => {
  let sum = 0;

  input.forEach((line) => {
    const lineArr = line.split("");
    const firstDigit = lineArr.find((c) => /\d/.test(c)) ?? "0";
    lineArr.reverse();
    const lastDigit = lineArr.find((c) => /\d/.test(c)) ?? "0";

    const calibrationValue = firstDigit + lastDigit;
    sum += parseInt(calibrationValue, 10);
  });

  print("What is the sum of all of the calibration values?");
  print(sum);
  assert(sum === 55488);
};

const numberTokens: Record<string, string> = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
};

const getDigit = (line: string): Record<string, string> => {
  let lowestPosition = Infinity;
  let highestPosition = -Infinity;
  let lowestDigitToken = "";
  let highestDigitToken = "";

  const tokens = Object.keys(numberTokens);
  tokens.forEach((token) => {
    const match = line.matchAll(new RegExp(token, "g"));
    const results = [...match];

    const firstResult = results[0];
    const lastResult = results[results.length - 1];

    if (results.length) {
      if (firstResult.index !== undefined && firstResult.index < lowestPosition) {
        lowestPosition = firstResult.index;
        lowestDigitToken = token;
      }
      if (lastResult.index !== undefined && lastResult.index > highestPosition) {
        highestPosition = lastResult.index;
        highestDigitToken = token;
      }
    }
  });

  return {
    firstDigit: numberTokens[lowestDigitToken],
    lastDigit: numberTokens[highestDigitToken],
  };
};

const partTwo = (input: string[]) => {
  let sum = 0;

  input.forEach((line) => {
    const { firstDigit, lastDigit } = getDigit(line);
    const calibrationValue = firstDigit + lastDigit;
    print(calibrationValue);
    sum += parseInt(calibrationValue, 10);
  });

  print("What is the sum of all of the calibration values?");
  print(sum);
  assert(sum === 55614);
};

export default function (): void {
  const input = readTextFile(inputFilename);

  print("Part 1:");
  partOne(input);

  print("");
  print("Part 2:");
  partTwo(input);
}
