// https://adventofcode.com/2022/day/9
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-09.txt";

const Directions = {
  Up: "U",
  Right: "R",
  Down: "D",
  Left: "L",
} as const;
type DirectionKey = keyof typeof Directions;
type Direction = typeof Directions[DirectionKey];

type VisitSet = Set<string>;
type Coordinate = [x: number, y: number];

const addToSet = (visitSet: VisitSet, coordinates: Coordinate) => {
  visitSet.add(coordinates.toString());
};

const move = (position: Coordinate, direction: Direction): Coordinate => {
  if (direction === Directions.Up) {
    return [position[0], position[1] + 1];
  }
  if (direction === Directions.Down) {
    return [position[0], position[1] - 1];
  }
  if (direction === Directions.Left) {
    return [position[0] - 1, position[1]];
  }
  if (direction === Directions.Right) {
    return [position[0] + 1, position[1]];
  }

  return position;
};

const moveKnots = (headPosition: Coordinate, tailPosition: Coordinate) => {
  const horizontalDistance = headPosition[0] - tailPosition[0];
  const verticalDistance = headPosition[1] - tailPosition[1];

  let newTailPosition: Coordinate = [...tailPosition];

  if (
    Math.abs(horizontalDistance) > 0 &&
    Math.abs(verticalDistance) > 0 &&
    (Math.abs(horizontalDistance) === 2 || Math.abs(verticalDistance) === 2)
  ) {
    // Move diagonally
    if (horizontalDistance > 0) {
      newTailPosition = move(newTailPosition, Directions.Right);
    }
    if (horizontalDistance < 0) {
      newTailPosition = move(newTailPosition, Directions.Left);
    }
    if (verticalDistance > 0) {
      newTailPosition = move(newTailPosition, Directions.Up);
    }
    if (verticalDistance < 0) {
      newTailPosition = move(newTailPosition, Directions.Down);
    }
  } else {
    // If head is 2 steps away horizontally or vertically, move Tail toward Head
    if (horizontalDistance === 2) {
      newTailPosition = move(newTailPosition, Directions.Right);
    }
    if (horizontalDistance === -2) {
      newTailPosition = move(newTailPosition, Directions.Left);
    }
    if (verticalDistance === 2) {
      newTailPosition = move(newTailPosition, Directions.Up);
    }
    if (verticalDistance === -2) {
      newTailPosition = move(newTailPosition, Directions.Down);
    }
  }

  return newTailPosition;
};

const partOne = (input: string[]) => {
  let headPosition: Coordinate = [0, 0];
  let tailPosition: Coordinate = [0, 0];

  const visitSet: VisitSet = new Set();
  addToSet(visitSet, tailPosition);

  input.forEach((instruction) => {
    const [direction, unitsStr] = instruction.split(" ") as [Direction, string];
    const units = parseInt(unitsStr, 10);
    for (let i = 0; i < units; i++) {
      // Move head
      headPosition = move(headPosition, direction);

      // Move tail
      tailPosition = moveKnots(headPosition, tailPosition);

      // Add to visit set
      addToSet(visitSet, tailPosition);
    }
  });

  const numTailPositions = visitSet.size;
  print(`[Part 1] The tail visits ${numTailPositions} positions at least once.`);
  assert(numTailPositions === 6464);
};

const partTwo = (input: string[]) => {
  const knotPositions: Coordinate[] = [
    [0, 0], // head
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0], // tail
  ];

  const visitSet: VisitSet = new Set();
  addToSet(visitSet, knotPositions[knotPositions.length - 1]);

  input.forEach((instruction) => {
    const [direction, unitsStr] = instruction.split(" ") as [Direction, string];
    const units = parseInt(unitsStr, 10);

    for (let i = 0; i < units; i++) {
      // Move head
      knotPositions[0] = move(knotPositions[0], direction);

      // Move all the other knots
      for (let j = 0; j < knotPositions.length - 1; j++) {
        const frontPosition = knotPositions[j];
        const backPosition = knotPositions[j + 1];
        knotPositions[j + 1] = moveKnots(frontPosition, backPosition);
      }

      // Add tail to visit set
      addToSet(visitSet, knotPositions[knotPositions.length - 1]);
    }
  });

  const numTailPositions = visitSet.size;
  print(`[Part 2] The tail visits ${numTailPositions} positions at least once.`);
  assert(numTailPositions === 2604);
};

export default function () {
  const input = readTextFile(inputFilename);

  partOne(input);
  partTwo(input);

  print("Done.");
}
