import { NextResponse, type NextRequest } from "next/server";
import {
  LEAD_GENERAL_ERROR_MESSAGE,
  LEAD_SUCCESS_MESSAGE,
  sanitizeSingleLine,
  validateLeadFormPayload,
  type LeadFormValues,
} from "@/lib/leadForm";

export const runtime = "nodejs";

const LEAD_EMAIL_TO = process.env.LEAD_EMAIL_TO || "office@pra-fin.co.il";
const EMAIL_SUBJECT = "פנייה חדשה לתיאום שיחה מאתר פרקטיקה פיננסית";
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    forwarded ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const windowMs = Number(process.env.LEAD_RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
  const maxRequests = Number(process.env.LEAD_RATE_LIMIT_MAX || 5);
  const existing = rateLimitStore.get(ip);

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= maxRequests) {
    return false;
  }

  existing.count += 1;
  return true;
}

function formatSubmittedAt() {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Jerusalem",
  }).format(new Date());
}

function buildEmail(values: LeadFormValues, request: NextRequest, ip: string) {
  const submittedAt = formatSubmittedAt();
  const userAgent = sanitizeSingleLine(request.headers.get("user-agent") || "לא זמין");
  const pageUrl = values.pageUrl || request.headers.get("referer") || "לא זמין";
  const message = values.message || "לא נמסרה הודעה";

  const rows = [
    ["שם מלא", values.fullName],
    ["טלפון", values.phone],
    ["מייל", values.email],
    ["זמן נוח לחזרה", values.preferredContactTime],
    ["הודעה", message],
    ["תאריך ושעת שליחה", submittedAt],
    ["כתובת העמוד", pageUrl],
    ["User agent", userAgent],
    ["IP", ip],
  ] as const;

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><th style="padding:10px;border:1px solid #e5ddd2;text-align:right;background:#f7f3ec;">${escapeHtml(
          label,
        )}</th><td style="padding:10px;border:1px solid #e5ddd2;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  const html = `
    <div dir="rtl" lang="he" style="font-family:Arial,sans-serif;color:#1e2424;line-height:1.6;">
      <h1 style="font-size:22px;margin:0 0 16px;">${escapeHtml(EMAIL_SUBJECT)}</h1>
      <table style="border-collapse:collapse;width:100%;max-width:720px;">${htmlRows}</table>
    </div>
  `;

  return { html, text };
}

async function sendLeadEmail(values: LeadFormValues, request: NextRequest, ip: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;

  if (!apiKey || !from) {
    console.error("Lead email configuration is missing", {
      hasResendApiKey: Boolean(apiKey),
      hasLeadEmailFrom: Boolean(from),
    });
    return { ok: false, status: 503 };
  }

  const { html, text } = buildEmail(values, request, ip);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: LEAD_EMAIL_TO,
      subject: EMAIL_SUBJECT,
      html,
      text,
      reply_to: values.email,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("Lead email send failed", {
      status: response.status,
      body: errorText.slice(0, 500),
    });
    return { ok: false, status: 502 };
  }

  return { ok: true, status: 200 };
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: LEAD_GENERAL_ERROR_MESSAGE },
      { status: 400 },
    );
  }

  if (sanitizeSingleLine(payload.website).length > 0) {
    return NextResponse.json({ ok: true, message: LEAD_SUCCESS_MESSAGE });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, message: "נשלחו יותר מדי פניות בזמן קצר. נסו שוב בעוד כמה דקות." },
      { status: 429 },
    );
  }

  const { errors, values } = validateLeadFormPayload(payload);

  if (!values) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  try {
    const result = await sendLeadEmail(values, request, ip);
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: LEAD_GENERAL_ERROR_MESSAGE },
        { status: result.status },
      );
    }
  } catch (error) {
    console.error("Unhandled lead email error", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { ok: false, message: LEAD_GENERAL_ERROR_MESSAGE },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, message: LEAD_SUCCESS_MESSAGE });
}
