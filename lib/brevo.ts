const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

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

export interface BrevoEmailOptions {
  subject: string;
  htmlContent: string;
  replyToEmail?: string;
  replyToName?: string;
}

export async function sendBrevoEmail(options: BrevoEmailOptions): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME ?? "OD ARCHITECTS";
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !senderEmail || !contactEmail) {
    throw new Error("Email service is not configured.");
  }

  const payload: Record<string, unknown> = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: contactEmail }],
    subject: options.subject,
    htmlContent: options.htmlContent,
  };

  if (options.replyToEmail) {
    payload.replyTo = {
      email: options.replyToEmail,
      name: options.replyToName || options.replyToEmail,
    };
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `Brevo API error (${response.status})`);
  }
}
