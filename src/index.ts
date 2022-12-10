import day01 from "./day-01-calorie-counting/day-01";
import day02 from "./day-02-rock-paper-scissors/day-02";
import day03 from "./day-03-rucksack-organization/day-03";
import day04 from "./day-04-camp-cleanup/day-04";

const day = process.argv[2];

console.log(`Advent of Code 2022 - ${day}`);
console.log("================================================================");

switch (day) {
  case "day-01": {
    day01();
    break;
  }
  case "day-02": {
    day02();
    break;
  }
  case "day-03": {
    day03();
    break;
  }
  case "day-04": {
    day04();
    break;
  }
  default: {
    console.error(`Error: Couldn't find anything for ${day}`);
  }
}
