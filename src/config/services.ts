// The five request types from Epic 1 story 1 and the sidebar in the OS designs.
export const SERVICES = [
  { slug: "location-equipment", label: "สถานที่และอุปกรณ์" },
  { slug: "equipment", label: "ยืมอุปกรณ์" },
  { slug: "parking", label: "ลานจอดรถ" },
  { slug: "traffic-route", label: "เปลี่ยนเส้นทางการจราจร" },
  { slug: "other", label: "ติดต่อเรื่องอื่น ๆ" },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];

export function getService(slug: string) {
  return SERVICES.find((service) => service.slug === slug);
}
