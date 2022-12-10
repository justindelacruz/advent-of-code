// https://adventofcode.com/2022/day/2
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";

const inputFilename = "./inputs/day-02.txt";

const Moves = {
  Rock: "Rock",
  Paper: "Paper",
  Scissors: "Scissors",
} as const;
type Move = keyof typeof Moves;

const OpponentMoves = {
  A: Moves.Rock,
  B: Moves.Paper,
  C: Moves.Scissors,
} as const;
type OpponentMoveKey = keyof typeof OpponentMoves;

const MyMoves = {
  X: Moves.Rock,
  Y: Moves.Paper,
  Z: Moves.Scissors,
};
type MyMoveKey = keyof typeof MyMoves;

const ShapeScore = {
  Rock: 1,
  Paper: 2,
  Scissors: 3,
} as const;

const Outcomes = {
  Lose: "Lose",
  Tie: "Tie",
  Win: "Win",
} as const;
type Outcome = keyof typeof Outcomes;

const OutcomeScores = {
  Lose: 0,
  Tie: 3,
  Win: 6,
} as const;
type OutcomeScore = typeof OutcomeScores[Outcome];

const MyMoveStrategies = {
  X: "Lose",
  Y: "Tie",
  Z: "Win",
} as const;

const getPartOneOutcomeScore = (
  opponentMove: Move,
  myMove: Move
): OutcomeScore => {
  if (opponentMove === myMove) {
    return OutcomeScores.Tie;
  }

  if (opponentMove === Moves.Rock) {
    if (myMove === Moves.Paper) {
      return OutcomeScores.Win;
    } else {
      return OutcomeScores.Lose;
    }
  }

  if (opponentMove === Moves.Paper) {
    if (myMove === Moves.Scissors) {
      return OutcomeScores.Win;
    } else {
      return OutcomeScores.Lose;
    }
  }

  if (opponentMove === Moves.Scissors) {
    if (myMove === Moves.Rock) {
      return OutcomeScores.Win;
    } else {
      return OutcomeScores.Lose;
    }
  }

  return OutcomeScores.Lose;
};

const partOne = (input: string[]) => {
  let totalScore = 0;
  input.forEach((strategy) => {
    const opponentMoveKey = strategy[0] as OpponentMoveKey;
    const myMoveKey = strategy[2] as MyMoveKey;

    const opponentMove = OpponentMoves[opponentMoveKey] as Move;
    const myMove = MyMoves[myMoveKey] as Move;

    const winScore = getPartOneOutcomeScore(opponentMove, myMove);
    const shapeScore = ShapeScore[myMove];
    totalScore += winScore + shapeScore;
  });

  print(`[Part 1] Your total score is ${totalScore}`);
  assert(totalScore === 15337);
};

const getNextMove = (opponentMove: Move, myMove: Outcome): Move => {
  if (myMove === Outcomes.Tie) {
    return opponentMove;
  }

  if (myMove === Outcomes.Win) {
    if (opponentMove === Moves.Rock) {
      return Moves.Paper;
    }
    if (opponentMove === Moves.Paper) {
      return Moves.Scissors;
    }
    if (opponentMove === Moves.Scissors) {
      return Moves.Rock;
    }
  }

  if (myMove === Outcomes.Lose) {
    if (opponentMove === Moves.Rock) {
      return Moves.Scissors;
    }
    if (opponentMove === Moves.Paper) {
      return Moves.Rock;
    }
    if (opponentMove === Moves.Scissors) {
      return Moves.Paper;
    }
  }

  return opponentMove;
};

const partTwo = (input: string[]) => {
  let totalScore = 0;
  input.forEach((strategy) => {
    const opponentMoveKey = strategy[0] as OpponentMoveKey;
    const myMoveKey = strategy[2] as MyMoveKey;

    const opponentMove = OpponentMoves[opponentMoveKey] as Move;
    const myMoveStrategy = MyMoveStrategies[myMoveKey] as Outcome;

    const myMove = getNextMove(opponentMove, myMoveStrategy);
    const winScore = OutcomeScores[myMoveStrategy];
    const shapeScore = ShapeScore[myMove];
    totalScore += winScore + shapeScore;
  });

  print(`[Part 2] Your total score is ${totalScore}`);
  assert(totalScore === 11696);
};

export default function () {
  const input = readTextFile(inputFilename);

  partOne(input);
  partTwo(input);
}
