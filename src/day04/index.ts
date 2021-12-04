import run from "aocrunner";
import { sum } from "../utils/index.js";

// A 5x5 number grid
type Row = [number, number, number, number, number];
type Board = [Row, Row, Row, Row, Row];
type Input = [number[], Board[]];

const parseBoard = (rawInput: string): Board => {
  const board = rawInput
    .split("\n")
    .map((line) => line.trim())
    .map((line) =>
      line
        .split(" ")
        .map((x) => x.trim())
        .filter((x) => x !== "")
        .map(Number),
    );

  if (rawInput.includes("14 21 17 24  4")) {
    // console.log("raw", rawInput);
    // console.log("parsed board", board);
  }
  return board as Board;
};

const parseInput = (rawInput: string): Input => {
  const lines = rawInput.split("\n\n");
  const numbers = lines[0].split(",").map(Number);
  const boards = lines.slice(1).map(parseBoard);

  return [numbers, boards];
};

/**
 * Naive approach
 */
const isBingo = (board: Board, drawnNumbers: Set<number>) => {
  // if (board[0][0] === 10 && board[0][1] === 0) {
  //   console.log("isBingo", board, drawnNumbers);
  // }

  for (let row of board.values()) {
    if (row.filter((x) => !drawnNumbers.has(x)).length === 0) {
      // console.log("bingo by row");
      return true;
    }
  }
  for (let i = 0; i < 5; i += 1) {
    const column = [
      board[0][i],
      board[1][i],
      board[2][i],
      board[3][i],
      board[4][i],
    ];

    if (column.filter((x) => !drawnNumbers.has(x)).length === 0) {
      // console.log("bingo by column");
      return true;
    }
  }
  return false;
};

const calculateBoardSum = (
  board: Board,
  currentDrawn: number,
  drawnNumbers: Set<number>,
) => {
  const remainingNumbers = board.flat().filter((x) => !drawnNumbers.has(x));

  return sum(remainingNumbers) * currentDrawn;
};

const part1 = (rawInput: string) => {
  const [numbers, boards] = parseInput(rawInput);

  const drawnNumbers = new Set<number>();
  for (let n of numbers) {
    drawnNumbers.add(n);
    for (let board of boards) {
      if (isBingo(board, drawnNumbers)) {
        return calculateBoardSum(board, n, drawnNumbers);
      }
    }
  }
};

const part2 = (rawInput: string) => {
  const [numbers, boards] = parseInput(rawInput);

  const drawnNumbers = new Set<number>();
  let nextBoards = boards;
  for (let n of numbers) {
    drawnNumbers.add(n);
    if (nextBoards.length > 1) {
      nextBoards = nextBoards.filter((board) => !isBingo(board, drawnNumbers));
    } else {
      if (isBingo(nextBoards[0], drawnNumbers, n)) {
        return calculateBoardSum(nextBoards[0], n, drawnNumbers);
      }
    }
  }
};

const testInput = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`;

const testInput2 = `1,2,3,4,5,6

3 15  0  2 22
9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

10  0  0  0  1
 0  0  0  0  2
 0  0  0  0  3
 0  0  0  0  4
 0  0  0  0  5
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 4512,
      },
      { input: testInput2, expected: 50 },
    ],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 1924 }],
    solution: part2,
  },
  trimTestInputs: true,
});
