// The API names buildings as in the sheet. The designs show Thai names, in this order.
const LABELS: Record<string, string> = {
  "ENG 3": "อาคาร 3",
  "ENG 4": "อาคาร 4",
  "ENG 100": "อาคารวิศวฯ 100 ปี",
  ลานกิจกรรม: "ลานกิจกรรม",
  "ห้องพิเศษ + ห้องภาค": "ห้องพิเศษและห้องภาค",
};
const ORDER = Object.keys(LABELS);

export const buildingLabel = (name: string) => LABELS[name] ?? name;

/** Known buildings in the design's order, then any new ones as they come. */
export const sortBuildings = (names: string[]) =>
  [...names].sort((a, b) => {
    const rank = (name: string) => {
      const index = ORDER.indexOf(name);
      return index === -1 ? ORDER.length : index;
    };
    return rank(a) - rank(b);
  });
