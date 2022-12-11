// https://adventofcode.com/2022/day/11
import Big from "big.js";
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";
import { inspect } from "util";

Big.RM = Big.roundDown;

const inputFilename = "./inputs/day-11-test.txt";

const getMonkeyId = (input: string): number => {
  // Monkey 0
  const [, monkeyIdStr] = /Monkey (\d*?):/.exec(input) ?? [];

  return parseInt(monkeyIdStr, 10);
};

const getStartingItems = (input: string): Big[] => {
  // Starting items: 54, 65, 75, 74
  const [, startingItemsStr] = /Starting items: (.*?)$/.exec(input) ?? [];
  const startingItemsStrArray = startingItemsStr.split(", ");

  return startingItemsStrArray.map((startingItemStr) => new Big(parseInt(startingItemStr, 10)));
};

const Operator = {
  Add: "+",
  Subtract: "-",
  Multiply: "*",
} as const;
type OperatorKey = keyof typeof Operator;
type Operator = typeof Operator[OperatorKey];

type Operand = number | "old";

type Operation = {
  operator: Operator;
  operand: Operand;
};

const getOperation = (input: string): Operation => {
  const [, operator, operandStr] = /Operation: new = old (.) (.*)$/.exec(input) ?? [];

  const operand = operandStr !== "old" ? parseInt(operandStr, 10) : operandStr;

  return {
    operator: operator as Operator,
    operand: operand as Operand,
  };
};

const getDivisibilityTest = (input: string): number => {
  const [, divisor] = /Test: divisible by (.*)$/.exec(input) ?? [];

  return parseInt(divisor, 10);
};

const getTargetMonkeyIfTrue = (input: string): number => {
  const [, targetMonkey] = /If true: throw to monkey (.*)$/.exec(input) ?? [];

  return parseInt(targetMonkey, 10);
};

const getTargetMonkeyIfFalse = (input: string): number => {
  const [, targetMonkey] = /If false: throw to monkey (.*)$/.exec(input) ?? [];

  return parseInt(targetMonkey, 10);
};

type Monkey = {
  id: number;
  startingItems: Big[];
  operation: Operation;
  divisibilityTest: number;
  targetMonkeyIfTrue: number;
  targetMonkeyIfFalse: number;
  inspectionCount: number;
};

const parseInputs = (inputs: string[]): Monkey[] => {
  const monkeys: Monkey[] = [];

  for (let i = 0; i < inputs.length; i++) {
    const monkeyId = getMonkeyId(inputs[i]);
    const startingItems = getStartingItems(inputs[i + 1]);
    const operation = getOperation(inputs[i + 2]);
    const divisibilityTest = getDivisibilityTest(inputs[i + 3]);
    const targetMonkeyIfTrue = getTargetMonkeyIfTrue(inputs[i + 4]);
    const targetMonkeyIfFalse = getTargetMonkeyIfFalse(inputs[i + 5]);

    monkeys.push({
      id: monkeyId,
      startingItems,
      operation,
      divisibilityTest,
      targetMonkeyIfTrue,
      targetMonkeyIfFalse,
      inspectionCount: 0,
    });

    i = i + 6;
  }

  return monkeys;
};

const play = (monkeys: Monkey[], shouldDivideByThree: boolean, shouldPrint: boolean) => {
  monkeys.forEach((monkey, index) => {
    shouldPrint && print();
    shouldPrint && print(`Monkey ${monkey.id}:`);

    monkey.startingItems.forEach((worryLevel) => {
      monkey.inspectionCount += 1;

      shouldPrint && print(`  Monkey inspects item with a worry level of ${worryLevel}.`);
      const operand = monkey.operation.operand === "old" ? worryLevel : monkey.operation.operand;

      let newWorryLevel = worryLevel;
      if (monkey.operation.operator === Operator.Add) {
        newWorryLevel = worryLevel.plus(operand);
        shouldPrint && print(`    Worry level is added by ${operand} to ${newWorryLevel}`);
      }
      if (monkey.operation.operator === Operator.Subtract) {
        newWorryLevel = worryLevel.minus(operand);
        shouldPrint && print(`    Worry level is subtracted by ${operand} to ${newWorryLevel}`);
      }
      if (monkey.operation.operator === Operator.Multiply) {
        newWorryLevel = worryLevel.times(operand);
        shouldPrint && print(`    Worry level is multiplied by ${operand} to ${newWorryLevel}`);
      }

      if (shouldDivideByThree) {
        newWorryLevel = newWorryLevel.div(3).round(Big.roundDown);
        shouldPrint &&
          print(`    Monkey gets bored with item. Worry level is divided by 3 to ${newWorryLevel}`);
      }

      const divisibilityTest = newWorryLevel.mod(monkey.divisibilityTest);
      if (divisibilityTest.eq(0)) {
        shouldPrint && print(`    Current worry level is divisible by ${monkey.divisibilityTest}.`);
        shouldPrint &&
          print(
            `    Item with worry level ${newWorryLevel} is thrown to Monkey ${monkey.targetMonkeyIfTrue}`
          );

        monkeys[monkey.targetMonkeyIfTrue].startingItems.push(newWorryLevel);
      } else {
        shouldPrint &&
          print(`    Current worry level is not divisible by ${monkey.divisibilityTest}.`);
        shouldPrint &&
          print(
            `    Item with worry level ${newWorryLevel} is thrown to Monkey ${monkey.targetMonkeyIfFalse}`
          );

        monkeys[monkey.targetMonkeyIfFalse].startingItems.push(newWorryLevel);
      }
    });

    monkey.startingItems = [];
  });
};

const calculateMonkeyBusiness = (monkeys: Monkey[]): number => {
  const inspectionCounts = monkeys.map((monkey) => monkey.inspectionCount);

  const naturalSortComparator = (a: number, b: number) => {
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }

    return 0;
  };

  inspectionCounts.sort(naturalSortComparator);

  return inspectionCounts[0] * inspectionCounts[1];
};

const partOne = (inputs: string[]) => {
  const monkeys = parseInputs(inputs);
  for (let i = 0; i < 20; i++) {
    play(monkeys, true, true);
  }

  const monkeyBusiness = calculateMonkeyBusiness(monkeys);
  print(`[Part 1] After 20 rounds of play, the level of monkey business is ${monkeyBusiness}.`);
  // assert(monkeyBusiness === 88208);
  assert(monkeyBusiness === 10605);
};

const partTwo = (inputs: string[]) => {
  const numGames = 20;
  const monkeys = parseInputs(inputs);
  for (let i = 0; i < numGames; i++) {
    print(`Game ${i}`);
    play(monkeys, false, false);
  }

  const monkeyBusiness = calculateMonkeyBusiness(monkeys);
  print(
    `[Part 2] After ${numGames} rounds of play, the level of monkey business is ${monkeyBusiness}.`
  );

  assert(monkeyBusiness === 10197);
};

export default function () {
  const inputs = readTextFile(inputFilename);

  partOne(inputs);
  partTwo(inputs);

  print("Done.");
}
