export const LEAD_SUCCESS_MESSAGE = "תודה, הפרטים נשלחו בהצלחה. נחזור אליך בהקדם.";
export const LEAD_GENERAL_ERROR_MESSAGE = "אירעה שגיאה בשליחת הטופס. נסו שוב בעוד רגע או צרו קשר ישירות במייל.";

export const CONTACT_TIME_OPTIONS = ["בוקר", "צהריים", "אחר הצהריים", "ערב", "לא משנה"] as const;

export type ContactTimeOption = (typeof CONTACT_TIME_OPTIONS)[number];

export type LeadFormPayload = {
  fullName: string;
  phone: string;
  email: string;
  preferredContactTime: string;
  message: string;
  pageUrl?: string;
  website?: string;
};

export type LeadFormValues = {
  fullName: string;
  phone: string;
  email: string;
  preferredContactTime: ContactTimeOption;
  message: string;
  pageUrl: string;
};

export type LeadFormField = "fullName" | "phone" | "email" | "preferredContactTime" | "message";
export type LeadFormErrors = Partial<Record<LeadFormField, string>>;

const MAX_MESSAGE_LENGTH = 500;

function cleanControlCharacters(value: string) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "");
}

export function sanitizeSingleLine(value: unknown) {
  return cleanControlCharacters(String(value ?? ""))
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizeMessage(value: unknown) {
  return cleanControlCharacters(String(value ?? ""))
    .replace(/\r\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

export function normalizeIsraeliPhone(value: unknown) {
  const compact = String(value ?? "")
    .trim()
    .replace(/[\s().-]/g, "");

  let normalized = compact;

  if (normalized.startsWith("+972")) {
    normalized = `0${normalized.slice(4)}`;
  } else if (normalized.startsWith("00972")) {
    normalized = `0${normalized.slice(5)}`;
  } else if (normalized.startsWith("972")) {
    normalized = `0${normalized.slice(3)}`;
  }

  if (!/^\d+$/.test(normalized)) {
    return null;
  }

  const isMobile = /^05\d{8}$/.test(normalized);
  const isLandline = /^0(?:2|3|4|8|9)\d{7}$/.test(normalized);
  const isVoip = /^07[2-9]\d{7}$/.test(normalized);

  return isMobile || isLandline || isVoip ? normalized : null;
}

export function validateLeadFormPayload(payload: Partial<LeadFormPayload>) {
  const errors: LeadFormErrors = {};
  const fullName = sanitizeSingleLine(payload.fullName);
  const phone = normalizeIsraeliPhone(payload.phone);
  const email = sanitizeSingleLine(payload.email).toLowerCase();
  const preferredContactTime = sanitizeSingleLine(payload.preferredContactTime);
  const message = sanitizeMessage(payload.message);
  const pageUrl = sanitizeSingleLine(payload.pageUrl);

  if (!fullName) {
    errors.fullName = "נא להזין שם מלא";
  } else if (fullName.length < 2 || !/\p{L}/u.test(fullName)) {
    errors.fullName = "נא להזין שם מלא תקין";
  }

  if (!phone) {
    errors.phone = "נא להזין מספר טלפון תקין";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
    errors.email = "נא להזין כתובת מייל תקינה";
  }

  if (!CONTACT_TIME_OPTIONS.includes(preferredContactTime as ContactTimeOption)) {
    errors.preferredContactTime = "נא לבחור זמן נוח לחזרה";
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = "ההודעה יכולה להכיל עד 500 תווים";
  }

  return {
    errors,
    values:
      Object.keys(errors).length === 0 && phone
        ? {
            fullName,
            phone,
            email,
            preferredContactTime: preferredContactTime as ContactTimeOption,
            message,
            pageUrl,
          }
        : null,
  };
}
