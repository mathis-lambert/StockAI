interface LogPayload<T extends string> {
  event: T;
  level?: "info" | "error" | "warn";
  message: string;
  context?: Record<string, unknown>;
}

const BASE_FIELDS = {
  service: "stock_ai",
};

type AuthEvents = "auth.signup" | "auth.login" | "auth.logout" | "auth.refresh";

type KnownEvents = AuthEvents;

export function logStructured({
  event,
  level = "info",
  message,
  context = {},
}: LogPayload<KnownEvents>) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...BASE_FIELDS,
    ...context,
    message,
  };

  const serialized = JSON.stringify(payload);

  if (level === "error") {
    console.error(serialized);
  } else if (level === "warn") {
    console.warn(serialized);
  } else {
    console.info(serialized);
  }
}

export function logAuthInfo(
  event: AuthEvents,
  message: string,
  context?: Record<string, unknown>,
) {
  logStructured({ event, message, context, level: "info" });
}

export function logAuthError(
  event: AuthEvents,
  message: string,
  context?: Record<string, unknown>,
) {
  logStructured({ event, message, context, level: "error" });
}
