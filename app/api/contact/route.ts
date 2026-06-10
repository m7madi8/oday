import { escapeHtml, formatFieldsHtml, sendBrevoEmail } from "@/lib/brevo";
import type { ContactFormPayload } from "@/lib/contact-form";
import { NextResponse } from "next/server";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitizeFields(fields: Record<string, string>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === "string") {
      sanitized[key] = value.trim().slice(0, 5000);
    }
  }
  return sanitized;
}

export async function POST(request: Request) {
  let body: ContactFormPayload;

  try {
    body = (await request.json()) as ContactFormPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body._gotcha?.trim()) {
    return NextResponse.json({ ok: true });
  }

  if (body.type === "newsletter") {
    const email = body.email?.trim();
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    try {
      await sendBrevoEmail({
        subject: "Newsletter signup — OD STUDIO",
        htmlContent: `<p style="font-family:Arial,sans-serif;font-size:14px;">New newsletter signup:</p><p style="font-family:Arial,sans-serif;font-size:14px;"><strong>${escapeHtml(email)}</strong></p>`,
        replyToEmail: email,
      });
    } catch (error) {
      console.error("[contact/newsletter]", error);
      return NextResponse.json(
        { error: "Unable to send your request right now. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  if (body.type !== "service-request") {
    return NextResponse.json({ error: "Unsupported form type." }, { status: 400 });
  }

  const subject = body.subject?.trim();
  const fields = sanitizeFields(body.fields ?? {});

  if (!subject || Object.keys(fields).length === 0) {
    return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  }

  const customerEmail = body.customerEmail?.trim();
  const customerName = body.customerName?.trim();
  const serviceLine = body.serviceTitle
    ? `<p style="font-family:Arial,sans-serif;font-size:14px;margin:0 0 16px;"><strong>Service:</strong> ${escapeHtml(body.serviceTitle)}${body.serviceSlug ? ` (${escapeHtml(body.serviceSlug)})` : ""}</p>`
    : "";

  try {
    await sendBrevoEmail({
      subject,
      htmlContent: `${serviceLine}${formatFieldsHtml(fields)}`,
      replyToEmail: customerEmail && isValidEmail(customerEmail) ? customerEmail : undefined,
      replyToName: customerName,
    });
  } catch (error) {
    console.error("[contact/service-request]", error);
    return NextResponse.json(
      { error: "Unable to send your request right now. Please try again later." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
