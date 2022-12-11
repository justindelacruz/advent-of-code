// https://adventofcode.com/2022/day/8
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-08.txt";

const makeForest = (input: string[]): number[][] => {
  const forest: number[][] = [];

  input.forEach((treeHeightsStr, row) => {
    const treeHeightsStrArr = Array.from(treeHeightsStr);
    const treeHeights = treeHeightsStrArr.map((treeHeight) => parseInt(treeHeight, 10));

    forest.push(treeHeights);
  });

  return forest;
};

const getLeftTreesHeights = (input: number[][], row: number, col: number): number[] =>
  Array.from(input[row].slice(0, col));

const getRightTreesHeights = (input: number[][], row: number, col: number): number[] =>
  Array.from(input[row].slice(col + 1));

const getTopTreeHeights = (input: number[][], row: number, col: number): number[] => {
  const treeHeights: number[] = [];

  input.forEach((treeRow, i) => {
    if (i < row) {
      treeHeights.push(treeRow[col]);
    }
  });

  return treeHeights;
};

const getBottomTreeHeights = (input: number[][], row: number, col: number): number[] => {
  const treeHeights: number[] = [];

  input.forEach((treeRow, i) => {
    if (i > row) {
      treeHeights.push(treeRow[col]);
    }
  });

  return treeHeights;
};

const checkIsVisible = (targetHeight: number, treeHeights: number[]) => {
  let isVisible = true;
  treeHeights.forEach((treeHeight) => {
    if (treeHeight >= targetHeight) {
      isVisible = false;
    }
  });

  return isVisible;
};

const partOne = (input: string[]) => {
  let numVisibleTrees = 0;
  const forest = makeForest(input);

  forest.forEach((treeRow, row) => {
    treeRow.forEach((treeHeight, col) => {
      const leftTreeHeights = getLeftTreesHeights(forest, row, col);
      const rightTreeHeights = getRightTreesHeights(forest, row, col);
      const topTreeHeights = getTopTreeHeights(forest, row, col);
      const bottomTreeHeights = getBottomTreeHeights(forest, row, col);

      const isVisibleLeft = checkIsVisible(treeHeight, leftTreeHeights);
      const isVisibleRight = checkIsVisible(treeHeight, rightTreeHeights);
      const isVisibleTop = checkIsVisible(treeHeight, topTreeHeights);
      const isVisibleBottom = checkIsVisible(treeHeight, bottomTreeHeights);

      if (isVisibleLeft || isVisibleRight || isVisibleTop || isVisibleBottom) {
        numVisibleTrees += 1;
      }
    });
  });

  print(`[Part 1] ${numVisibleTrees} trees are visible from outside the grid.`);
  assert(numVisibleTrees === 1533);
};

const countVisibleTrees = (targetHeight: number, treeHeights: number[]): number => {
  let numVisibleTrees = 0;
  let hasBeenBlocked = false;

  treeHeights.forEach((treeHeight) => {
    if (!hasBeenBlocked) {
      if (treeHeight >= targetHeight) {
        numVisibleTrees += 1;
        hasBeenBlocked = true;
      }
      if (treeHeight < targetHeight) {
        numVisibleTrees += 1;
      }
    }
  });

  return numVisibleTrees;
};

const partTwo = (input: string[]) => {
  let maxScenicScore = 0;

  const forest = makeForest(input);

  forest.forEach((treeRow, row) => {
    treeRow.forEach((treeHeight, col) => {
      const leftTreeHeights = getLeftTreesHeights(forest, row, col).reverse();
      const rightTreeHeights = getRightTreesHeights(forest, row, col);
      const topTreeHeights = getTopTreeHeights(forest, row, col).reverse();
      const bottomTreeHeights = getBottomTreeHeights(forest, row, col);

      const numVisibleTreesLeft = countVisibleTrees(treeHeight, leftTreeHeights);
      const numVisibleTreesRight = countVisibleTrees(treeHeight, rightTreeHeights);
      const numVisibleTreesTop = countVisibleTrees(treeHeight, topTreeHeights);
      const numVisibleTreesBottom = countVisibleTrees(treeHeight, bottomTreeHeights);

      const scenicScore =
        numVisibleTreesLeft * numVisibleTreesRight * numVisibleTreesTop * numVisibleTreesBottom;

      maxScenicScore = Math.max(maxScenicScore, scenicScore);
    });
  });

  print(`[Part 2] The highest scenic score possible is ${maxScenicScore}.`);
  assert(maxScenicScore === 345744);
};

export default function () {
  const input = readTextFile(inputFilename);

  partOne(input);
  partTwo(input);

  print("Done.");
}
