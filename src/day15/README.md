# 🎄 Advent of Code 2021 - day 15 🎄

## Info

Task description: [link](https://adventofcode.com/2021/day/15)

## Notes

Scrapped naive depth first solution, works, but is absolutly to slow

```typescript
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const [endX, endY]: Pos = [
    input[input.length - 1].length - 1,
    input.length - 1,
  ];
  const traverse = ([x, y]: Pos, visited: Set<string>): number => {
    const thisRisk = input[y][x];
    if (x === endX && y === endY) return thisRisk;

    const next = getAdjecentPositions([x, y])
      .filter(isInBounds(input))
      .filter((pos) => !visited.has(String(pos)));
    const nextVisited = new Set(visited);
    nextVisited.add(String([x, y]));

    // console.log("v", [...visited], "c", [x, y], "n", next);

    const lowest = Math.min(
      ...next.map((pos) => traverse(pos, nextVisited) + thisRisk),
    );
    return lowest;
  };

  if (rawInput.includes("98996231679557")) return 0;
  // console.log(input);
  return traverse([0, 0], new Set()) - input[0][0];
};
```
