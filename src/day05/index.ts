import run from "aocrunner";

type Pos = [x: number, y: number];
type Line = [Pos, Pos];
type Input = Line[];

const parseInput = (rawInput: string): Input => {
  return rawInput
    .split("\n")
    .map((line) =>
      line.split(" -> ").map((rawPos) => rawPos.split(",").map(Number)),
    ) as Line[];
};

const markPath = (
  [[startX, startY], [endX, endY]]: Line,
  grid: Record<string, number>,
) => {
  const markPosition = ([x, y]: Pos) => {
    const index = `${x},${y}`;
    const currentValue = grid[index];
    grid[index] = currentValue === undefined ? 1 : currentValue + 1;
  };
  let [nextX, nextY] = [startX, startY];

  markPosition([endX, endY]); // Mark ending position as they will not get marked in the loop below
  while (nextX !== endX || nextY !== endY) {
    markPosition([nextX, nextY]);

    // Advance to next position
    if (nextX < endX) nextX += 1;
    if (nextX > endX) nextX -= 1;
    if (nextY < endY) nextY += 1;
    if (nextY > endY) nextY -= 1;
  }
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const noDiagonals = input.filter(
    ([[x1, y1], [x2, y2]]) => x1 === x2 || y1 === y2,
  );

  const grid: Record<string, number> = {};
  noDiagonals.forEach((line) => markPath(line, grid));

  const positionWithMultipleOverlaps = Object.entries(grid).filter(
    ([_, value]) => value > 1,
  );

  return positionWithMultipleOverlaps.length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const grid: Record<string, number> = {};
  input.forEach((line) => markPath(line, grid));

  const positionWithMultipleOverlaps = Object.entries(grid).filter(
    ([_, value]) => value > 1,
  );

  return positionWithMultipleOverlaps.length;
};
const testInput = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`;

run({
  part1: {
    tests: [{ input: testInput, expected: 5 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 12 }],
    solution: part2,
  },
  trimTestInputs: true,
});
