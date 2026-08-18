import { isValidExteriorProjectType } from "@/lib/data";
import { redirect } from "next/navigation";

/**
 * Legacy archive route. `/projects` is the canonical gallery — this preserves any
 * inbound `?type=` deep link rather than dropping visitors on an unfiltered page.
 */
export default function GalleryPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const rawType = typeof searchParams.type === "string" ? searchParams.type : undefined;

  redirect(
    rawType && isValidExteriorProjectType(rawType)
      ? `/projects?service=exterior&type=${rawType}`
      : "/projects?service=exterior",
  );
}
