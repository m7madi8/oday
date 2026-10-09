import { Resend } from "resend";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatFieldsHtml(fields: Record<string, string>): string {
  const rows = Object.entries(fields)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px 8px 0;font-weight:600;vertical-align:top;color:#333;">${escapeHtml(label)}</td><td style="padding:8px 0;color:#444;white-space:pre-wrap;">${escapeHtml(value || "—")}</td></tr>`,
    )
    .join("");

  return `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;">${rows}</table>`;
}

export interface ContactEmailOptions {
  subject: string;
  htmlContent: string;
  replyToEmail?: string;
}

export async function sendContactEmail(options: ContactEmailOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const fromName = process.env.RESEND_FROM_NAME ?? "OD ARCHITECTS";
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !fromEmail || !contactEmail) {
    throw new Error("Email service is not configured.");
  }

  const resend = new Resend(apiKey);
  const from = `${fromName} <${fromEmail}>`;

  const { data, error } = await resend.emails.send({
    from,
    to: [contactEmail],
    subject: options.subject,
    html: options.htmlContent,
    replyTo: options.replyToEmail,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.id) {
    throw new Error("Email could not be sent.");
  }
}
