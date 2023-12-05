// https://adventofcode.com/2023/day/4
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-04.txt";
// const inputFilename = "./inputs/day-04-sample.txt";

const partOne = (inputs: string[]) => {
  print("Part 1:");

  let totalPoints = 0;

  inputs.forEach((input) => {
    const match = input.match(/Card .*: ([\d ]*) \| ([\d ]*)/);
    // @ts-ignore -- Iterator?
    const [, winningNumbersRaw, yourNumbersRaw] = [...match];
    const winningNumbers = winningNumbersRaw.split(" ").filter((number: string) => number !== "");
    const yourNumbers: string[] = yourNumbersRaw
      .split(" ")
      .filter((number: string) => number !== "");

    const numWinningNumbers = yourNumbers.reduce(
      (sum, yourNumber) => (winningNumbers.includes(yourNumber) ? sum + 1 : sum),
      0,
    );

    if (numWinningNumbers > 0) {
      totalPoints += Math.pow(2, numWinningNumbers - 1);
    }
  });

  print("How many points are they worth in total?");
  print(totalPoints);
  assert(totalPoints === 32001);
};

const partTwo = (inputs: string[]) => {
  print("Part 2:");
  print("");

  const scratchcardCopies: Record<number, number> = {};

  inputs.forEach((input, i) => {
    const match = input.match(/Card *(\d*): ([\d ]*) \| ([\d ]*)/);
    // @ts-ignore -- Iterator?
    const [, gameNumber, winningNumbersRaw, yourNumbersRaw] = [...match];
    const winningNumbers = winningNumbersRaw.split(" ").filter((number: string) => number !== "");
    const yourNumbers: string[] = yourNumbersRaw
      .split(" ")
      .filter((number: string) => number !== "");

    const numWinningNumbers = yourNumbers.reduce(
      (sum, yourNumber) => (winningNumbers.includes(yourNumber) ? sum + 1 : sum),
      0,
    );

    const copies = scratchcardCopies[gameNumber] ?? 0;

    // Repeat for each scratchcard copy
    for (let k = 0; k < copies + 1; k++) {
      for (let j = 0; j < numWinningNumbers; j++) {
        const gameIdMatch = inputs[i + j + 1].match(/Card *(\d*)/);
        const [, copiedGameId] = gameIdMatch;

        if (scratchcardCopies[copiedGameId]) {
          scratchcardCopies[copiedGameId] += 1;
        } else {
          scratchcardCopies[copiedGameId] = 1;
        }
      }
    }
  });

  const totalCopies = Object.values(scratchcardCopies).reduce(
    (sum, numCopies) => sum + numCopies,
    0,
  );
  const totalScratchcards = inputs.length + totalCopies;

  print("How many total scratchcards do you end up with?");
  print(totalScratchcards);
  assert(totalScratchcards === 5037841);
};

export default function (): void {
  const input = readTextFile(inputFilename);

  partOne(input);
  print("");
  partTwo(input);
}
