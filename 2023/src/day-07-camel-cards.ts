// https://adventofcode.com/2023/day/7
import { strict as assert } from "node:assert";
import { print, readTextFile } from "./utils";

const inputFilename = "./inputs/day-07.txt";
const exampleFilename = "./inputs/day-07-example.txt";

type Type =
  | "five-of-a-kind"
  | "four-of-a-kind"
  | "full-house"
  | "three-of-a-kind"
  | "two-pair"
  | "one-pair"
  | "high-card";

type Cards = number[];
type Entry = {
  cards: Cards;
  bid: number;
};

const parseInput = (input: string, useJokers = false): { cards: Cards; bid: number } => {
  const [handStr, bidStr] = input.split(" ");
  const cards = handStr.split("").map((card) => {
    if (card === "T") return 10;
    if (card === "J") return useJokers ? 1 : 11;
    if (card === "Q") return 12;
    if (card === "K") return 13;
    if (card === "A") return 14;
    return parseInt(card, 10);
  });
  const bid = parseInt(bidStr, 10);

  return { cards, bid };
};

const getTypeStepOne = (groups: number[]): Type => {
  const numMatches = Math.max(...groups.filter(Boolean));
  switch (numMatches) {
    case 5:
      return "five-of-a-kind";
    case 4:
      return "four-of-a-kind";
    case 3:
      return groups.some((group) => group === 2) ? "full-house" : "three-of-a-kind";
    case 2:
      return groups.filter((group) => group === 2).length == 2 ? "two-pair" : "one-pair";
  }

  return "high-card";
};

/**
 * When dealing with wild cards, we can simply add the number
 * of jokers to the otherwise-strongest hand.
 * e.g. 888J8
 *    Original strength = 4-of-a-kind
 *    Effective stength = 5-of-a-kind
 */
const getTypeStepTwo = (groups: number[]): Type => {
  const numJokers = groups[1] ?? 0;
  if (numJokers === 5) {
    return "five-of-a-kind";
  }

  const groupsExcludingJokers = [...groups.slice(0, 1), ...groups.slice(2)];
  const numMatches = Math.max(...groupsExcludingJokers.filter(Boolean));
  const strength = numMatches + numJokers;

  switch (strength) {
    case 5:
      return "five-of-a-kind";
    case 4:
      return "four-of-a-kind";
    case 3:
      // There cannot be more than 1 joker; otherwise we would get a 4-of-a-kind
      if (numJokers === 1 && groups.filter((group) => group === 2).length === 2) {
        return "full-house";
      }
      if (numMatches === 3) {
        return groups.some((group) => group === 2) ? "full-house" : "three-of-a-kind";
      }
      return "three-of-a-kind";
    case 2:
      return groups.filter((group) => group === 2).length == 2 ? "two-pair" : "one-pair";
  }

  return "high-card";
};

const sortMatchedStrengthCards = (a: Entry, b: Entry) => {
  // Note: Must compare numerically, not lexicographically
  for (let i = 0; i < a.cards.length; i++) {
    if (a.cards[i] - b.cards[i] < 0) return 1;
    if (a.cards[i] - b.cards[i] > 0) return -1;
  }
  return 0;
};

const getTotalWinnings = (types: Record<Type, Entry[]>) => {
  const rankedHands: Entry[] = [];
  Object.values(types).forEach((hands) => {
    hands.sort(sortMatchedStrengthCards);
    rankedHands.push(...hands);
  });
  rankedHands.reverse(); // highest-ranked hands at the end

  let totalWinnings = 0;
  rankedHands.forEach((rankedHand, i) => {
    const rank = i + 1;
    totalWinnings += rank * rankedHand.bid;
  });

  return totalWinnings;
};

const partOne = (inputs: string[], solution?: number) => {
  const types: Record<Type, Entry[]> = {
    "five-of-a-kind": [],
    "four-of-a-kind": [],
    "full-house": [],
    "three-of-a-kind": [],
    "two-pair": [],
    "one-pair": [],
    "high-card": [],
  };

  inputs.forEach((input) => {
    const { cards, bid } = parseInput(input);

    const groups: number[] = [];
    cards.forEach((card) => {
      groups[card] = (groups[card] ?? 0) + 1;
    });

    const type = getTypeStepOne(groups);
    types[type].push({
      cards,
      bid,
    });
  });

  const totalWinnings = getTotalWinnings(types);
  print("What are the total winnings?");
  print(totalWinnings);

  if (solution) {
    assert(totalWinnings === solution);
  }
};

const partTwo = (inputs: string[], solution?: number) => {
  const types: Record<Type, Entry[]> = {
    "five-of-a-kind": [],
    "four-of-a-kind": [],
    "full-house": [],
    "three-of-a-kind": [],
    "two-pair": [],
    "one-pair": [],
    "high-card": [],
  };

  inputs.forEach((input) => {
    const { cards, bid } = parseInput(input, true);

    const groups: number[] = [];
    cards.forEach((card) => {
      groups[card] = (groups[card] ?? 0) + 1;
    });

    const type = getTypeStepTwo(groups);
    types[type].push({
      cards,
      bid,
    });
  });

  const totalWinnings = getTotalWinnings(types);
  print("What are the total winnings?");
  print(totalWinnings);

  if (solution) {
    assert(totalWinnings === solution);
  }
};

export default function (): void {
  const example = readTextFile(exampleFilename);
  const input = readTextFile(inputFilename);

  print("Part 1 (Example) ===================");
  partOne(example, 6440);
  print("");

  print("Part 1 ============================");
  partOne(input, 252052080);
  print("");

  print("Part 2 (Example) ===================");
  partTwo(example, 5905);
  print("");

  print("Part 2 ===================");
  partTwo(input, 252898370);
}
