// https://adventofcode.com/2022/day/12
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-12.txt";

type Coordinate = {
  x: number;
  y: number;
};

type Map = string[][];
type DistanceMap = number[][];
type VisitedMap = number[][];

const nullCoordinate: Coordinate = { x: -1, y: -1 };

const createMap = (inputs: string[]): Map => {
  const map: Map = Array.from(inputs[0]).map((items) => []);

  inputs.forEach((items, y) => {
    Array.from(items).forEach((elevation, x) => {
      map[x].push(elevation);
    });
  });

  return map;
};

const createDistanceMap = (inputs: string[]): DistanceMap => {
  const distanceMap: DistanceMap = Array.from(inputs[0]).map((items) => []);

  inputs.forEach((items, y) => {
    Array.from(items).forEach((elevation, x) => {
      distanceMap[x].push(Infinity);
    });
  });

  return distanceMap;
};

const createVisitedMap = (inputs: string[]): DistanceMap => {
  const distanceMap: DistanceMap = Array.from(inputs[0]).map((items) => []);

  inputs.forEach((items, y) => {
    Array.from(items).forEach((elevation, x) => {
      distanceMap[x].push(0);
    });
  });

  return distanceMap;
};

const findPosition = (map: Map, target: string): Coordinate => {
  let coordinate: Coordinate = nullCoordinate;

  map.forEach((items, x) => {
    items.forEach((item, y) => {
      if (item === target) {
        coordinate = { x, y };
      }
    });
  });

  return coordinate;
};

const getUpPosition = (coordinate: Coordinate): Coordinate => {
  return coordinate.y === 0 ? nullCoordinate : { x: coordinate.x, y: coordinate.y - 1 };
};

const getDownPosition = (map: Map, coordinate: Coordinate): Coordinate => {
  return coordinate.y === map[0].length - 1
    ? nullCoordinate
    : { x: coordinate.x, y: coordinate.y + 1 };
};

const getLeftPosition = (coordinate: Coordinate): Coordinate => {
  return coordinate.x === 0 ? nullCoordinate : { x: coordinate.x - 1, y: coordinate.y };
};

const getRightPosition = (map: Map, coordinate: Coordinate): Coordinate => {
  return coordinate.x === map.length - 1
    ? nullCoordinate
    : { x: coordinate.x + 1, y: coordinate.y };
};

const canMove = (
  map: Map,
  distanceMap: DistanceMap,
  targetPosition: Coordinate,
  currentPosition: Coordinate
): boolean => {
  if (targetPosition === nullCoordinate) {
    return false;
  }

  const { x: currentX, y: currentY } = currentPosition;
  const { x: targetX, y: targetY } = targetPosition;
  const currentElevation = map[currentX][currentY];
  const currentDistance = distanceMap[currentX][currentY];
  const targetElevation =
    currentElevation === "E" ? "z" : String.fromCharCode(currentElevation.charCodeAt(0) - 1);
  const targetDistance = distanceMap[targetPosition.x][targetPosition.y];

  if (currentDistance + 1 < targetDistance) {
    // print(
    //   `    Can move because (${currentX}, ${currentY}) distance = ${currentDistance} and (${targetX}, ${targetY}) has targetDistance = ${targetDistance}`
    // );
    if (map[targetX][targetY] === "S") {
      print(`  You did it!!`);
      return true;
    }

    if (map[targetX][targetY] === targetElevation) {
      // print(`  Stepping to ${targetElevation} at (${targetPosition.x}, ${targetPosition.y})!`);
      return true;
    }

    return map[targetX][targetY] === currentElevation;
  }

  return false;
};

const findShortestDistance = (
  map: Map,
  distanceMap: DistanceMap,
  visitedMap: VisitedMap,
  position: Coordinate,
  distance: number,
  shouldPrint = false
): void => {
  const { x, y } = position;
  const elevation = map[x][y];

  if (shouldPrint) {
    print(
      `Currently at (${x}, ${y}). Current elevation is ${elevation}. Visited ${visitedMap[x][y]} times.`
    );
  }

  visitedMap[x][y] += 1;
  if (visitedMap[x][y] >= 30000) {
    shouldPrint && print("  Recursive loop.");
    return;
  }

  if (distance < distanceMap[x][y]) {
    shouldPrint && print(`  Updating distance map at (${x}, ${y}). New distance is ${distance}`);
    distanceMap[x][y] = distance;
  } else {
    shouldPrint &&
      print(
        `  Not updating distance map at (${x}, ${y}). Old distance is ${distanceMap[x][y]}. New distance is ${distance}`
      );
  }

  if (distanceMap[x][y] % 10 === 0) {
    print(
      `===================================================================== Currently at (${x}, ${y}). Distance is ${distanceMap[x][y]}. Elevation is ${elevation}`
    );
  }

  // Go up
  const up = getUpPosition(position);
  if (canMove(map, distanceMap, up, position)) {
    shouldPrint && print(`  Go from (${x}, ${y}) up to (${up.x}, ${up.y})`);
    findShortestDistance(map, distanceMap, visitedMap, up, distanceMap[x][y] + 1, shouldPrint);
  }

  // Go left
  const left = getLeftPosition(position);
  if (canMove(map, distanceMap, left, position)) {
    shouldPrint && print(`  Go from (${x}, ${y}) left to (${left.x}, ${left.y})`);
    findShortestDistance(map, distanceMap, visitedMap, left, distanceMap[x][y] + 1, shouldPrint);
  }

  // Go right
  const right = getRightPosition(map, position);
  if (canMove(map, distanceMap, right, position)) {
    shouldPrint && print(`  Go from (${x}, ${y}) right to (${right.x}, ${right.y})`);
    findShortestDistance(map, distanceMap, visitedMap, right, distanceMap[x][y] + 1, shouldPrint);
  }

  // Go down
  const down = getDownPosition(map, position);
  if (canMove(map, distanceMap, down, position)) {
    shouldPrint && print(`  Move from (${x}, ${y}) down to (${down.x}, ${down.y})`);
    findShortestDistance(map, distanceMap, visitedMap, down, distanceMap[x][y] + 1, shouldPrint);
  }

  return;
};

const printMap = (map: number[][]) => {
  print(map.join("\n").replace(/Infinity/g, "-I-"));
};

const partOne = (inputs: string[]) => {
  const map = createMap(inputs);
  const distanceMap = createDistanceMap(inputs);
  const visitedMap = createVisitedMap(inputs);
  const currentPosition = findPosition(map, "E");
  const endPosition = findPosition(map, "S");

  findShortestDistance(map, distanceMap, visitedMap, currentPosition, 0, false);

  print(`Z is at (${currentPosition.x}, ${currentPosition.y}).`);
  printMap(distanceMap);

  print(distanceMap[endPosition.x][endPosition.y]);
};

const partTwo = (inputs: string[]) => {};

export default function () {
  const inputs = readTextFile(inputFilename);

  partOne(inputs);
  partTwo(inputs);
}
