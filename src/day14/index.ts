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

// Brute-force it
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
// Observation:
// A growth does not interact with any other, it's encapuslated inside it's pair
// The order of the pairs does not matter, only that they exist
// When a pair grows, it also disapears
// Each character in the pair count appears twice, except for start and end
//
// We calculate what pairs a pair grows
// Then we just keep count of the pairs
const part2 = (rawInput: string) => {
  const [polymerTemplate, rules] = parseInput(rawInput);

  // Generate a mapping of which pairs a pair grows
  const pairToPairs = Object.entries(rules).reduce((acc, [key, value]) => {
    const result = key.split("").join(value);
    const pairs = [result.slice(0, 2), result.slice(1, 3)];
    acc[key] = pairs;
    return acc;
  }, {} as Record<string, string[]>);

  // Build initial pairs
  const polymerTemplatePairs = [];
  for (let i = 1; i < polymerTemplate.length; i += 1) {
    polymerTemplatePairs.push(polymerTemplate.slice(i - 1, i + 1));
  }

  // Build initial pair count
  const blankPairCount = () =>
    Object.keys(rules).reduce((acc, pair) => {
      acc[pair] = 0;
      return acc;
    }, {} as Record<string, number>);
  const initialPairCount = blankPairCount();
  polymerTemplatePairs.forEach((pair) => (initialPairCount[pair] += 1));

  const step = (pairCount: Record<string, number>) => {
    const newPairCount = blankPairCount();
    for (let x of Object.keys(pairToPairs)) {
      const multiplier = pairCount[x];
      pairToPairs[x].forEach((pair) => {
        newPairCount[pair] += multiplier;
      });
    }
    return newPairCount;
  };

  const afterNSteps: Record<string, number> = Array(40)
    .fill(0)
    .reduce((acc) => step(acc), initialPairCount);

  const counts = Object.entries(afterNSteps).reduce((acc, [pair, count]) => {
    pair.split("").forEach((c) => {
      if (acc[c] === undefined) acc[c] = count;
      else acc[c] += count;
    });
    return acc;
  }, {} as Record<string, number>);

  const countsRemovedDuplicates = Object.entries(counts).reduce(
    (acc, [key, value]) => {
      acc[key] = Math.ceil(value / 2);
      return acc;
    },
    {} as Record<string, number>,
  );

  const sortedCountValues = Object.values(countsRemovedDuplicates).sort(
    (a, b) => a - b,
  );
  return sortedCountValues[sortedCountValues.length - 1] - sortedCountValues[0];
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
    tests: [
      // { input: testInput, expected: 1588 },
      { input: testInput, expected: 2188189693529 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
