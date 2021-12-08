import run from "aocrunner";
import { sum } from "../utils/index.js";

type Wire = "a" | "b" | "c" | "d" | "e" | "f" | "g";
type Signal = string;
type Line = [signals: Signal[], outputs: Signal[]];
type Input = Line[];

const parseInput = (rawInput: string): Input => {
  return rawInput.split("\n").map((entry) => {
    const s = entry.split(" | ");
    const signals = s[0].split(" ") as Signal[]; //.map((x) => x.split(""));
    const outputs = s[1].split(" ") as Signal[]; //.map((x) => x.split(""));
    return [signals, outputs];
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  // 1=2, 4=4, 7=3, 8=7
  const lengths = [2, 3, 4, 7];

  const occurrences = input
    .map(([_, outputs]) => outputs)
    .flat()
    .map((output) => output.length)
    .filter((outputLength) => lengths.includes(outputLength));

  return occurrences.length;
};

const segmentToNumber: Record<string, number> = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
};

// Brute force it!
// For each wireMapping, see if it would work with all signals, if not eliminate it
// Continue until each wire is mapped
const translate = (mapping: Record<Wire, Wire>, signal: Signal) => {
  return signal
    .split("")
    .map((x) => mapping[x as Wire])
    .sort() // Make sure it's in the correct order so the lookup succeeds
    .join("");
};

const validate = (signals: Signal[], mapping: Record<Wire, Wire>) =>
  signals.every((signal) => translate(mapping, signal) in segmentToNumber);

const decodeEntry = ([signals, outputs]: Line) => {
  const initialMappings = {
    a: undefined,
    b: undefined,
    c: undefined,
    d: undefined,
    e: undefined,
    f: undefined,
    g: undefined,
  };

  const inner = (
    currentMapping: Record<Wire, Wire | undefined>,
    remainingWires: Wire[],
  ): false | Record<Wire, Wire> => {
    // No more wires to map
    if (remainingWires.length === 0) {
      if (validate(signals, currentMapping as Record<Wire, Wire>))
        return currentMapping as Record<Wire, Wire>;
      else return false;
    }

    const currentWire = remainingWires[0];
    const nextRemainingWires = remainingWires.slice(1);
    for (let [key, value] of Object.entries(currentMapping)) {
      if (value !== undefined) continue;
      const possibleMapping = inner(
        { ...currentMapping, [key]: currentWire },
        nextRemainingWires,
      );
      if (possibleMapping !== false) return possibleMapping;
    }
    return false;
  };
  const mapping = inner(initialMappings, ["a", "b", "c", "d", "e", "f", "g"]);
  if (mapping === false) throw new Error(`mapping was not done for ${signals}`);

  const result = outputs
    .map((output) => translate(mapping, output))
    .map((signal) => segmentToNumber[signal]);
  return result.join("");
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return sum(input.map(decodeEntry).map(Number));
};

const testInput = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`;

run({
  part1: {
    tests: [{ input: testInput, expected: 26 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: testInput, expected: 61229 }],
    solution: part2,
  },
  trimTestInputs: true,
});
