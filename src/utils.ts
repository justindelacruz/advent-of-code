import * as fs from "fs";

export function readTextFile(file: string): string[] {
  try {
    const data = fs.readFileSync(file, "utf8").split("\n");
    return data;
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

    return JSON.stringify(input, null, 4);
  });

  console.log(itemsToPrint.join(" "));
}
