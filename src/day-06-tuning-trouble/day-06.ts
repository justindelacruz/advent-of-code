// https://adventofcode.com/2022/day/5
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-06.txt";

const findMarker = (datastream: string[], numDistinctChars: number): number => {
  const buffer: string[] = [];
  let index = 0;

  while (datastream.length) {
    const marker = datastream.shift() ?? "";
    if (buffer.length === numDistinctChars) {
      buffer.shift();
    }
    buffer.push(marker);
    index++;
    if (checkBuffer(buffer, numDistinctChars)) {
      break;
    }
  }

  return index;
};

const checkBuffer = (buffer: string[], numDistinctChars: number) => {
  const set = new Set(buffer);

  return set.size === numDistinctChars;
};

const partOne = (input: string[]) => {
  const datastream = Array.from(input[0]);
  const index = findMarker(datastream, 4);

  print(
    `[Part 1] Number of characters that need to be processed 
    before the start-of-packet marker is detected: ${index}`
  );
  assert(index === 1275);
};

const partTwo = (input: string[]) => {
  const datastream = Array.from(input[0]);
  const index = findMarker(datastream, 14);

  print(
    `[Part 2] Number of characters that need to be processed 
    before the start-of-message marker is detected: ${index}`
  );
  assert(index === 3605);
};

export default function () {
  const input = readTextFile(inputFilename);

  partOne(input);
  partTwo(input);
}
