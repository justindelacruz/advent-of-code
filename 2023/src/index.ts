const days: Record<string, string> = {
  "day-01": "./day-01-trebuchet",
  "day-02": "./day-02-cube-conundrum",
  "day-03": "./day-03-gear-ratios",
  "day-04": "./day-04",
};

async function main() {
  const day = process.argv[2];
  console.log(`Advent of Code 2023 - ${day}`);
  console.log("================================================================");

  const file = days[day];
  if (file) {
    const { default: run } = await import(file);
    run();
  } else {
    console.error(`Error: Couldn't find anything for ${day}`);
  }

  console.log("");
  console.log("Done.");
}

main();
