import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactBody {
  type: "general" | "commission";
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  // Commission extras
  vision?: string;
  palette?: string;
  platforms?: string;
  hearAbout?: string;
}

function buildEmailHtml(body: ContactBody): string {
  const isCommission = body.type === "commission";

  const rows = isCommission
    ? [
        ["Type",          "Custom Order Request"],
        ["Name",          body.name],
        ["Email",         body.email],
        ["Phone",         body.phone || "Not provided"],
        ["Vision",        body.vision || body.message],
        ["Color Palette", body.palette || "Not specified"],
        ["Platforms",     body.platforms || "Not specified"],
        ["How They Found Us", body.hearAbout || "Not specified"],
      ]
    : [
        ["Type",    "General Inquiry"],
        ["Name",    body.name],
        ["Email",   body.email],
        ["Subject", body.subject || "General Inquiry"],
        ["Message", body.message],
      ];

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 16px;font-family:sans-serif;font-size:12px;font-weight:600;color:#a8a29e;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;border-bottom:1px solid #292524;">
          ${label}
        </td>
        <td style="padding:10px 16px;font-family:Georgia,serif;font-size:15px;color:#f0e8d8;border-bottom:1px solid #292524;">
          ${value}
        </td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#0c0a08;">
  <div style="max-width:580px;margin:40px auto;background-color:#1c1917;border:1px solid #292524;">
    <!-- Header -->
    <div style="padding:24px 32px;border-bottom:1px solid #c9a45e;">
      <p style="margin:0;font-family:sans-serif;font-size:10px;letter-spacing:0.32em;text-transform:uppercase;color:#c9a45e;">
        LazyCat Trees
      </p>
      <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:22px;color:#f0e8d8;">
        ${isCommission ? "New Custom Order Request" : "New Contact Message"}
      </h1>
    </div>
    <!-- Body -->
    <table style="width:100%;border-collapse:collapse;">
      <tbody>${tableRows}</tbody>
    </table>
    <!-- Footer -->
    <div style="padding:20px 32px;border-top:1px solid #292524;">
      <p style="margin:0;font-family:sans-serif;font-size:11px;color:#57534e;">
        Reply directly to this email to respond to ${body.name} at ${body.email}
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  // Instantiate Resend at request time (not module level) so build succeeds without env vars
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 503 });
  }
  const resend = new Resend(resendKey);

  try {
    const body: ContactBody = await req.json();

    // Validate required fields
    if (!body.name?.trim() || !body.email?.trim() || (!body.message?.trim() && !body.vision?.trim())) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const contactEmail = process.env.CONTACT_EMAIL ?? "hello@lazycattrees.com";
    const isCommission = body.type === "commission";
    const subject = isCommission
      ? `Custom Order Request from ${body.name}`
      : `[LazyCat Trees] ${body.subject ?? "Contact"} - from ${body.name}`;

    const { error } = await resend.emails.send({
      from: "LazyCat Trees <noreply@lazycattrees.com>",
      to: [contactEmail],
      replyTo: body.email,
      subject,
      html: buildEmailHtml(body),
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[contact] Unexpected error:", err);
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
