// https://adventofcode.com/2023/day/11
import { strict as assert } from "node:assert";
import { print, readTextFile } from "./utils";
import exp from "node:constants";

const inputFilename = "./inputs/day-11.txt";
const exampleFilename = "./inputs/day-11-example.txt";

type Map = string[][];

const expandSpace = (inputs: string[], filler = "."): Map => {
  let expandedMap: Map = [];

  // Expand vertically
  inputs.forEach((inputStr, i) => {
    const inputs = inputStr.split("");
    expandedMap.push(inputs);
    if (inputs.every((item) => item === ".")) {
      expandedMap.push(new Array(inputStr.length).fill(filler));
    }
  });

  // Find empty columns
  const emptyColumns = [];
  for (let j = 0; j < inputs[0].length; j++) {
    const column = inputs.map((row) => row[j]);
    if (column.every((item) => [".", filler].includes(item))) {
      emptyColumns.push(j);
    }
  }

  // Expand horizontally
  for (let i = 0; i < expandedMap.length; i++) {
    let newRow: string[] = [];
    let start = 0;
    emptyColumns.forEach((col) => {
      newRow = [...newRow, ...expandedMap[i].slice(start, col), filler];
      start = col;
    });
    newRow = [...newRow, ...expandedMap[i].slice(start)];
    expandedMap[i] = newRow;
  }

  return expandedMap;
};

type Galaxy = {
  id: number;
  row: number;
  col: number;
};
const findGalaxies = (map: Map): Galaxy[] => {
  const galaxies: Galaxy[] = [];
  let galaxyId = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === "#") {
        galaxyId += 1;
        galaxies.push({
          id: galaxyId,
          row: i,
          col: j,
        });
      }
    }
  }

  return galaxies;
};

const findShortestPaths = (galaxies: Galaxy[], map: Map, multiplier: number): number[][] => {
  const shortestPaths: number[][] = new Array(galaxies.length);
  for (let i = 0; i < shortestPaths.length; i++) {
    shortestPaths[i] = [];
  }

  galaxies.forEach((galaxy, i) => {
    // print("");
    // print(`Galaxy ${galaxy.id} is at (${galaxy.row}, ${galaxy.col})`);

    // Find distance to each galaxy
    galaxies.forEach((otherGalaxy, j) => {
      if (
        shortestPaths[j][i] ||
        (galaxy.row === otherGalaxy.row && galaxy.col === otherGalaxy.col)
      ) {
        shortestPaths[i].push(0);
        return;
      }

      const numExtraGalaxyColumns = map[galaxy.row]
        .slice(Math.min(galaxy.col, otherGalaxy.col), Math.max(galaxy.col, otherGalaxy.col))
        .filter((c) => c === "+").length;

      const extraGalaxyRows = [];
      for (
        let k = Math.min(galaxy.row, otherGalaxy.row);
        k < Math.max(galaxy.row, otherGalaxy.row);
        k++
      ) {
        extraGalaxyRows.push(map[k][0]);
      }
      const numExtraGalaxyRows = extraGalaxyRows.filter((c) => c === "+").length;
      const extraDistance = (numExtraGalaxyColumns + numExtraGalaxyRows) * (multiplier - 1);

      const rowDistance = Math.abs(galaxy.row - otherGalaxy.row);
      const colDistance = Math.abs(galaxy.col - otherGalaxy.col);

      const totalDistance =
        rowDistance - numExtraGalaxyRows + colDistance - numExtraGalaxyColumns + extraDistance;

      // print(
      //   `Distance from Galaxy ${i + 1} (${galaxy.row}, ${galaxy.col}) to Galaxy ${j + 1} at (${
      //     otherGalaxy.row
      //   }, ${otherGalaxy.col}) is ${totalDistance}`,
      // );
      // print({
      //   rowDistance,
      //   colDistance,
      //   numExtraGalaxyColumns,
      //   numExtraGalaxyRows,
      // });

      shortestPaths[i].push(totalDistance);
    });
  });

  // print("");
  // shortestPaths.forEach((shortestPath) => {
  //   print(shortestPath.map((item) => item.toString().padStart(2, "0")).join("\t"));
  // });
  // print("");

  return shortestPaths;
};

const partOne = (inputs: string[], solution?: number) => {
  const map = expandSpace(inputs);
  const galaxies = findGalaxies(map);
  const shortestPaths = findShortestPaths(galaxies, map, 1);

  // map.forEach((row) => {
  //   print(row.join(""));
  // });

  const shortestPathsSum = shortestPaths.reduce(
    (acc, row) => acc + row.reduce((rowAcc, number) => rowAcc + number),
    0,
  );

  print("What is the sum of these lengths?");
  print(shortestPathsSum);

  if (solution) {
    assert(shortestPathsSum === solution);
  }
};

const partTwo = (inputs: string[], multiplier: number, solution?: number) => {
  const map = expandSpace(inputs, "+");
  const galaxies = findGalaxies(map);
  const shortestPaths = findShortestPaths(galaxies, map, multiplier);

  // map.forEach((line) => {
  //   print(line.join(" "));
  // });

  const shortestPathsSum = shortestPaths.reduce(
    (acc, row) => acc + row.reduce((rowAcc, number) => rowAcc + number),
    0,
  );

  print("What is the sum of these lengths?");
  print(shortestPathsSum);
};

export default function (): void {
  const example = readTextFile(exampleFilename);
  const input = readTextFile(inputFilename);

  print("Part 1 (Example) ===================");
  partOne(example, 374);
  print("");

  print("Part 1 ============================");
  partOne(input, 10276166);
  print("");

  print("Part 2 (Example) ===================");
  partTwo(example, 10, 1030);
  partTwo(example, 100, 8410);
  print("");

  print("Part 2 ===================");
  partTwo(input, 1000000, 598693078798);
}
