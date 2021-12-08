# 🎄 Advent of Code 2021 - day 8 🎄

## Info

Task description: [link](https://adventofcode.com/2021/day/8)

## Notes

some sketched code

```typescript
const numberToSegment = {
  0: "abcefg",
  1: "cf",
  2: "acdeg",
  3: "acdfg",
  4: "bcdf",
  5: "abdfg",
  6: "abdefg",
  7: "acf",
  8: "abcdefg",
  9: "abcdfg",
};
const segmentToNumber = {
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
const segmentLengths = {
  0: 6,
  1: 2,
  2: 5,
  3: 5,
  4: 4,
  5: 5,
  6: 6,
  7: 3,
  8: 7,
  9: 6,
};
const decodeEntry = ([signals, outputs]: Line) => {
  const possibleWireMappings = {
    a: "abcdefg",
    b: "abcdefg",
    c: "abcdefg",
    d: "abcdefg",
    e: "abcdefg",
    f: "abcdefg",
    g: "abcdefg",
  };

  const generateCombinations = (objects: string, n: number) => {
    if (objects.length === 0) return [];
    if (objects.length === 1) return [objects];
    // for ()
  };
  const possibleSegmentMappings = {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
  };

  // Deduce
  //  generate combinations
  //  eliminate combinations
  //  verifiy online one possible for each
  // Map to segmentMapping
  // Decode outputs
  return 1234;
};
```
