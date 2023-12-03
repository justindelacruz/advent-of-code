import * as fs from "fs";

export function readTextFile(file: string): string[] {
  try {
    return fs.readFileSync(file, "utf8").split("\n");
  } catch (err) {
    console.error(err);
  }

  return [];
}

export function print(...inputs: any): void {
  const itemsToPrint = inputs.map((input: any) => {
    if (typeof input === "string") {
      return input;
    }

    if (typeof input === "symbol") {
      return input.toString();
    }

    return JSON.stringify(input, null, 4);
  });

  console.log(itemsToPrint.join(" "));
}
