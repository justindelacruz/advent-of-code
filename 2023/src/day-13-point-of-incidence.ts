// https://adventofcode.com/2023/day/13
import { strict as assert } from "node:assert";
import { print, readTextFile } from "./utils";

const inputFilename = "./inputs/day-13.txt";
const exampleFilename = "./inputs/day-13-example.txt";

type Pattern = string[];

const getPatterns = (inputs: string[]): Pattern[] => {
  const patterns: Pattern[] = [];

  let currentPattern: Pattern = [];
  inputs.forEach((input) => {
    if (input === "") {
      patterns.push(currentPattern);
      currentPattern = [];
    } else {
      currentPattern.push(input);
    }
  });

  patterns.push(currentPattern);

  return patterns;
};

const calculateDistance = (str1: string, str2: string): number | null => {
  if (!str2) return -1;

  let distance = 0;
  let smudgePosition = -1;

  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) {
      distance += 1;
      smudgePosition = i;
    }
  }

  return distance === 1 ? smudgePosition : null;
};

const generateSmudgedVariants = (pattern: Pattern): Pattern[] => {
  const smudgedPatterns: Pattern[] = [];

  for (let i = 0; i < pattern.length; i++) {
    for (let j = i + 1; j < pattern.length; j++) {
      let currentRow = pattern[i];
      let otherRow = pattern[j];
      const smudgePosition = calculateDistance(currentRow, otherRow);

      if (smudgePosition !== null) {
        // Swap the character in the "current row"
        const variantA = structuredClone(pattern);
        variantA[i] =
          currentRow.substring(0, smudgePosition) +
          (currentRow[smudgePosition] === "#" ? "." : "#") +
          currentRow.substring(1 + smudgePosition);
        smudgedPatterns.push(variantA);

        // Swap the character in the "other row"
        const variantB = structuredClone(pattern);
        variantB[i] =
          otherRow.substring(0, smudgePosition) +
          (otherRow[smudgePosition] === "#" ? "." : "#") +
          otherRow.substring(1 + smudgePosition);
        smudgedPatterns.push(variantB);
      }
    }
  }

  return smudgedPatterns;
};

const findHorizontalReflection = (pattern: Pattern, exclude?: number) => {
  let isHorizontalReflection = false;

  let horizontalLine = -1;
  for (let i = 0; i < pattern.length; i++) {
    let currentRow = pattern[i];
    let nextRow = pattern?.[i + 1];

    if (currentRow === nextRow) {
      print("Found reflection line", i, i + 1);
      let r = 1; // reflection distance
      let isMatch = true;
      while (i - r >= 0 && i + 1 + r < pattern.length) {
        if (pattern[i - r] !== pattern[i + 1 + r]) {
          isMatch = false;
          break;
        }
        r++;
      }

      if (isMatch && i + 1 !== exclude) {
        isHorizontalReflection = true;
        horizontalLine = i + 1;
        break;
      }
    }
  }

  if (isHorizontalReflection) {
    print(horizontalLine);
    print("");
  }

  return isHorizontalReflection ? horizontalLine : -1;
};

const rotate90 = (pattern: Pattern): Pattern => {
  const newPattern = [];

  for (let i = 0; i < pattern[0].length; i++) {
    let newRow: string = "";
    for (let j = 0; j < pattern.length; j++) {
      newRow += pattern[j][i];
    }
    newPattern.push(newRow);
  }

  return newPattern;
};

const partOne = (inputs: string[], solution?: number) => {
  const patterns = getPatterns(inputs);

  let sum = 0;

  patterns.forEach((pattern) => {
    const horizontalLine = findHorizontalReflection(pattern);
    const rotatedPattern = rotate90(pattern);
    const verticalLine = findHorizontalReflection(rotatedPattern);

    if (verticalLine === -1 && horizontalLine === -1) {
      print(pattern);
      print(rotatedPattern);
      throw new Error("Pattern did not have a match");
    }

    if (verticalLine > -1) {
      sum += verticalLine;
    } else if (horizontalLine > -1) {
      sum += 100 * horizontalLine;
    }
  });

  print("");
  print(`Find the line of reflection in each of the patterns in your notes.
What number do you get after summarizing all of your notes?`);
  print(sum);

  if (solution) {
    assert(sum === solution);
  }
};

const partTwo = (inputs: string[], solution?: number) => {
  const patterns = getPatterns(inputs);

  let sum = 0;

  patterns.forEach((pattern) => {
    const rotatedPattern = rotate90(pattern);
    const horizontalSmudgedVariants = generateSmudgedVariants(pattern);
    const verticalSmudgedVariants = generateSmudgedVariants(rotatedPattern);

    if (horizontalSmudgedVariants.length === 0 && verticalSmudgedVariants.length === 0) {
      throw new Error("No variants found");
    }

    // Check original solution
    const originalHorizontalLine = findHorizontalReflection(pattern);
    const originalVerticalLine = findHorizontalReflection(rotatedPattern);

    // Checking vertical smudges
    for (let smudgedVariant of verticalSmudgedVariants) {
      const line = findHorizontalReflection(smudgedVariant, originalVerticalLine);

      if (line === -1) {
        print("Pattern did not have a match");
        continue;
      }

      if (line > -1 && line !== originalVerticalLine) {
        sum += line;
        break;
      }
    }

    // Check horizontal smudges
    for (let smudgedVariant of horizontalSmudgedVariants) {
      const line = findHorizontalReflection(smudgedVariant, originalHorizontalLine);

      if (line === -1) {
        print("Pattern did not have a match");
        continue;
      }

      if (line > -1 && line !== originalHorizontalLine) {
        sum += 100 * line;
      }
      break;
    }
  });

  print("");
  print(
    `What number do you get after summarizing the new reflection line
in each pattern in your notes?`,
  );
  print(sum);

  if (solution) {
    assert(sum === solution);
  }
};

export default function (): void {
  const example = readTextFile(exampleFilename);
  const input = readTextFile(inputFilename);

  print("Part 1 (Example) ===================");
  partOne(example, 405);
  print("");

  print("Part 1 ============================");
  partOne(input, 32723);

  print("Part 2 (Example) ===================");
  partTwo(example, 400);
  print("");

  print("Part 2 ===================");
  partTwo(input, 34536);
}
