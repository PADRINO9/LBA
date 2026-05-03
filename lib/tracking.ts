export function trackEvent(eventName: string, payload?: Record<string, unknown>) {
  console.log(eventName, payload);
}
