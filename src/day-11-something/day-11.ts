// https://adventofcode.com/2022/day/11
import { strict as assert } from "node:assert";
import { print, readTextFile } from "../utils";
import { Item, Monkey, Operand, Operation, Operator } from "./types";

const inputFilename = "./inputs/day-11.txt";

const parseMonkeyId = (input: string): number => {
  const [, monkeyIdStr] = /Monkey (\d*?):/.exec(input) ?? [];

  return parseInt(monkeyIdStr, 10);
};

const parseStartingItems = (input: string): number[] => {
  const [, startingItemsStr] = /Starting items: (.*?)$/.exec(input) ?? [];

  return startingItemsStr.split(", ").map((startingItemStr) => parseInt(startingItemStr, 10));
};

const parseItems = (input: string): Item[] => {
  const [, startingItemsStr] = /Starting items: (.*?)$/.exec(input) ?? [];
  const startingItems = startingItemsStr
    .split(", ")
    .map((startingItemStr) => parseInt(startingItemStr, 10));

  return startingItems.map((startingItem) => ({
    startingValue: startingItem,
    remainders: {},
  }));
};

const parseOperation = (input: string): Operation => {
  const [, operator, operandStr] = /Operation: new = old (.) (.*)$/.exec(input) ?? [];

  const operand = operandStr !== "old" ? parseInt(operandStr, 10) : operandStr;

  return {
    operator: operator as Operator,
    operand: operand as Operand,
  };
};

const parseDivisibiltyTest = (input: string): number => {
  const [, divisor] = /Test: divisible by (.*)$/.exec(input) ?? [];

  return parseInt(divisor, 10);
};

const parseTargetMonkeyIfTrue = (input: string): number => {
  const [, targetMonkey] = /If true: throw to monkey (.*)$/.exec(input) ?? [];

  return parseInt(targetMonkey, 10);
};

const parseTargetMonkeyIfFalse = (input: string): number => {
  const [, targetMonkey] = /If false: throw to monkey (.*)$/.exec(input) ?? [];

  return parseInt(targetMonkey, 10);
};

const parseInputs = (inputs: string[]): Monkey[] => {
  const monkeys: Monkey[] = [];

  for (let i = 0; i < inputs.length; i++) {
    const monkeyId = parseMonkeyId(inputs[i]);
    const startingItems = parseStartingItems(inputs[i + 1]);
    const items = parseItems(inputs[i + 1]);
    const operation = parseOperation(inputs[i + 2]);
    const divisibilityTest = parseDivisibiltyTest(inputs[i + 3]);
    const targetMonkeyIfTrue = parseTargetMonkeyIfTrue(inputs[i + 4]);
    const targetMonkeyIfFalse = parseTargetMonkeyIfFalse(inputs[i + 5]);

    monkeys.push({
      id: monkeyId,
      startingItems,
      items,
      operation,
      divisibilityTest,
      targetMonkeyIfTrue,
      targetMonkeyIfFalse,
      inspectionCount: 0,
    });

    i = i + 6;
  }

  // Pre-calculate the remainders
  const divisibilityTests = monkeys.map((monkey) => monkey.divisibilityTest);
  monkeys.forEach((monkey) => {
    monkey.items.forEach((item) => {
      divisibilityTests.forEach((divisibilityTest) => {
        item.remainders[divisibilityTest] = item.startingValue % divisibilityTest;
      });
    });
  });

  return monkeys;
};

