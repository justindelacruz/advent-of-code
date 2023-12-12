// https://adventofcode.com/2023/day/12
import { strict as assert } from "node:assert";
import { print, readTextFile } from "./utils";

const inputFilename = "./inputs/day-12.txt";
const exampleFilename = "./inputs/day-12-example.txt";

const getDamagedGroups = (springs: string[]): string[] => {
  const springsStr = springs.join("");
  const match = springsStr.match(/(#+)/g) ?? [];
  return [...match];
};

const getIsValidArrangement = (damagedGroups: string[], groups: number[]): boolean => {
  if (damagedGroups.length !== groups.length) return false;

  let isValidArrangement = true;
  for (let i = 0; i < groups.length; i++) {
    if (damagedGroups[i].length !== groups[i]) {
      isValidArrangement = false;
      break;
    }
  }

  return isValidArrangement;
};

const getUnknownIndexes = (springs: string): number[] => {
  const matchIndexes: number[] = [];

  const matches = springs.matchAll(/\?/g);
  for (let match of matches) {
    matchIndexes.push(match.index ?? -1);
  }

  return matchIndexes;
};

const permute = (length: number) => {
  const results: Set<string> = new Set();
  const intermediates: Set<string> = new Set();

  const recursive = (result: string[]) => {
    if (intermediates.has(result.join(""))) return;
    intermediates.add(result.join(""));

    if (result.length === length) {
      results.add(result.join(""));
      return;
    }

    for (let i = 0; i < length; i++) {
      result.push("#");
      recursive(result);
      result.pop();
    }

    for (let i = 0; i < length; i++) {
      result.push(".");
      recursive(result);
      result.pop();
    }
  };

  recursive([]);

  return results;
};

const getNumValidArrangements = (
  springs: string[],
  groups: number[],
  unknownIndexes: number[],
  permutations: Set<string>,
): number => {
  let numValidArrangements = 0;
  for (let permutation of permutations) {
    const test = [...springs];
    for (let i = 0; i < unknownIndexes.length; i++) {
      test[unknownIndexes[i]] = permutation[i];
    }
    const damagedGroups = getDamagedGroups(test);
    const isValidArrangement = getIsValidArrangement(damagedGroups, groups);

    if (isValidArrangement) {
      numValidArrangements += 1;
    }
  }

  return numValidArrangements;
};

const partOne = (inputs: string[], solution?: number) => {
  let sumValidArrangements = 0;
  inputs.forEach((input, i) => {
    const [springsStr, groupsStr] = input.split(" ");
    const springs = springsStr.split("");
    const groups = groupsStr.split(",").map((str) => parseInt(str, 10));
    const unknownIndexes = getUnknownIndexes(springsStr);

    print("");
    print(i);
    print(springsStr);
    print("groups", groups.join(" "));
    print("unknownIndexes", unknownIndexes.join(" "));

    const permutations = permute(unknownIndexes.length);

    const numValidArrangements = getNumValidArrangements(
      springs,
      groups,
      unknownIndexes,
      permutations,
    );

    sumValidArrangements += numValidArrangements;
  });

  print(`For each row, count all of the different arrangements of
operational and broken springs that meet the given criteria.
What is the sum of those counts?
`);
  print(sumValidArrangements);

  if (solution) {
    assert(sumValidArrangements === solution);
  }
};

const partTwo = (inputs: string[], solution?: number) => {
  let sumValidArrangements = 0;
  inputs.forEach((input, i) => {
    const [springsStr, groupsStr] = input.split(" ");
    const springs = springsStr.split("");
    const groups = groupsStr.split(",").map((str) => parseInt(str, 10));
    const springs5 = [...springs, ...springs, ...springs, ...springs, ...springs];
    const groups5 = [...groups, ...groups, ...groups, ...groups, ...groups];
    const unknownIndexes = getUnknownIndexes(springs5.join(""));

    print("");
    print(i);
    print(springs5.join(""));
    print("groups", groups5.join(" "));
    print("unknownIndexes", unknownIndexes.join(" "));

    const permutations = permute(unknownIndexes.length);

    const numValidArrangements = getNumValidArrangements(
      springs5,
      groups5,
      unknownIndexes,
      permutations,
    );

    sumValidArrangements += numValidArrangements;
  });

  print(`For each row, count all of the different arrangements of
operational and broken springs that meet the given criteria.
What is the sum of those counts?
`);
  print(sumValidArrangements);
};

export default function (): void {
  const example = readTextFile(exampleFilename);
  const input = readTextFile(inputFilename);

  // print("Part 1 (Example) ===================");
  // partOne(example, 21);
  // print("");
  // print("");

  // print("Part 1 ============================");
  // partOne(input, 7379);

  print("Part 2 (Example) ===================");
  partTwo(example);
  print("");
  //
  // print("Part 2 ===================");
  // partTwo(input, 413);
}
