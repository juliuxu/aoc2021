import run from "aocrunner";
import { sum } from "../utils/index.js";

type Line = number;
type Input = Line[];

const parseInput = (rawInput: string): Input => {
  return rawInput.split(",").map(Number);
};

const part1 = (rawInput: string, daysToSimulate = 80) => {
  const input = parseInput(rawInput);

  // Init fish tanks
  let fishes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  input.forEach((fishTimer) => {
    fishes[fishTimer] += 1;
  });

  // Simulate n days
  for (let i = 0; i < daysToSimulate; i += 1) {
    // Move fish timers to the left,
    // rounding to 6 and creating a new one on 8
    const newFishes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    fishes.forEach((numberOfFishes, timer) => {
      if (timer === 0) {
        newFishes[6] += numberOfFishes;
        newFishes[8] += numberOfFishes;
      } else {
        newFishes[timer - 1] += numberOfFishes;
      }
    });
    fishes = newFishes;
  }

  return sum(fishes.flat());
};

const part2 = (rawInput: string) => {
  return part1(rawInput, 256);
};

run({
  part1: {
    tests: [{ input: `3,4,3,1,2`, expected: 5934 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: `3,4,3,1,2`, expected: 26984457539 }],
    solution: part2,
  },
  trimTestInputs: true,
});
