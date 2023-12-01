async function main() {
  const day = process.argv[2];
  console.log(`Advent of Code 2023 - ${day}`);
  console.log("================================================================");

  switch (day) {
    case "day-01": {
      const { default: run } = await import("./day-01-trebuchet");
      run();
      break;
    }
    default: {
      console.error(`Error: Couldn't find anything for ${day}`);
    }
  }

  console.log("Done.");
}

main();
