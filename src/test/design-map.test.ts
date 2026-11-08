import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "bun:test";

const root = process.cwd();
const map = readFileSync(join(root, "docs/design-map.md"), "utf8");
const referenced = [...map.matchAll(/`([^`]+\.svg)`/g)].map(
  (match) => match[1]!,
);

describe("docs/design-map.md", () => {
  it("references design files", () => {
    expect(referenced.length).toBeGreaterThan(0);
  });

  it.each(referenced)("%s exists in designs/", (file) => {
    expect(existsSync(join(root, "designs", file))).toBe(true);
  });
});
