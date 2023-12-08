const days: Record<string, string> = {
  "day-01": "./day-01-trebuchet",
  "day-02": "./day-02-cube-conundrum",
  "day-03": "./day-03-gear-ratios",
  "day-04": "./day-04-scratchcards",
  "day-05": "./day-05-if-you-give-a-seed-a-fertilizer",
  "day-06": "./day-06-wait-for-it",
  "day-07": "./day-07-camel-cards",
  "day-08": "./day-08-haunted-wasteland",
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
