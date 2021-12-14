import run from "aocrunner";

type Replacements = Record<string, string>;
type Rules = Record<string, string>;
type Input = [string, Rules];

const parseInput = (rawInput: string): Input => {
  const parts = rawInput.split("\n\n");
  const rules = parts[1].split("\n").reduce((acc, line) => {
    const splitted = line.split(" -> ");
    acc[splitted[0]] = splitted[1];
    return acc;
  }, {} as Rules);
  return [parts[0], rules];
};

const part1 = (rawInput: string, nSteps = 10) => {
  const [polymerTemplate, rules] = parseInput(rawInput);

  const step = (s: string, rules: Rules) => {
    let result = "";
    result += s[0];
    for (let i = 1; i < s.length; i += 1) {
      const currentPair = s.slice(i - 1, i + 1);
      if (currentPair in rules) result += rules[currentPair];
      result += s[i];
    }
    return result;
  };

  const afterNSteps: string = Array(nSteps)
    .fill(0)
    .reduce((acc) => step(acc, rules), polymerTemplate);

  const counts = afterNSteps.split("").reduce((acc, c) => {
    if (acc[c] === undefined) acc[c] = 1;
    else acc[c] += 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedCountValues = Object.values(counts).sort((a, b) => a - b);

  return sortedCountValues[sortedCountValues.length - 1] - sortedCountValues[0];
};

// n=40 is just to much to brute-force
const part2 = (rawInput: string) => {
  const [polymerTemplate, rules] = parseInput(rawInput);

  return 0;
};

const testInput = `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C`;

run({
  part1: {
    tests: [{ input: testInput, expected: 1588 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 2188189693529 }],
    solution: part2,
  },
  trimTestInputs: true,
});
