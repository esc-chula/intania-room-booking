import { describe, expect, it } from "bun:test";
import { buildingLabel, sortBuildings } from "./buildings";

describe("buildings", () => {
  it("uses the Thai names from the design", () => {
    expect(buildingLabel("ENG 3")).toBe("อาคาร 3");
    expect(buildingLabel("ENG 100")).toBe("อาคารวิศวฯ 100 ปี");
    expect(buildingLabel("ห้องพิเศษ + ห้องภาค")).toBe("ห้องพิเศษและห้องภาค");
    expect(buildingLabel("New hall")).toBe("New hall");
  });

  it("orders them as the design does and keeps new ones last", () => {
    expect(
      sortBuildings([
        "ห้องพิเศษ + ห้องภาค",
        "Zed",
        "ENG 100",
        "ENG 3",
        "ENG 4",
      ]),
    ).toEqual(["ENG 3", "ENG 4", "ENG 100", "ห้องพิเศษ + ห้องภาค", "Zed"]);
  });
});
