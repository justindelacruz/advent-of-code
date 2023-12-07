# Advent of Code: 2023

https://adventofcode.com/

Solved in TypeScript

## How to run

```bash
cd 2023
yarn
# Pass in the desired Advent of Code script as an argument
yarn watch day-01
```

## Notes

Note on Notes: I didn't start taking notes until Day 5.

### Day 5

- Brute-foce part 2 solution took ~60 minutes to execute.
- Learned how to use `worker_threads` to parallelize the CPU-bound calculations. Might as well use my multicore process for _something_.
  - This solution executed in about ~15 minutes!
- Note to self: There is a smarter way to solve this by using "start" and "end" instead of "start" and "length".

### Day 7

- Reminder to self: JavaScript has lexicographical sorting, which is entirely unhelpful when sorting cards
  ```js
  > [4,6,11,1,2].sort()
  [ 1, 11, 2, 4, 6 ]
  ```
- I should leave more inline comments to explain my thinking more.