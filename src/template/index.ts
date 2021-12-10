import run from "aocrunner";

type Line = {};
type Input = Line[];

const parseInput = (rawInput: string): Input => {
  return rawInput.split("\n");
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const testInput = ``;

run({
  part1: {
    tests: [{ input: testInput, expected: "" }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: "" }],
    solution: part2,
  },
  trimTestInputs: true,
});
