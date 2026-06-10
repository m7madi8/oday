import { contact } from "@/lib/content/contact";

function getWhatsAppNumber(): string {
  const phoneHref = contact.items.find((item) => item.label === "Phone")?.href;
  const digits = phoneHref?.replace(/\D/g, "");
  return digits || "972568123413";
}

export function buildServiceRequestWhatsAppUrl(
  serviceTitle: string,
  fields: Record<string, string>,
): string {
  const lines = [`Service request: ${serviceTitle}`, "", ...Object.entries(fields).map(([label, value]) => `${label}: ${value}`)];
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function openServiceRequestWhatsApp(serviceTitle: string, fields: Record<string, string>): void {
  window.open(buildServiceRequestWhatsAppUrl(serviceTitle, fields), "_blank", "noopener,noreferrer");
}
