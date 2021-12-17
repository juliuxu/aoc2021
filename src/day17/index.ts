import run from "aocrunner";

type Pos = [x: number, y: number];
type TargetArea = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};
type Input = TargetArea;

const parseInput = (rawInput: string): Input => {
  const re =
    /target area: x=(?<minX>-?\d+)..(?<maxX>-?\d+), y=(?<minY>-?\d+)..(?<maxY>-?\d+)/;
  const groups = rawInput.match(re)!.groups!;
  return {
    minX: Number(groups.minX),
    maxX: Number(groups.maxX),
    minY: Number(groups.minY),
    maxY: Number(groups.maxY),
  };
};

/**
 * We want the shoot the highest Y and STILL eventually land/go through the target area!
 *
 * Looking at the input, the x and y values don't seem that large
 * bruteforce should probably be sufficent
 *
 * Let's simulate a number of velocites
 *
 * When do we stop stepping?
 * When the position is passed either target.maxX or target.minY
 *
 * When do we stop trying x, y velocities?
 * For X, when we are passed the target is ok
 * what about Y? We can try to be cheeky and just set a high Y value
 * and see if we get away with it
 *
 * Lol, it worked!
 *
 * 💭 Hmm, can this be be calculated without bruteforcing?
 */
const isInsideTargetArea = (
  [x, y]: Pos,
  { minX, maxX, minY, maxY }: TargetArea,
) => x >= minX && x <= maxX && y >= minY && y <= maxY;

const hasOvershot = ([x, y]: Pos, { maxX, minY }: TargetArea) =>
  x > maxX || y < minY;

const simulate = (startVelocity: Pos, target: TargetArea) => {
  let [x, y] = [0, 0];
  let [velocityX, velocityY] = startVelocity;
  let highestY = Number.MIN_SAFE_INTEGER;
  while (!hasOvershot([x, y], target)) {
    // Step
    x += velocityX;
    y += velocityY;

    // Modify velocity
    if (velocityX > 0) velocityX -= 1;
    else if (velocityX < 0) velocityX += 1;

    velocityY -= 1;

    // Set highest Y
    if (y > highestY) highestY = y;

    // Check if inside target
    if (isInsideTargetArea([x, y], target)) return highestY;
  }
  return undefined;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let highestY = Number.MIN_SAFE_INTEGER;
  for (let y = -10000; y < 10000; y += 1) {
    if (y % 1000 === 0) console.log("trying", y);
    for (let x = 0; x < input.maxX + 1; x += 1) {
      let result = simulate([x, y], input);
      if (result !== undefined && result > highestY) highestY = result;
    }
  }

  return highestY;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const possibleStartVelocities: Pos[] = [];
  for (let y = -10000; y < 10000; y += 1) {
    if (y % 1000 === 0) console.log("trying", y);
    for (let x = 0; x < input.maxX + 1; x += 1) {
      let result = simulate([x, y], input);
      if (result !== undefined) possibleStartVelocities.push([x, y]);
    }
  }

  return possibleStartVelocities.length;
};

const testInput = `target area: x=20..30, y=-10..-5`;

run({
  part1: {
    tests: [{ input: testInput, expected: 45 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 112 }],
    solution: part2,
  },
  trimTestInputs: true,
});
