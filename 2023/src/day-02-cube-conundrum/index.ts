// https://adventofcode.com/2023/day/2
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-02.txt";

const partOne = (inputs: string[]) => {
  const allowedCubes: Record<string, number> = {
    red: 12,
    green: 13,
    blue: 14,
  };

  let sum = 0;

  inputs.forEach((input) => {
    let isPossible = true;

    const match = input.match(/Game (\d*): (.*)/);
    // @ts-ignore -- Type 'RegExpMatchArray | null' must have a '[Symbol.iterator]()' method that returns an iterator.
    const [, gameId, subsetsStr] = match;
    const subsets = subsetsStr.split("; ");

    subsets.forEach((subset: string) => {
      const dice = subset.split(", ");
      dice.forEach((die: string) => {
        const [count, color] = die.split(" ");
        if (parseInt(count, 10) > allowedCubes[color]) {
          isPossible = false;
        }
      });
    });

    if (isPossible) {
      sum += parseInt(gameId, 10);
    }
  });

  print("What is the sum of the IDs of those games?");
  print(sum);
  assert(sum === 2156);
};

const partTwo = (inputs: string[]) => {
  let sum = 0;

  inputs.forEach((input) => {
    const minimumCubes: Record<string, number> = {
      red: -Infinity,
      green: -Infinity,
      blue: -Infinity,
    };

    const match = input.match(/Game (\d*): (.*)/);
    // @ts-ignore -- Type 'RegExpMatchArray | null' must have a '[Symbol.iterator]()' method that returns an iterator.
    const [, , subsetsStr] = match;
    const subsets = subsetsStr.split("; ");

    subsets.forEach((subset: string) => {
      const dice = subset.split(", ");
      dice.forEach((die: string) => {
        const [countStr, color] = die.split(" ");
        const count = parseInt(countStr, 10);
        if (count > minimumCubes[color]) {
          minimumCubes[color] = count;
        }
      });
    });

    const power = minimumCubes["red"] * minimumCubes["green"] * minimumCubes["blue"];
    sum += power;
  });

  print("What is the sum of the power of these sets?");
  print(sum);
  assert(sum === 66909);
};

export default function (): void {
  const input = readTextFile(inputFilename);

  print("Part 1:");
  partOne(input);

  print("");
  print("Part 2:");
  partTwo(input);
}
