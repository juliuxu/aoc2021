import run from "aocrunner";

type Pos = [x: number, y: number];
type Fold = ["x" | "y", number];
type Input = [Pos[], Fold[]];

const parseInput = (rawInput: string): Input => {
  const splitted = rawInput.split("\n\n");
  const dots = splitted[0]
    .split("\n")
    .map((line) => line.split(",").map(Number) as Pos);
  const folds = splitted[1].split("\n").map((line) => {
    const m = line.match(/^fold along (\w)=(\d+)$/);
    return [m![1], Number(m![2])] as Fold;
  });
  return [dots, folds];
};

const fold = ([axis, n]: Fold, dots: Pos[]) => {
  let newDots: Pos[] = [];
  dots.forEach(([x, y]) => {
    // When n=7, y=8, the formula is: n - (y-n)
    if (axis === "y") {
      if (y < n) newDots.push([x, y]);
      else newDots.push([x, n - (y - n)]);
    } else {
      if (x < n) newDots.push([x, y]);
      else newDots.push([n - (x - n), y]);
    }
  });

  // Remove duplicates
  const s = new Set<string>();
  newDots = newDots.filter((pos) => {
    const index = String(pos);
    const result = !s.has(index);
    s.add(index);
    return result;
  });

  return newDots;
};

const part1 = (rawInput: string) => {
  const [dots, folds] = parseInput(rawInput);

  const foldedDots = fold(folds[0], dots);
  return foldedDots.length;
};

const part2 = (rawInput: string) => {
  const [dots, folds] = parseInput(rawInput);
  const foldedDots = folds.reduce(
    (acc, foldInstruction) => fold(foldInstruction, acc),
    dots,
  );

  // Create lookup set
  const lookupSet = new Set<string>(foldedDots.map(String));

  // Draw the dots
  const maxX = Math.max(...foldedDots.map(([x]) => x)) + 1;
  const maxY = Math.max(...foldedDots.map(([_, y]) => y)) + 1;
  const output = Array(maxY);
  for (let y = 0; y < maxY; y += 1) {
    output[y] = Array(maxX).fill(" ");
    for (let x = 0; x < maxX; x += 1) {
      if (lookupSet.has(String([x, y]))) output[y][x] = "X";
    }
  }

  // Read this in console, then take note of the code
  console.log(output.map((line) => line.join("")).join("\n"));

  return "BLKJRBAG";
};

const testInput = `6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5`;

run({
  part1: {
    tests: [{ input: testInput, expected: 17 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: "" }],
    solution: part2,
  },
  trimTestInputs: true,
});
