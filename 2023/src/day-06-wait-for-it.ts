// https://adventofcode.com/2023/day/6
import { strict as assert } from "node:assert";
import { print, readTextFile } from "./utils";

const inputFilename = "./inputs/day-06.txt";
const sampleFilename = "./inputs/day-06-sample.txt";

type Race = {
  time: number;
  distance: number;
};

const getRacesPartOne = (inputs: string[]): Race[] => {
  const timesMatch = inputs[0].match(/(\d+)/g) ?? [];
  const times = [...timesMatch].map((match) => parseInt(match, 10));
  const distancesMatch = inputs[1].match(/(\d+)/g) ?? [];
  const distances = [...distancesMatch].map((match) => parseInt(match, 10));

  return times.map((time, i) => ({
    time,
    distance: distances[i],
  }));
};

const getRacePartTwo = (inputs: string[]): Race => {
  const timesMatch = inputs[0].match(/(\d)/g) ?? [];
  const timesStr = [...timesMatch].join("");
  const time = parseInt(timesStr, 10);

  const distancesMatch = inputs[1].match(/(\d)/g) ?? [];
  const distancesStr = [...distancesMatch].join("");
  const distance = parseInt(distancesStr, 10);

  return {
    time,
    distance,
  };
};

const getWaysToWin = (races: Race[]): number[] => {
  const waysToWin: number[] = [];

  races.forEach((race) => {
    let numWaysToWin = 0;
    const { time, distance } = race;
    for (let buttonTime = 0; buttonTime <= time; buttonTime++) {
      const remainingTime = time - buttonTime;
      const totalDistance = buttonTime * remainingTime;

      if (totalDistance > distance) {
        numWaysToWin++;
      }
    }

    waysToWin.push(numWaysToWin);
  });

  return waysToWin;
};

const partOne = (inputs: string[], solution?: number) => {
  print("Part 1 ===================");
  const races = getRacesPartOne(inputs);
  const waysToWin: number[] = getWaysToWin(races);
  const answer = waysToWin.reduce((acc, currentValue) => currentValue * acc, 1);

  print("What do you get if you multiply these numbers together?");
  print(answer);

  if (solution) {
    assert(answer === solution);
  }
};

const partTwo = (inputs: string[], solution?: number) => {
  print("Part 2 ===================");

  const race = getRacePartTwo(inputs);
  const waysToWin: number[] = getWaysToWin([race]);
  const answer = waysToWin[0];

  print("How many ways can you beat the record in this one much longer race?");
  print(answer);

  if (solution) {
    assert(answer === solution);
  }
};

export default function (): void {
  const sample = readTextFile(sampleFilename);
  const input = readTextFile(inputFilename);

  partOne(sample, 288);
  print("");
  partOne(input, 2269432);
  print("");
  partTwo(sample, 71503);
  print("");
  partTwo(input);
}
