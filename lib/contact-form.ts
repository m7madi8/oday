export type ContactFormType = "service-request" | "newsletter";

export interface ServiceRequestPayload {
  type: "service-request";
  subject: string;
  serviceTitle: string;
  serviceSlug: string;
  customerName?: string;
  customerEmail?: string;
  fields: Record<string, string>;
  _gotcha?: string;
}

export interface NewsletterPayload {
  type: "newsletter";
  email: string;
  _gotcha?: string;
}

export type ContactFormPayload = ServiceRequestPayload | NewsletterPayload;

export async function submitContactForm(
  payload: ContactFormPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      return { ok: false, error: data.error ?? "Something went wrong. Please try again." };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please check your connection and try again." };
  }
}
