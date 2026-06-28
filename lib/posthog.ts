export const capture = (event: string, properties?: Record<string, unknown>) => {
  if (__DEV__) {
    console.log("[PostHog]", event, properties);
  }
};
