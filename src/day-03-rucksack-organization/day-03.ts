// https://adventofcode.com/2022/day/3
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-03.txt";

const getPriority = (item: string) => {
  const priority = item.charCodeAt(0);

  // A-Z => ASCII 65-90
  // a-z => ASCII 97-122
  return priority < 97 ? priority - 64 + 26 : priority - 96;
};

const getDuplicatedItem = (aCompartment: string, bCompartment: string): string => {
  const aSet = new Set(aCompartment);
  const bSet = new Set(bCompartment);

  let duplicatedItem = "";
  aSet.forEach((item) => {
    if (bSet.has(item)) {
      duplicatedItem += item;
    }
  });

  return duplicatedItem;
};

const partOne = (input: string[]) => {
  let totalPriority = 0;

  input.forEach((rucksack) => {
    const numItems = rucksack.length;
    const aCompartment = rucksack.slice(0, numItems / 2);
    const bCompartment = rucksack.slice(numItems / 2);

    const duplicatedItem = getDuplicatedItem(aCompartment, bCompartment);
    const priority = getPriority(duplicatedItem);

    totalPriority += priority;
  });

  print(`[Part 1] The sum of the priorities is ${totalPriority}`);
  assert(totalPriority === 7878);
};

const partTwo = (input: string[]) => {
  let totalPriority = 0;

  for (let i = 0; i < input.length; i += 3) {
    const aRucksack = input[i];
    const bRucksack = input[i + 1];
    const cRucksack = input[i + 2];

    const duplicatedItems = getDuplicatedItem(aRucksack, bRucksack);
    const badge = getDuplicatedItem(duplicatedItems, cRucksack);
    const priority = getPriority(badge);

    totalPriority += priority;
  }

  print(`[Part 2] The sum of the priorities is ${totalPriority}`);
  assert(totalPriority === 2760);
};

export default function () {
  const input = readTextFile(inputFilename);

  partOne(input);
  partTwo(input);
}
