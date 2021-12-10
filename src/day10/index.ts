import run from "aocrunner";
import { sum } from "../utils/index.js";

type OPEN_CHAR = "(" | "[" | "{" | "<";
type CLOSE_CHAR = ")" | "]" | "}" | ">";
type Line = (OPEN_CHAR | CLOSE_CHAR)[];
type Input = Line[];

const parseInput = (rawInput: string): Input => {
  return rawInput.split("\n").map((line) => line.split("") as Line);
};

const openToClose = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
} as const;
const closeToOpen = {
  ")": "(",
  "]": "[",
  "}": "{",
  ">": "<",
} as const;

/**
 * Validate a single line
 *
 * A line is either
 * 1. Corrupted
 * 2. Incomplete
 * 3. Valid
 */
type Corrupted = { status: "corrupted"; got: CLOSE_CHAR; expected: CLOSE_CHAR };
type Incomplete = { status: "incomplete"; missing: CLOSE_CHAR[] };
type Valid = { status: "valid" };
type ValidateResult = Corrupted | Incomplete | Valid;
const validateLine = (line: Line): ValidateResult => {
  const expectedClose: CLOSE_CHAR[] = [];
  for (let c of line) {
    if (c in closeToOpen) {
      if (expectedClose.length === 0) throw new Error("expectedClose is empty");
      const expected = expectedClose.shift() as CLOSE_CHAR;
      if (expected !== c)
        return {
          status: "corrupted",
          got: c as CLOSE_CHAR,
          expected: expected,
        };
    } else {
      expectedClose.unshift(openToClose[c as OPEN_CHAR]);
    }
  }

  if (expectedClose.length > 0)
    return { status: "incomplete", missing: expectedClose };
  return { status: "valid" };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const incorrectClosing = input
    .map(validateLine)
    .filter((result): result is Corrupted => result.status === "corrupted")
    .map((result) => result.got);

  const closeToSyntaxScore = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };
  const calculateSyntaxScore = (closeChars: CLOSE_CHAR[]) =>
    sum(closeChars.map((c) => closeToSyntaxScore[c]));

  return calculateSyntaxScore(incorrectClosing);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const missingClosing = input
    .map(validateLine)
    .filter((result): result is Incomplete => result.status === "incomplete")
    .map((result) => result.missing);

  const closeToAutocompleteScore = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };
  const calculateAutocompleteScore = (closeChars: CLOSE_CHAR[]) =>
    closeChars.reduce((acc, c) => acc * 5 + closeToAutocompleteScore[c], 0);

  const scores = missingClosing
    .map(calculateAutocompleteScore)
    .sort((a, b) => a - b);
  return scores[(scores.length - 1) / 2];
};

const testInput = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`;

run({
  part1: {
    tests: [{ input: testInput, expected: 26397 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 288957 }],
    solution: part2,
  },
  trimTestInputs: true,
});
