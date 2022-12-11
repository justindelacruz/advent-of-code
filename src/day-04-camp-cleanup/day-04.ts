// https://adventofcode.com/2022/day/4
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-04.txt";

const doSectionsOverlapCompletely = (aAssignment: string, bAssignment: string) => {
  const [aLowerSectionStr, aUpperSectionStr] = aAssignment.split("-");
  const [bLowerSectionStr, bUpperSectionStr] = bAssignment.split("-");

  // Convert str to int
  const [aLowerSection, aUpperSection, bLowerSection, bUpperSection] = [
    aLowerSectionStr,
    aUpperSectionStr,
    bLowerSectionStr,
    bUpperSectionStr,
  ].map((str) => parseInt(str, 10));

  return (
    bLowerSection >= aLowerSection &&
    bLowerSection <= aUpperSection &&
    bUpperSection >= aLowerSection &&
    bUpperSection <= aUpperSection
  );
};

const doSectionsOverlapPartially = (aAssignment: string, bAssignment: string) => {
  const [aLowerSectionStr, aUpperSectionStr] = aAssignment.split("-");
  const [bLowerSectionStr, bUpperSectionStr] = bAssignment.split("-");

  // Convert str to int
  const [aLowerSection, aUpperSection, bLowerSection, bUpperSection] = [
    aLowerSectionStr,
    aUpperSectionStr,
    bLowerSectionStr,
    bUpperSectionStr,
  ].map((str) => parseInt(str, 10));

  return (
    (bLowerSection >= aLowerSection && bLowerSection <= aUpperSection) ||
    (bUpperSection >= aLowerSection && bUpperSection <= aUpperSection)
  );
};

const partOne = (input: string[]) => {
  let inefficientPairs = 0;

  input.forEach((assignment) => {
    const [aAssignment, bAssignment] = assignment.split(",");

    if (
      doSectionsOverlapCompletely(aAssignment, bAssignment) ||
      doSectionsOverlapCompletely(bAssignment, aAssignment)
    ) {
      inefficientPairs += 1;
    }
  });

  print(
    `[Part 1] There are ${inefficientPairs} assignment pairs in which one range fully contains the other`
  );
  assert(inefficientPairs === 509);
};

const partTwo = (input: string[]) => {
  let inefficientPairs = 0;

  input.forEach((assignment) => {
    const [aAssignment, bAssignment] = assignment.split(",");

    if (
      doSectionsOverlapPartially(aAssignment, bAssignment) ||
      doSectionsOverlapPartially(bAssignment, aAssignment)
    ) {
      inefficientPairs += 1;
    }
  });

  print(
    `[Part 2] There are ${inefficientPairs} assignment pairs in which one range fully contains the other`
  );
  assert(inefficientPairs === 870);
};

export default function () {
  const input = readTextFile(inputFilename);

  partOne(input);
  partTwo(input);
}
