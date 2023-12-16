// https://adventofcode.com/2023/day/16
import { strict as assert } from "node:assert";
import { print, readTextFile } from "./utils";

const inputFilename = "./inputs/day-16.txt";
const exampleFilename = "./inputs/day-16-example.txt";

type LayoutGrid = string[][];
type BeamGrid = boolean[][];
type Direction = "up" | "right" | "down" | "left";
type Coordinates = {
  row: number;
  col: number;
};
type Beam = {
  direction: Direction;
  coordinates: Coordinates;
};

const makeLayoutGrid = (inputs: string[]): LayoutGrid => {
  const layoutGrid: LayoutGrid = [];
  for (let i = 0; i < inputs.length; i++) {
    layoutGrid.push(inputs[i].split(""));
  }

  return layoutGrid;
};

const makeBeamGrid = (inputs: string[]): BeamGrid => {
  const beamGrid: BeamGrid = [];
  for (let i = 0; i < inputs.length; i++) {
    beamGrid.push(new Array(inputs[0].length).fill(false));
  }

  return beamGrid;
};

const getNextRow = (row: number, direction: Direction) => {
  if (direction === "down") return row + 1;
  if (direction === "up") return row - 1;
  return row;
};

const getNextCol = (col: number, direction: Direction) => {
  if (direction === "right") return col + 1;
  if (direction === "left") return col - 1;
  return col;
};

const traverse = (inputs: string[], layoutGrid: LayoutGrid, beam: Beam) => {
  const beamGrid = makeBeamGrid(inputs);
  const beams: Beam[] = [];
  beams.push(beam);

  const visitedMap: Set<string> = new Set();

  do {
    const beam = beams.shift() as Beam; // beam should never be undefined
    const direction = beam.direction;
    const { row, col } = beam.coordinates;

    const visitedMapKey = `${direction} ${row} ${col}`;
    if (visitedMap.has(visitedMapKey)) {
      continue;
    } else {
      visitedMap.add(visitedMapKey);
    }

    if (!layoutGrid?.[row]?.[col]) {
      continue;
    }

    beamGrid[row][col] = true;

    const instruction = layoutGrid[row][col];

    switch (instruction) {
      // "." - Continue in the same direction
      case ".": {
        beams.push({
          direction,
          coordinates: {
            row: getNextRow(row, direction),
            col: getNextCol(col, direction),
          },
        });
        break;
      }
      // / - Reflect beam upward
      case "/": {
        let newDirection: Direction = "up";
        if (direction === "left") newDirection = "down";
        if (direction === "right") newDirection = "up";
        if (direction === "up") newDirection = "right";
        if (direction === "down") newDirection = "left";

        beams.push({
          direction: newDirection,
          coordinates: {
            row: getNextRow(row, newDirection),
            col: getNextCol(col, newDirection),
          },
        });
        break;
      }
      // \ - Reflect beam downward
      case "\\": {
        let newDirection: Direction = "up";
        if (direction === "left") newDirection = "up";
        if (direction === "right") newDirection = "down";
        if (direction === "up") newDirection = "left";
        if (direction === "down") newDirection = "right";

        beams.push({
          direction: newDirection,
          coordinates: {
            row: getNextRow(row, newDirection),
            col: getNextCol(col, newDirection),
          },
        });
        break;
      }
      // | - Splitter
      case "|": {
        if (direction === "up" || direction === "down") {
          // Continue in same direction
          beams.push({
            direction,
            coordinates: {
              row: getNextRow(row, direction),
              col: getNextCol(col, direction),
            },
          });
        } else {
          // Split the beam
          beams.push({
            direction: "up",
            coordinates: {
              row: getNextRow(row, "up"),
              col: getNextCol(col, "up"),
            },
          });
          beams.push({
            direction: "down",
            coordinates: {
              row: getNextRow(row, "down"),
              col: getNextCol(col, "down"),
            },
          });
        }
        break;
      }
      case "-": {
        if (direction === "right" || direction === "left") {
          // Continue in same direction
          beams.push({
            direction,
            coordinates: {
              row: getNextRow(row, direction),
              col: getNextCol(col, direction),
            },
          });
        } else {
          // Split the beam
          beams.push({
            direction: "left",
            coordinates: {
              row: getNextRow(row, "left"),
              col: getNextCol(col, "left"),
            },
          });
          beams.push({
            direction: "right",
            coordinates: {
              row: getNextRow(row, "right"),
              col: getNextCol(col, "right"),
            },
          });
        }
        break;
      }
      default: {
        throw new Error("Don't know what to do");
      }
    }
  } while (beams.length > 0);

  let numEnergized = 0;
  beamGrid.forEach((row) => {
    numEnergized += row.filter((isCharged) => isCharged).length;
  });

  return numEnergized;
};

const partOne = (inputs: string[], solution?: number) => {
  const layoutGrid = makeLayoutGrid(inputs);
  const numEnergized = traverse(inputs, layoutGrid, {
    direction: "right",
    coordinates: {
      row: 0,
      col: 0,
    },
  });

  print("");
  print(
    `The light isn't energizing enough tiles to produce lava; to debug 
the contraption, you need to start by analyzing the current
situation. With the beam starting in the top-left heading right,
how many tiles end up being energized?`,
  );
  print(numEnergized);

  if (solution) {
    assert(numEnergized === solution);
  }
};

const partTwo = (inputs: string[], solution?: number) => {
  const layoutGrid = makeLayoutGrid(inputs);

  let numMaxEnergized = 0;

  print("Go right from the left-edge");
  for (let i = 0; i < layoutGrid.length; i++) {
    const numEnergized = traverse(inputs, layoutGrid, {
      direction: "right",
      coordinates: {
        row: i,
        col: 0,
      },
    });
    numMaxEnergized = Math.max(numEnergized, numMaxEnergized);
  }

  print("Go left from the right-edge");
  for (let i = layoutGrid.length - 1; i >= 0; i--) {
    const numEnergized = traverse(inputs, layoutGrid, {
      direction: "left",
      coordinates: {
        row: i,
        col: layoutGrid[0].length - 1,
      },
    });
    numMaxEnergized = Math.max(numEnergized, numMaxEnergized);
  }

  print("Go down from the top-edge");
  for (let i = 0; i < layoutGrid[0].length; i++) {
    const numEnergized = traverse(inputs, layoutGrid, {
      direction: "down",
      coordinates: {
        row: 0,
        col: i,
      },
    });
    numMaxEnergized = Math.max(numEnergized, numMaxEnergized);
  }

  print("Go up from the bottom-edge");
  for (let i = layoutGrid[0].length - 1; i >= 0; i--) {
    const numEnergized = traverse(inputs, layoutGrid, {
      direction: "up",
      coordinates: {
        row: layoutGrid.length - 1,
        col: i,
      },
    });
    numMaxEnergized = Math.max(numEnergized, numMaxEnergized);
  }

  print("");
  print(
    `Find the initial beam configuration that energizes the largest
number of tiles; how many tiles are energized in that configuration?`,
  );
  print(numMaxEnergized);
};

export default function (): void {
  const example = readTextFile(exampleFilename);
  const input = readTextFile(inputFilename);

  print("Part 1 (Example) ===============================================");
  partOne(example, 46);
  print("");

  print("Part 1 =========================================================");
  partOne(input, 6978);
  print("");

  print("Part 2 (Example) ===============================================");
  partTwo(example, 51);
  print("");

  print("Part 2 =========================================================");
  partTwo(input, 7315);
}
