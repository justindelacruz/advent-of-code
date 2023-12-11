// https://adventofcode.com/2023/day/10
import { strict as assert } from "node:assert";
import { print, readTextFile } from "./utils";

const inputFilename = "./inputs/day-10.txt";
const exampleOneFilename = "./inputs/day-10-example-1.txt";
const exampleTwoFilename = "./inputs/day-10-example-2.txt";

type Map = string[][];

const generateMap = (inputs: string[]): Map => {
  const map: Map = [];
  inputs.forEach((input) => {
    map.push(input.split(""));
  });

  return map;
};

type Coordinate = {
  row: number;
  col: number;
};

const findStart = (map: Map): Coordinate => {
  let row: number;
  let col = 0;
  mainLoop: {
    for (row = 0; row < map.length; row++) {
      for (col = 0; col < map[0].length; col++) {
        if (map[row][col] === "S") {
          break mainLoop;
        }
      }
    }
  }

  return { row, col };
};

const traverse = (
  originalMap: Map,
  start: Coordinate,
  rowChange: number,
  colChange: number,
): { solvedMap: Map; totalLength: number } => {
  const solvedMap = structuredClone(originalMap);
  for (let i = 0; i < solvedMap.length; i++) {
    for (let j = 0; j < solvedMap[0].length; j++) {
      solvedMap[i][j] = ".";
    }
  }

  const map = structuredClone(originalMap);

  let xChange = rowChange;
  let yChange = colChange;
  let totalLength: number = 0;

  let newCoordinate = { ...start };

  let done = false;
  while (!done) {
    const startPipe = map[newCoordinate.row][newCoordinate.col];
    newCoordinate = {
      row: newCoordinate.row + xChange,
      col: newCoordinate.col + yChange,
    };
    const newPipe = map?.[newCoordinate.row]?.[newCoordinate.col];
    solvedMap[newCoordinate.row][newCoordinate.col] = newPipe;
    map[newCoordinate.row][newCoordinate.col] = "X";

    // print(
    //   `New coordinate (${totalLength}): (${newCoordinate.row}, ${newCoordinate.col}) -> ${newPipe}`,
    // );

    if (totalLength !== -1) {
      totalLength += 1;
    }

    switch (newPipe) {
      case "X":
        print("Infinite loop");
        done = true;
        totalLength = -1;
        break;

      case "|":
        if (yChange !== 0) {
          // Invalid transition
          print(`Invalid transition from ${startPipe} to ${newPipe}`);
          done = true;
          totalLength = -1;
          break;
        }

        // If xChange is positive, we're moving "north" (up)
        xChange = xChange > 0 ? 1 : -1;
        yChange = 0;
        break;

      case "-":
        if (xChange !== 0) {
          // Invalid transition
          print(`Invalid transition from ${startPipe} to ${newPipe}`);
          done = true;
          totalLength = -1;
          break;
        }

        xChange = 0;
        yChange =
          yChange > 0
            ? 1 // We're moving "east" (right)
            : -1; // We're moving "west" (left)
        break;

      case "L":
        if (xChange < 0 || yChange > 0) {
          // Invalid transition
          print(`Invalid transition from ${startPipe} to ${newPipe}`);
          done = true;
          totalLength = -1;
          break;
        }

        if (yChange < 0) {
          xChange = -1; // We're going "north" (up)
          yChange = 0;
        } else {
          xChange = 0;
          yChange = 1; // We're going "east" (right)
        }
        break;

      case "J":
        if (xChange < 0 || yChange < 0) {
          // Invalid transition
          print(`Invalid transition from ${startPipe} to ${newPipe}`);
          done = true;
          totalLength = -1;
          break;
        }

        if (yChange > 0) {
          xChange = -1; // We're going "north" (up)
          yChange = 0;
        } else {
          xChange = 0;
          yChange = -1; // We're going "west" (left)
        }
        break;

      case "7":
        if (xChange > 0 || yChange < 0) {
          // Invalid transition
          print(`Invalid transition from ${startPipe} to ${newPipe}`);
          done = true;
          totalLength = -1;
          break;
        }

        if (yChange > 0) {
          xChange = 1; // We're going "south" (down)
          yChange = 0;
        } else {
          xChange = 0;
          yChange = -1; // We're going "west" (left)
        }
        break;

      case "F":
        if (xChange > 0 || yChange > 0) {
          // Invalid transition
          print(`Invalid transition from ${startPipe} to ${newPipe}`);
          done = true;
          totalLength = -1;
          break;
        }

        if (yChange < 0) {
          xChange = 1; // We're going "south" (down)
          yChange = 0;
        } else {
          xChange = 0;
          yChange = 1; // We're going "east" (left)
        }
        break;

      case "S":
        // We're done!
        done = true;
        break;

      default:
        // This is either "S" (start), "." (ground), or out-of-bounds
        done = true;
        totalLength = -1;
    }
  }

  return { solvedMap, totalLength };
};

const findTotalSteps = (map: Map): { solvedMap: Map; totalLength: number } => {
  const start = findStart(map);

  print(`Start: (${start.row}, ${start.col})`);

  print(" ");
  print("Going north");
  const northSolution = traverse(map, start, -1, 0);
  if (northSolution.totalLength > 0) return northSolution;

  print(" ");
  print("Going south");
  const southSolution = traverse(map, start, 1, 0);
  if (southSolution.totalLength > 0) return southSolution;

  print(" ");
  print("Going east");
  const eastSolution = traverse(map, start, 0, 1);
  if (eastSolution.totalLength > 0) return eastSolution;

  print(" ");
  print("Going west");
  return traverse(map, start, 0, -1);
};

const partOne = (inputs: string[], solution?: number) => {
  const map = generateMap(inputs);
  const { totalLength } = findTotalSteps(map);
  const farthestPosition = Math.ceil(totalLength / 2);

  print(
    "How many steps along the loop does it take to get from the starting position to the point farthest from the starting position?",
  );
  print(farthestPosition);

  if (solution) {
    assert(farthestPosition === solution);
  }
};

const partTwo = (inputs: string[], solution?: number) => {
  const map = generateMap(inputs);
  const { solvedMap } = findTotalSteps(map);
  const enclosureMap = structuredClone(solvedMap);

  let numEnclosedTiles = 0;
  for (let row = 0; row < enclosureMap.length; row++) {
    for (let col = 0; col < enclosureMap[0].length; col++) {
      const currentTile = solvedMap[row][col];

      if (currentTile !== ".") continue;
      let isEnclosed = false;

      // Check the current `row` in the visited map and count number of enter/exits
      for (let j = 0; j < col; j++) {
        const tile = solvedMap[row][j];
        if (["L", "|", "J"].includes(tile)) {
          isEnclosed = !isEnclosed;
        }
      }

      if (isEnclosed) {
        numEnclosedTiles += 1;
      }
    }
  }

  print("How many tiles are enclosed by the loop?");
  print(numEnclosedTiles);

  if (solution) {
    assert(numEnclosedTiles === solution);
  }
};

export default function (): void {
  const exampleOne = readTextFile(exampleOneFilename);
  const exampleTwo = readTextFile(exampleTwoFilename);
  const input = readTextFile(inputFilename);

  print("Part 1 (Example) ===================");
  partOne(exampleOne, 8);
  print("");

  print("Part 1 ============================");
  partOne(input, 6968);
  print("");

  print("Part 2 (Example) ===================");
  partTwo(exampleTwo, 4);
  print("");

  print("Part 2 ===================");
  partTwo(input, 413);
}
