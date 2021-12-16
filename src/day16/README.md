# 🎄 Advent of Code 2021 - day 16 🎄

## Info

Task description: [link](https://adventofcode.com/2021/day/16)

## Notes

Option: Create a Maybe unpack, which fails if the packet is invalid
Then we can use this to try out all sub-packet combinations

Might not need to
A literal value packet has a fixed size
A operator packet with one more literal value packets is also fixed size
Therefor a operator packet has determinstic size
We just need to know when to stop
after a packet is read we just to check the condition

Since the outer layer can't know how long a sub-packet is,
this needs to be communicated. We can return number of bits read,
opposed to actually mutating the global string, which would work
