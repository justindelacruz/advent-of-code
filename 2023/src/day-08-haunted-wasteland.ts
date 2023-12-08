// https://adventofcode.com/2023/day/7
import { strict as assert } from "node:assert";
import { print, readTextFile } from "./utils";

const inputFilename = "./inputs/day-08.txt";
const sampleOneFilename = "./inputs/day-08-sample-01.txt";

type Node = {
  left: string;
  right: string;
};
type Map = Record<string, Node>;

const createMap = (nodes: string[]): Map => {
  const map: Map = {};
  nodes.forEach((node) => {
    const match = node.match(/(\w{3}) = \((\w{3}), (\w{3})\)/) ?? [];
    const [, key, left, right] = [...match];
    map[key] = { left, right };
  });

  return map;
};

const navigate = (map: Map, directions: string[], currentNode: string): number => {
  let steps = 0;
  while (true) {
    for (const direction of directions) {
      steps++;
      currentNode = direction === "L" ? map[currentNode].left : map[currentNode].right;
      if (currentNode[2] === "Z") break;
    }
    if (currentNode[2] === "Z") break;
  }

  return steps;
};

const partOne = (inputs: string[], solution?: number) => {
  const nodes = [...inputs];
  const directions = (nodes.shift() ?? "").split("");
  nodes.shift();

  const map = createMap(nodes);
  const steps = navigate(map, directions, "AAA");

  print("How many steps are required to reach ZZZ?");
  print(steps);

  if (solution) {
    assert(steps === solution);
  }
};

const getGreatestCommonDenominator = (a: number, b: number): number =>
  a % b === 0 ? b : getGreatestCommonDenominator(b, a % b);

const getLowestCommonMultiple = (a: number, b: number): number =>
  (a * b) / getGreatestCommonDenominator(a, b);

const getArrayLowestCommonMultiple = (numbers: number[]) =>
  numbers.reduce((a, b) => getLowestCommonMultiple(a, b));

const partTwo = (inputs: string[], solution?: number) => {
  const nodes = [...inputs];
  const directions = (nodes.shift() ?? "").split("");
  nodes.shift();

  const map = createMap(nodes);

  // Get all nodes ending with 'A'
  const currentNodes = Object.keys(map).filter((key) => key[2] === "A");
  const stepsToZ: number[] = [];

  currentNodes.forEach((currentNode) => {
    const stepsZ = navigate(map, directions, currentNode);
    stepsToZ.push(stepsZ);
  });

  const steps = getArrayLowestCommonMultiple(stepsToZ);
  print("How many steps does it take before you're only on nodes that end with Z?");
  print(steps);

  if (solution) {
    assert(steps === solution);
  }
};

export default function (): void {
  const sampleOne = readTextFile(sampleOneFilename);
  const input = readTextFile(inputFilename);

  print("Part 1 (Sample) ===================");
  partOne(sampleOne, 6);
  print("");

  print("Part 1 ============================");
  partOne(input);
  print("");

  print("Part 2 ===================");
  partTwo(input, 13830919117339);
}
