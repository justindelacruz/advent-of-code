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

const main = (input: string[]): void => {
  const packs = makePacks(input);

  let maxCalories = 0;
  let elfWithMostCalories = null;
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
    `Elf with most calories is ${elfWithMostCalories} with ${maxCalories} calories`
  );
};

const input = readTextFile(inputFilename);
main(input);
