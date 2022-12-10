// https://adventofcode.com/2022/day/1
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-1.txt";

type Packs = number[][];

const makePacks = (input: string[]): Packs => {
  const packs: Packs = [];

  let pack: number[] = [];
  input.forEach((calories, index) => {
    if (calories === "") {
      packs.push(pack);
      pack = [];
    } else {
      pack.push(parseInt(calories, 10));
    }
  });

  return packs;
};

const partOne = () => {
  const packs = makePacks(input);

  let maxCalories = 0;
  let elfWithMostCalories: number = -1;
  packs.forEach((pack, elfIndex) => {
    const totalCalories = pack.reduce((acc, currentValue) => {
      return acc + currentValue;
    }, 0);

    if (totalCalories > maxCalories) {
      maxCalories = totalCalories;
      elfWithMostCalories = elfIndex + 1;
    }
  });

  print(
    `[Part 1] Elf with most calories is ${elfWithMostCalories} with ${maxCalories} calories`
  );
};

type ElfInventory = { elf: number; totalCalories: number };
type ElfInventories = { elf: number; totalCalories: number }[];

const partTwo = () => {
  const packs = makePacks(input);

  const elfInventory: ElfInventories = [];
  packs.forEach((pack, elfIndex) => {
    const totalCalories = pack.reduce((acc, currentValue) => {
      return acc + currentValue;
    }, 0);
    elfInventory.push({ elf: elfIndex, totalCalories: totalCalories });
  });

  const compareElves = (a: ElfInventory, b: ElfInventory) => {
    if (a.totalCalories > b.totalCalories) {
      return 1;
    }
    if (a.totalCalories < b.totalCalories) {
      return -1;
    }
    return 0;
  };
  elfInventory.sort(compareElves);

  const topThreeElvesInventory = elfInventory.slice(-3);
  const topCalories = topThreeElvesInventory.reduce((acc, currentValue) => {
    return acc + currentValue.totalCalories;
  }, 0);

  print(`[Part 2] The top 3 elves are carrying ${topCalories} calories`);
};

const main = (input: string[]): void => {
  partOne();
  partTwo();
};

const input = readTextFile(inputFilename);
main(input);
