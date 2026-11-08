import { notFound } from "next/navigation";
import { ScreenPlaceholder } from "@/components/layout/screen-placeholder";
import { getService, SERVICES } from "@/config/services";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ service: service.slug }));
}

export default async function OsRequestListPage({
  params,
}: PageProps<"/os/requests/[service]">) {
  const service = getService((await params).service);
  if (!service) notFound();

  return (
    <ScreenPlaceholder
      title={`รายการคำขอ: ${service.label}`}
      epics="Epic 3 stories 2 and 4, Epic 4, Epic 5 story 3"
      design={["OS - รายการคำขอ.svg"]}
      sprint0
    />
  );
}
