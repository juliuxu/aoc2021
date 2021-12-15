import run from "aocrunner";
import { getAdjecentPositions, isInBounds } from "../utils/index.js";

type Pos = [x: number, y: number];
type Line = number[];
type Input = Line[];

const parseInput = (rawInput: string): Input => {
  return rawInput.split("\n").map((line) => line.split("").map(Number));
};

// This is a shortest path graph problem
// Where each node has 2, 3, or 4 directed edges
//
// Dijkstra to the rescue!
// https://www.youtube.com/watch?v=k1kLCB7AZbM
// https://www.youtube.com/watch?v=GazC3A4OQTE

const solveForGrid = (grid: Input) => {
  const index = (pos: Pos) => String(pos);
  const edgeIndexString = (nodeA: string, nodeB: string) =>
    nodeA + "->" + nodeB;
  const edgeIndex = (pos1: Pos, pos2: Pos) =>
    edgeIndexString(String(pos1), String(pos2));

  // Convert into graph
  const edgeScores: Record<string, number> = {};
  const nodeToEdges: Record<string, string[]> = {};
  for (let y = 0; y < grid.length; y += 1) {
    for (let x = 0; x < grid[y].length; x += 1) {
      const adjecentNodes = getAdjecentPositions([x, y]).filter(
        isInBounds(grid),
      );
      nodeToEdges[index([x, y])] = adjecentNodes.map(index);
      adjecentNodes.forEach(([toX, toY]) => {
        edgeScores[edgeIndex([x, y], [toX, toY])] = grid[toY][toX];
      });
    }
  }

  // Output graph
  console.log(
    `solving for graph with
    ${Object.keys(nodeToEdges).length} nodes
    ${Object.values(nodeToEdges).flat().length} edges`,
  );

  const start = index([0, 0]);
  const end = index([grid.length - 1, grid.length - 1]);

  // Setup data structures
  const nodeScores: Record<string, [number, string]> = {};
  Object.keys(nodeToEdges).forEach(
    (node) => (nodeScores[node] = [Number.POSITIVE_INFINITY, ""]),
  );
  const visited = new Set<string>();

  // Hacky priority queue using sort()
  const nextQueue: string[] = [];
  const nextQueueInsert = (node: string) => {
    nextQueue.unshift(node);
    nextQueue.sort((a, b) => nodeScores[a][0] - nodeScores[b][0]);
  };

  nodeScores[start] = [0, ""];
  nextQueueInsert(start);
  while (nextQueue.length > 0) {
    const currentNode = nextQueue.shift()!;
    const currentNodeScore = nodeScores[currentNode][0];
    if (visited.has(currentNode)) continue;

    nodeToEdges[currentNode].forEach((node) => {
      const edgeScore = edgeScores[edgeIndexString(currentNode, node)];
      const totalScore = currentNodeScore + edgeScore;
      if (totalScore < nodeScores[node][0]) {
        nodeScores[node] = [totalScore, currentNode];
      }
      if (!visited.has(currentNode)) nextQueueInsert(node);
    });

    visited.add(currentNode);
  }

  return nodeScores[end][0];
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return solveForGrid(input);
};

// Wow, 5 times as large
// 100x100 -> 500x500 = 250_000
// 4 edges for each = 1_000_000
//
// My machine has 64gb RAM, no problem, let's go!
const part2 = (rawInput: string) => {
  // if (!rawInput.includes("1163751742")) return 0; // TODO: remove
  const input = parseInput(rawInput);

  // Expand input
  const n = input.length;
  const newGrid: Input = Array(input.length * 5);
  for (let y = 0; y < newGrid.length; y += 1) {
    newGrid[y] = Array(input[0].length * 5);
    for (let x = 0; x < newGrid[y].length; x += 1) {
      const addition = Math.floor(y / n) + Math.floor(x / n);
      // console.log("addition", [x, y], addition);
      newGrid[y][x] = (input[y % n][x % n] + addition) % 9;
      if (newGrid[y][x] === 0) newGrid[y][x] = 9; // Lazy of by one fix
    }
  }

  // Print expanded grid
  const printGrid = (grid: Input) =>
    grid
      .map((line) => {
        return line.map((v, i) => {
          if (i % n === 0) return ` ${v}`;
          return `${v}`;
        });
      })
      .map(String)
      .forEach((v, i) => {
        if (i % n === 0) console.log();
        console.log(v);
      });
  // printGrid(newGrid);
  return solveForGrid(newGrid);
};

const testInput = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;
const snakeTestInput = `99999
19111
19191
11291
91991`;

run({
  part1: {
    tests: [
      { input: snakeTestInput, expected: 13 },
      { input: testInput, expected: 40 },
    ],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 315 }],
    solution: part2,
  },
  trimTestInputs: true,
});
