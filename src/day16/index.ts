import run from "aocrunner";
import { product, sum } from "../utils/index.js";

type PacketOperator = {
  version: number;
  typeId: number;
  packets: Packet[];
};
type PacketLiteralValue = {
  version: number;
  typeId: 4;
  value: number;
};

type Packet = PacketLiteralValue | PacketOperator;

type Line = string;
type Input = Line;

const hexToBits = {
  "0": "0000",
  "1": "0001",
  "2": "0010",
  "3": "0011",
  "4": "0100",
  "5": "0101",
  "6": "0110",
  "7": "0111",
  "8": "1000",
  "9": "1001",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
} as const;

const parseInput = (rawInput: string): Input => {
  return rawInput
    .split("")
    .map((c) => hexToBits[c as keyof typeof hexToBits])
    .join("");
};

const unpack = (rawPacket: string): [bitsRead: number, packet: Packet] => {
  let packet = rawPacket;
  const take = (n: number) => {
    const result = packet.slice(0, n);
    packet = packet.slice(n);
    return result;
  };
  // Unpack header
  const version = parseInt(take(3), 2);
  const typeId = parseInt(take(3), 2);

  // console.log("version", version, "typeId", typeId);
  if (isNaN(version) || isNaN(typeId))
    throw new Error("invalid parsing of header");

  // CASE: typeId=4, literal value
  if (typeId === 4) {
    // TODO: Make into seperate function
    // TODO: Functional using partition and filter
    let bitsValue = "";
    let keepReading = true;
    while (keepReading) {
      keepReading = take(1) === "1";
      bitsValue += take(4);
    }
    const value = parseInt(bitsValue, 2);

    return [rawPacket.length - packet.length, { version, typeId, value }];
  }

  // CASE: Operator packet
  const lengthType = parseInt(take(1), 2);

  // Set shouldStop predicate
  let numberOfBitsInSubPackets = Number.POSITIVE_INFINITY;
  let numberOfSubPackets = Number.POSITIVE_INFINITY;
  // CASE lengthType: total length in bits
  if (lengthType === 0) numberOfBitsInSubPackets = parseInt(take(15), 2);

  // CASE lengthType: number of sub-packets immediately contained
  if (lengthType === 1) numberOfSubPackets = parseInt(take(11), 2);

  const shouldContinueReadingSubPackets = (
    bitsRead: number,
    subPacketsRead: number,
  ) =>
    bitsRead < numberOfBitsInSubPackets && subPacketsRead < numberOfSubPackets;

  // Read sub-packets
  const subPackets: Packet[] = [];
  let subPacketBitsRead = 0;
  while (
    shouldContinueReadingSubPackets(subPacketBitsRead, subPackets.length)
  ) {
    const [bitsRead, unpackedPacket] = unpack(packet);
    take(bitsRead);
    subPacketBitsRead += bitsRead;
    subPackets.push(unpackedPacket);

    // console.log("bitsRead", bitsRead);
    // console.log("subPacketBitsRead", subPacketBitsRead);
    // console.log("readpacket", JSON.stringify(unpackedPacket));
  }
  return [
    rawPacket.length - packet.length,
    { version, typeId, packets: subPackets },
  ];
};

const part1 = (rawInput: string) => {
  const bits = parseInput(rawInput);

  const [_, packet] = unpack(bits);
  // console.log(JSON.stringify(packet, null, 2));

  const getVersions = (p: Packet): number[] => {
    if ("packets" in p) return [p.version, ...p.packets.flatMap(getVersions)];
    return [p.version];
  };

  return sum(getVersions(packet));
};

const part2 = (rawInput: string) => {
  const bits = parseInput(rawInput);
  const [_, packet] = unpack(bits);

  const calculate = (p: Packet): number => {
    if (p.typeId === 4 && "value" in p) return p.value;

    if (p.typeId === 0) return sum(p.packets.map(calculate));
    if (p.typeId === 1) return product(p.packets.map(calculate));
    if (p.typeId === 2) return Math.min(...p.packets.map(calculate));
    if (p.typeId === 3) return Math.max(...p.packets.map(calculate));

    const [a, b] = (p as PacketOperator).packets.map(calculate);
    if (p.typeId === 5) return a > b ? 1 : 0;
    if (p.typeId === 6) return a < b ? 1 : 0;
    if (p.typeId === 7) return a === b ? 1 : 0;

    throw new Error(`unhandled typeId ${p.typeId}`);
  };

  return calculate(packet);
};

run({
  part1: {
    tests: [
      { input: `8A004A801A8002F478`, expected: 16 },
      { input: `620080001611562C8802118E34`, expected: 12 },
      { input: `C0015000016115A2E0802F182340`, expected: 23 },
      { input: `A0016C880162017C3686B18A3D4780`, expected: 31 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: "C200B40A82", expected: 3 }, // finds the sum of 1 and 2, resulting in the value 3.
      { input: "04005AC33890", expected: 54 }, // finds the product of 6 and 9, resulting in the value 54.
      { input: "880086C3E88112", expected: 7 }, // finds the minimum of 7, 8, and 9, resulting in the value 7.
      { input: "CE00C43D881120", expected: 9 }, // finds the maximum of 7, 8, and 9, resulting in the value 9.
      { input: "D8005AC2A8F0", expected: 1 }, // produces 1, because 5 is less than 15.
      { input: "F600BC2D8F", expected: 0 }, // produces 0, because 5 is not greater than 15.
      { input: "9C005AC2F8F0", expected: 0 }, // produces 0, because 5 is not equal to 15.
      { input: "9C0141080250320F1802104A08", expected: 1 }, // produces 1, because 1 + 3 = 2 * 2.
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
