import run from "aocrunner";
import { sum } from "../utils/index.js";

type Pos = [x: number, y: number];
type Line = number[];
type Input = Line[];

const parseInput = (rawInput: string): Input => {
  return rawInput.split("\n").map((line) => line.split("").map(Number));
};

const isOutOfBounds = ([x, y]: Pos, grid: Input) =>
  x >= grid.length || x < 0 || y >= grid[x].length || y < 0;

// Mutates octos and returns number of flashes
const step = (octos: Input) => {
  const flashes = new Set<string>();
  const hasFlashed = ([x, y]: Pos) => flashes.has(`${x}_${y}`);
  const addFlash = ([x, y]: Pos) => flashes.add(`${x}_${y}`);

  const inner = ([x, y]: Pos) => {
    if (isOutOfBounds([x, y], octos)) return;
    if (octos[x][y] === 0 && hasFlashed([x, y])) return;
    if (octos[x][y] === 9) {
      octos[x][y] = 0;
      addFlash([x, y]);

      // Populate to adjecent
      // Vertical, Horizontal, Diagonal
      inner([x + 1, y]);
      inner([x - 1, y]);
      inner([x, y + 1]);
      inner([x, y - 1]);

      inner([x + 1, y + 1]);
      inner([x + 1, y - 1]);
      inner([x - 1, y + 1]);
      inner([x - 1, y - 1]);
    } else {
      octos[x][y] += 1;
    }
  };

  for (let x = 0; x < octos.length; x++) {
    for (let y = 0; y < octos[x].length; y++) {
      inner([x, y]);
    }
  }

  return flashes.size;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const flashesPerStep = Array(100)
    .fill(0)
    .map(() => step(input));
  return sum(flashesPerStep);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const requiredFlashes = input.length * input[0].length;
  for (let stepN = 1; true; stepN += 1) {
    const numberOfFlashes = step(input);
    if (numberOfFlashes === requiredFlashes) {
      return stepN;
    }
  }
};

const testInput = `5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`;

run({
  part1: {
    tests: [{ input: testInput, expected: 1656 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 195 }],
    solution: part2,
  },
  trimTestInputs: true,
});
