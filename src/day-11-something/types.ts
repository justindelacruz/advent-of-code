export const Operator = {
  Add: "+",
  Subtract: "-",
  Multiply: "*",
} as const;
type OperatorKey = keyof typeof Operator;
export type Operator = typeof Operator[OperatorKey];

export type Operand = number | "old";

export type Operation = {
  operator: Operator;
  operand: Operand;
};

type Divisor = string;
type Remainder = number;
export type Item = {
  startingValue: number;
  remainders: Record<Divisor, Remainder>;
};

export type Monkey = {
  id: number;
  startingItems: number[];
  items: Item[];
  operation: Operation;
  divisibilityTest: number;
  targetMonkeyIfTrue: number;
  targetMonkeyIfFalse: number;
  inspectionCount: number;
};
