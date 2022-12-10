import day01 from "./day-01-calorie-counting/day-01";
import day02 from "./day-02-rock-paper-scissors/day-02";
import day03 from "./day-03-rucksack-organization/day-03";

const day = process.argv[2];

console.log(`Selected ${day}`);
console.log("============================");

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
  default: {
    console.error(
      "Error: Need to know which Advent of Code day you want to run"
    );
  }
}
