async function main() {
  const day = process.argv[2];
  console.log(`Advent of Code 2022 - ${day}`);
  console.log("================================================================");

  switch (day) {
    case "day-01": {
      const { default: run } = await import("./day-01-calorie-counting/day-01");
      run();
      break;
    }
    case "day-02": {
      const { default: run } = await import("./day-02-rock-paper-scissors/day-02");
      run();
      break;
    }
    case "day-03": {
      const { default: run } = await import("./day-03-rucksack-organization/day-03");
      run();
      break;
    }
    case "day-04": {
      const { default: run } = await import("./day-04-camp-cleanup/day-04");
      run();
      break;
    }
    case "day-05": {
      const { default: run } = await import("./day-05-supply-stacks/day-05");
      run();
      break;
    }
    case "day-06": {
      const { default: run } = await import("./day-06-tuning-trouble/day-06");
      run();
      break;
    }
    case "day-07": {
      const { default: run } = await import("./day-07-no-space-left-on-device/day-07");
      run();
      break;
    }
    case "day-08": {
      const { default: run } = await import("./day-08-treetop-tree-house/day-08");
      run();
      break;
    }
    case "day-09": {
      const { default: run } = await import("./day-09-rope-bridge/day-09");
      run();
      break;
    }
    case "day-10": {
      const { default: run } = await import("./day-10-cathode-ray-tube/day-10");
      run();
      break;
    }
    case "day-11": {
      const { default: run } = await import("./day-11-monkey-in-the-middle/day-11");
      run();
      break;
    }
    case "day-12": {
      const { default: run } = await import("./day-12-something/day-12");
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
