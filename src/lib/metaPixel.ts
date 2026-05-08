export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function hasMetaPixelId() {
  return Boolean(META_PIXEL_ID);
}

export function trackMetaEvent(
  eventName: string,
  payload?: Record<string, unknown>,
) {
  if (!META_PIXEL_ID || typeof window === "undefined") {
    return;
  }

  // Prepared for a future Meta Pixel bridge. No real Pixel script is loaded here.
  console.log("[META_PIXEL_READY]", eventName, payload);
}
