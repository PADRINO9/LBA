import { trackMetaEvent } from "./metaPixel";

export function trackEvent(
  eventName: string,
  payload?: Record<string, unknown>,
) {
  console.log("[TRACK_EVENT]", eventName, payload);
  trackMetaEvent(eventName, payload);
}
