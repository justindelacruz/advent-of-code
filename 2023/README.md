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

### Day 10

I needed to remind myself of the even-odd test, which I totally forgot about:

https://iq.opengenus.org/inside-outside-test/:
> The algorithm follows a basic observation that if a ray coming from infinity crosses through border of polygon, then it goes from outside to inside and outside to inside alternately. For every two crossings, point lies outside of polygon.
 
### Day 12
 
The first stumper.

### Day 14

I have no idea how I would have solved this entirely in code. However, I wanted to see if I could spot any patterns that would make this problem easier to solve.
So, I plotted the "total loads after each cycle" into a line chart. Like magic, I saw a
pattern right away!
