import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-03.txt";

const getPriority = (item: string) => {
  const priority = item.charCodeAt(0);

  // A-Z => ASCII 65-90
  // a-z => ASCII 97-122
  return priority < 97 ? priority - 64 + 26: priority - 96;
};

const getDuplicatedItem = (
  aCompartment: string,
  bCompartment: string
): string => {
  const aSet = new Set(aCompartment);
  const bSet = new Set(bCompartment);

  let duplicatedItem = "";
  aSet.forEach((item) => {
    if (bSet.has(item)) {
      duplicatedItem = item;
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

    print(duplicatedItem, priority);

    totalPriority += priority;
  });

  print(`The sum of the priorities is ${totalPriority}`);
};

export default function () {
  const input = readTextFile(inputFilename);

  partOne(input);
}
