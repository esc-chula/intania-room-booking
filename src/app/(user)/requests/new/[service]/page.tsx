import { notFound } from "next/navigation";
import { ScreenPlaceholder } from "@/components/layout/screen-placeholder";
import { getService, SERVICES } from "@/config/services";

export function generateStaticParams() {
  return SERVICES.map((service) => ({ service: service.slug }));
}

export default async function NewServiceRequestPage({
  params,
}: PageProps<"/requests/new/[service]">) {
  const service = getService((await params).service);
  if (!service) notFound();

  return (
    <ScreenPlaceholder
      title={service.label}
      epics="Epic 1 stories 1-10 (User B)"
      design={["User B -  Create New Request.svg"]}
    />
  );
}
