import run from "aocrunner";
import { product, sum } from "../utils/index.js";

type Pos = [y: number, x: number];
type Line = number[];
type Input = Line[];

const parseInput = (rawInput: string): Input => {
  return rawInput.split("\n").map((line) => line.split("").map(Number));
};

// Check if a point is a lowpoint, meaning all adjecant points are higher
const isLowPoint = ([y, x]: Pos, heightmap: Input) => {
  const value = heightmap[y][x];
  if (y + 1 < heightmap.length && heightmap[y + 1][x] <= value) return false;
  if (y - 1 >= 0 && heightmap[y - 1][x] <= value) return false;
  if (x + 1 < heightmap[y].length && heightmap[y][x + 1] <= value) return false;
  if (x - 1 >= 0 && heightmap[y][x - 1] <= value) return false;
  return true;
};

// Check all points and build a list of the lowpoints
const getLowPoints = (heightmap: Input) => {
  const lowPoints: Pos[] = [];
  for (let y = 0; y < heightmap.length; y += 1) {
    for (let x = 0; x < heightmap[y].length; x += 1) {
      if (isLowPoint([y, x], heightmap)) lowPoints.push([y, x]);
    }
  }
  return lowPoints;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lowPoints = getLowPoints(input);

  // Get the lowpoint values, calculate risk level, and return the sum
  const values = lowPoints.map(([y, x]) => input[y][x]).map((x) => x + 1);
  return sum(values);
};

// Get all basis
// All basins are connect with a single lowpoint,
// meaning 1 lowpoint has 1 basin
// Then we just have for each lowpoint calculate it's basin
// A point is part of a basin point, if
// 1. It's not 9
// 2. It's value is higher than the connected basin point
//
// Alternativly we could for each point find it's connected lowpoint,
// since all points is part of basin, except for 9's
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lowPoints = getLowPoints(input);

  const hashPoint = ([y, x]: Pos) => `${y}-${x}`;
  const isOutOfBounds = ([y, x]: Pos) =>
    y >= input.length || y < 0 || x >= input[y].length || x < 0;
  const getBasinPoints = ([startY, startX]: Pos) => {
    const visitedPoints = new Set<string>();
    const basinPoints: Pos[] = [];
    const inner = ([y, x]: Pos) => {
      if (isOutOfBounds([y, x])) return;
      if (visitedPoints.has(hashPoint([y, x]))) return;
      visitedPoints.add(hashPoint([y, x]));

      if (input[y][x] === 9) return;

      basinPoints.push([y, x]);
      inner([y + 1, x]);
      inner([y - 1, x]);
      inner([y, x + 1]);
      inner([y, x - 1]);
    };

    inner([startY, startX]);

    return basinPoints;
  };

  return product(
    lowPoints
      .map(getBasinPoints)
      .map((x) => x.length)
      .sort((a, b) => a - b)
      .reverse()
      .slice(0, 3),
  );
};

const testInpt = `
2199943210
3987894921
9856789892
8767896789
9899965678`;

run({
  part1: {
    tests: [{ input: testInpt, expected: 15 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInpt, expected: 1134 }],
    solution: part2,
  },
  trimTestInputs: true,
});
