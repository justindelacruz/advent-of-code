// https://adventofcode.com/2023/day/5
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";
import { Worker } from "worker_threads";

const inputFilename = "./inputs/day-05.txt";
const exampleFilename = "./inputs/day-05-example.txt";

export type MapType =
  | "seed-to-soil"
  | "soil-to-fertilizer"
  | "fertilizer-to-water"
  | "water-to-light"
  | "light-to-temperature"
  | "temperature-to-humidity"
  | "humidity-to-location";

export type MapEntry = {
  destinationStart: number;
  sourceStart: number;
  rangeLength: number;
};

const originalMaps: Record<MapType, MapEntry[]> = {
  "seed-to-soil": [],
  "soil-to-fertilizer": [],
  "fertilizer-to-water": [],
  "water-to-light": [],
  "light-to-temperature": [],
  "temperature-to-humidity": [],
  "humidity-to-location": [],
};

const sortBySourceStartFn = (a: MapEntry, b: MapEntry) => {
  if (a.sourceStart < b.sourceStart) return -1;
  if (a.sourceStart > b.sourceStart) return 1;
  return 0;
};

const generateMaps = (almanac: string[]): Record<MapType, MapEntry[]> => {
  const resultMap = structuredClone(originalMaps);

  let currentMap: MapType;
  almanac.forEach((input) => {
    if (input === "") {
      return;
    }

    const mapNameMatch = input.match(/(.*) map:/) ?? [];
    const [, mapName] = mapNameMatch;

    if (mapName) {
      currentMap = mapName as MapType;
      return;
    }

    const mapValuesMatch = input.match(/(\d*) (\d*) (\d*)/) ?? [];
    const [, destinationStart, sourceStart, rangeLength] = [...mapValuesMatch];

    resultMap[currentMap].push({
      destinationStart: parseInt(destinationStart, 10),
      sourceStart: parseInt(sourceStart, 10),
      rangeLength: parseInt(rangeLength, 10),
    });

    resultMap[currentMap].sort(sortBySourceStartFn);
  });

  return resultMap;
};

const getSeeds = (seedsStr?: string): number[] => {
  const seedsMatch = seedsStr?.matchAll(/\d*/g) ?? [];
  const seeds = [];
  for (const match of seedsMatch) {
    if (Boolean(match[0])) {
      seeds.push(parseInt(match[0], 10));
    }
  }

  return seeds;
};

export type SeedRange = {
  start: number;
  length: number;
};
const getSeedRanges = (seedsStr?: string): SeedRange[] => {
  const seedRangesMatch = seedsStr?.matchAll(/\d+ \d+/g) ?? [];
  const seedRanges: SeedRange[] = [];
  for (const match of seedRangesMatch) {
    const [start, length] = match[0].split(" ");
    seedRanges.push({
      start: parseInt(start, 10),
      length: parseInt(length, 10),
    });
  }

  return seedRanges;
};

export const findLocation = (maps: Record<MapType, MapEntry[]>, seed: number): number => {
  let currentValue = seed;

  Object.entries(maps).forEach(([, mapEntries]) => {
    let hasMapping = false;
    // print(mapName);

    mapEntries.forEach(({ sourceStart, destinationStart, rangeLength }) => {
      if (!hasMapping && currentValue >= sourceStart && currentValue < sourceStart + rangeLength) {
        const diff = currentValue - sourceStart;
        // print("  Has match", currentValue, destinationStart + diff);
        currentValue = destinationStart + diff;
        hasMapping = true;
      }
    });

    // if (!hasMapping) {
    // print("  No match", currentValue, currentValue);
    // }
  });

  return currentValue;
};

const partOne = (inputs: string[], solution?: number) => {
  print("Part 1:");

  const almanac = [...inputs];
  const seedsStr = almanac.shift();
  const seeds = getSeeds(seedsStr);
  const maps = generateMaps(almanac);

  let lowestLocation = Infinity;

  seeds.forEach((seed) => {
    const location = findLocation(maps, seed);
    lowestLocation = Math.min(lowestLocation, location);
  });

  print("What is the lowest location number that corresponds to any of the initial seed numbers?");
  print(lowestLocation);
  assert(lowestLocation === solution);
};

const partTwo = (inputs: string[], solution?: number) => {
  print("Part 2:");
  print("");

  const almanac = [...inputs];
  const seedsStr = almanac.shift();
  const seedRanges = getSeedRanges(seedsStr);
  const maps = generateMaps(almanac);

  let lowestLocation = Infinity;
  seedRanges.forEach(({ start, length }) => {
    print(start, length);
    for (let seed = start; seed < start + length; seed++) {
      const location = findLocation(maps, seed);
      lowestLocation = Math.min(lowestLocation, location);
    }
  });

  print("What is the lowest location number that corresponds to any of the initial seed numbers?");
  print(lowestLocation);

  if (solution) {
    assert(lowestLocation === solution);
  }
};

const THREAD_COUNT = 4;
const createWorker = (seedRanges: SeedRange[], maps: Record<MapType, MapEntry[]>) => {
  return new Promise(function (resolve, reject) {
    const worker = new Worker("./src/day-05-if-you-give-a-seed-a-fertilizer/worker.ts", {
      workerData: { thread_count: THREAD_COUNT, seedRanges, maps },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (msg) => {
      reject(`An error occurred: ${msg}`);
    });
  });
};

const partTwoThreaded = async (inputs: string[], solution?: number) => {
  print("Part 2:");
  print("");

  const almanac = [...inputs];
  const seedsStr = almanac.shift();
  const seedRanges = getSeedRanges(seedsStr);
  const maps = generateMaps(almanac);

  print(seedRanges);

  const workerPromises = [];
  print("Starting workers");
  workerPromises.push(createWorker(seedRanges.slice(0, 2), maps));
  workerPromises.push(createWorker(seedRanges.slice(2, 4), maps));
  workerPromises.push(createWorker(seedRanges.slice(4, 6), maps));
  workerPromises.push(createWorker(seedRanges.slice(6, 8), maps));
  workerPromises.push(createWorker(seedRanges.slice(8, 10), maps));
  const threadResults = (await Promise.all(workerPromises)) as number[];
  print(threadResults);

  const lowestLocation = Math.min(...threadResults);
  print("What is the lowest location number that corresponds to any of the initial seed numbers?");
  print(lowestLocation);

  if (solution) {
    assert(lowestLocation === solution);
  }
};

export default function (): void {
  const example = readTextFile(exampleFilename);
  const input = readTextFile(inputFilename);

  partOne(example, 35);
  partOne(input, 424490994);
  print("");
  // partTwo(input, 15290096);
  // partTwoThreaded(example, 46);
  partTwoThreaded(input, 15290096);
}
