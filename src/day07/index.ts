import run from "aocrunner";

type Line = number;
type Input = Line[];

const parseInput = (rawInput: string): Input => {
  return rawInput.split(",").map(Number);
};

// Create a sparse array of crab buckets
const crabsToCrabBuckets = (crabs: number[]) => {
  const crabBuckets: number[] = [];
  crabs.forEach((crabIndex) => {
    if (crabIndex in crabBuckets) {
      crabBuckets[crabIndex] += 1;
    } else {
      crabBuckets[crabIndex] = 1;
    }
  });
  return crabBuckets;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const crabBuckets = crabsToCrabBuckets(input);

  // Naive O(N^2) solution
  let lowestScore = Number.MAX_VALUE;
  for (let i = 0; i < crabBuckets.length; i += 1) {
    let score = 0;
    for (let k = 0; k < crabBuckets.length; k += 1) {
      const diff = Math.abs(i - k);
      score += diff * (crabBuckets[k] ?? 0);
    }
    if (score < lowestScore) lowestScore = score;
  }

  return lowestScore;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const crabBuckets = crabsToCrabBuckets(input);

  // Naive O(N^2) solution
  let lowestScore = Number.MAX_VALUE;
  for (let i = 0; i < crabBuckets.length; i += 1) {
    let score = 0;
    for (let k = 0; k < crabBuckets.length; k += 1) {
      // Gauss
      // (n / 2)(first number + last number) = sum, where n is the number of integers.
      const diff = Math.abs(i - k);
      const sumOfConsecutive = (diff / 2) * (1 + diff);
      score += sumOfConsecutive * (crabBuckets[k] ?? 0);
    }
    if (score < lowestScore) lowestScore = score;
  }

  return lowestScore;
};

run({
  part1: {
    tests: [{ input: `16,1,2,0,4,2,7,1,2,14`, expected: 37 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: `16,1,2,0,4,2,7,1,2,14`, expected: 168 }],
    solution: part2,
  },
  trimTestInputs: true,
});
