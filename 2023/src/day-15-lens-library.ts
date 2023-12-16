// https://adventofcode.com/2023/day/15
import { strict as assert } from "node:assert";
import { print, readTextFile } from "./utils";

const inputFilename = "./inputs/day-15.txt";
const exampleFilename = "./inputs/day-15-example.txt";

const runHash = (input: string, currentValue = 0): number => {
  if (input === "") {
    return currentValue;
  }

  const char = input[0];
  currentValue += char.charCodeAt(0);
  currentValue *= 17;
  currentValue %= 256;

  return runHash(input.substring(1), currentValue);
};

const partOne = (inputs: string[], solution?: number) => {
  const steps = inputs[0].split(",");

  let sum = 0;
  steps.forEach((step) => {
    sum += runHash(step);
  });

  print("");
  print(
    `Run the HASH algorithm on each step in the initialization sequence.
What is the sum of the results`,
  );
  print(sum);

  if (solution) {
    assert(sum === solution);
  }
};

type Box = {
  index: Record<string, number>; // key = two letter step; value = position in box
  lenses: string[];
};

const partTwo = (inputsStr: string[], solution?: number) => {
  const inputs = inputsStr[0].split(",");

  const boxes: Box[] = new Array(256);
  for (let i = 0; i < boxes.length; i++) {
    boxes[i] = {
      index: {},
      lenses: [],
    };
  }

  inputs.forEach((input, i) => {
    const isRemoveOperation = input.slice(-1) === "-";

    const step = isRemoveOperation ? input.slice(0, -1) : input.slice(0, -2);
    const operation = isRemoveOperation ? input.slice(-1) : input.slice(-2, -1);
    const focalLength = input.slice(-1);
    const boxId = runHash(step);
    const box = boxes[boxId];

    // print(input, step, operation, focalLength, boxId);

    if (operation === "=") {
      if (box.index[step] !== undefined) {
        // Item is already in this box. Replace old lens with new lens.
        const index = box.index[step];
        box.lenses[index] = input;
      } else {
        // Add lens to the end of this box
        box.lenses.push(input);
        box.index[step] = box.lenses.length - 1;
      }
    }

    if (operation === "-") {
      // Remove lens from the box
      const index = box.index[step];

      if (index != undefined) {
        box.lenses[index] = "";
        delete box.index[step];
      }
    }
  });

  let totalFocusingPower = 0;
  boxes.forEach((box, boxId) => {
    const cleanBox: string[] = [];
    for (let lens of box.lenses) {
      if (lens !== "") {
        cleanBox.push(lens);
      }
    }

    // print(`${boxId.toString().padEnd(5, " ")}`, cleanBox.join(" "));

    for (let i = 0; i < cleanBox.length; i++) {
      if (cleanBox[i] === "") continue;

      const [, focalLengthStr] = cleanBox[i].split("=");
      const focalLength = parseInt(focalLengthStr, 10);
      const focusingPower = (boxId + 1) * (i + 1) * focalLength;
      // print('   ', boxId + 1, "*", i + 1, "*", focalLength, "=", focusingPower);
      totalFocusingPower += focusingPower;
    }
  });

  print("");
  print(
    `With the help of an over-enthusiastic reindeer in a hard hat,
follow the initialization sequence. What is the focusing power
 of the resulting lens configuration?`,
  );
  print(totalFocusingPower);

  if (solution) {
    assert(totalFocusingPower === solution);
  }
};

export default function (): void {
  const example = readTextFile(exampleFilename);
  const input = readTextFile(inputFilename);

  print("Part 1 (Example) ===============================================");
  partOne(example, 1320);
  print("");

  print("Part 1 =========================================================");
  partOne(input, 505427);
  print("");

  print("Part 2 (Example) ===============================================");
  partTwo(example, 145);
  print("");

  print("Part 2 =========================================================");
  partTwo(input, 243747);
}