const play = (monkeys: Monkey[], shouldPrint: boolean, useAlternateGameplay: boolean) => {
  monkeys.forEach((monkey) => {
    if (shouldPrint) {
      print();
      print(`Monkey ${monkey.id}:`);
    }

    if (useAlternateGameplay) {
      // Instead of calculating worry levels directly,
      // we'll work indirectly using the modulus remainders.
      monkey.items.forEach((item) => {
        monkey.inspectionCount += 1;

        for (const [divisorStr, remainder] of Object.entries(item.remainders)) {
          const operand =
            monkey.operation.operand === "old"
              ? item.remainders[divisorStr]
              : monkey.operation.operand;

          if (monkey.operation.operator === Operator.Add) {
            item.remainders[divisorStr] = (remainder + operand) % parseInt(divisorStr, 10);
          }
          if (monkey.operation.operator === Operator.Subtract) {
            item.remainders[divisorStr] = (remainder - operand) % parseInt(divisorStr, 10);
          }
          if (monkey.operation.operator === Operator.Multiply) {
            item.remainders[divisorStr] = (remainder * operand) % parseInt(divisorStr, 10);
          }
        }

        if (item.remainders[monkey.divisibilityTest] === 0) {
          monkeys[monkey.targetMonkeyIfTrue].items.push(item);
        } else {
          monkeys[monkey.targetMonkeyIfFalse].items.push(item);
        }
      });

      monkey.items = [];
    } else {
      // Strategy: Calculate worry level directly
      monkey.startingItems.forEach((worryLevel) => {
        monkey.inspectionCount += 1;

        if (shouldPrint) print(`  Monkey inspects item with a worry level of ${worryLevel}.`);

        const operand = monkey.operation.operand === "old" ? worryLevel : monkey.operation.operand;
        let newWorryLevel = worryLevel;

        if (monkey.operation.operator === Operator.Add) {
          newWorryLevel = worryLevel + operand;
          if (shouldPrint) print(`    Worry level is added by ${operand} to ${newWorryLevel}`);
        }
        if (monkey.operation.operator === Operator.Subtract) {
          newWorryLevel = worryLevel - operand;
          if (shouldPrint) print(`    Worry level is subtracted by ${operand} to ${newWorryLevel}`);
        }
        if (monkey.operation.operator === Operator.Multiply) {
          newWorryLevel = worryLevel * operand;
          if (shouldPrint) print(`    Worry level is multiplied by ${operand} to ${newWorryLevel}`);
        }

        newWorryLevel = Math.floor(newWorryLevel / 3);
        shouldPrint &&
          print(`    Monkey gets bored with item. Worry level is divided by 3 to ${newWorryLevel}`);

        const divisibilityTest = newWorryLevel % monkey.divisibilityTest;
        if (divisibilityTest === 0) {
          if (shouldPrint) {
            print(`    Current worry level is divisible by ${monkey.divisibilityTest}.`);
            print(
              `    Item with worry level ${newWorryLevel} is thrown to Monkey ${monkey.targetMonkeyIfTrue}`
            );
          }

          monkeys[monkey.targetMonkeyIfTrue].startingItems.push(newWorryLevel);
        } else {
          if (shouldPrint) {
            print(`    Current worry level is not divisible by ${monkey.divisibilityTest}.`);
            print(
              `    Item with worry level ${newWorryLevel} is thrown to Monkey ${monkey.targetMonkeyIfFalse}`
            );
          }

          monkeys[monkey.targetMonkeyIfFalse].startingItems.push(newWorryLevel);
        }
      });

      monkey.startingItems = [];
    }
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
  const numRounds = 20;
  const monkeys = parseInputs(inputs);
  for (let i = 0; i < numRounds; i++) {
    play(monkeys, true, false);
  }

  const monkeyBusiness = calculateMonkeyBusiness(monkeys);
  print(
    `[Part 1] After ${numRounds} rounds of play, the level of monkey business is ${monkeyBusiness}.`
  );
  assert(monkeyBusiness === 88208); // real file
};

const partTwo = (inputs: string[]) => {
  const numRounds = 10000;
  const monkeys = parseInputs(inputs);
  for (let i = 0; i < numRounds; i++) {
    play(monkeys, false, true);
  }

  const monkeyBusiness = calculateMonkeyBusiness(monkeys);
  print(
    `[Part 2] After ${numRounds} rounds of play, the level of monkey business is ${monkeyBusiness}.`
  );
};

export default function () {
  const inputs = readTextFile(inputFilename);

  partOne(inputs);
  partTwo(inputs);

  print("Done.");
}
