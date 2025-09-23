import {
  Counter,
  Gauge,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from "prom-client";

type MetricsRegistry = {
  registry: Registry;
  loginSuccess: Counter;
  loginFailure: Counter;
  loginLatency: Histogram;
  signupSuccess: Counter;
  signupFailure: Counter;
  sessionRefresh: Counter;
  activeSessions: Gauge;
};

let metrics: MetricsRegistry | null = null;

function initializeMetrics(): MetricsRegistry {
  const registry = new Registry();

  collectDefaultMetrics({ register: registry, prefix: "stock_ai_" });

  const loginSuccess = new Counter({
    name: "stock_ai_auth_login_success_total",
    help: "Nombre total de connexions réussies",
    registers: [registry],
  });

  const loginFailure = new Counter({
    name: "stock_ai_auth_login_failure_total",
    help: "Nombre total de connexions échouées",
    registers: [registry],
  });

  const loginLatency = new Histogram({
    name: "stock_ai_auth_login_duration_seconds",
    help: "Distribution de la durée de traitement des connexions",
    registers: [registry],
    buckets: [0.1, 0.25, 0.5, 1, 2, 5],
  });

  const signupSuccess = new Counter({
    name: "stock_ai_auth_signup_success_total",
    help: "Nombre total d'inscriptions réussies",
    registers: [registry],
  });

  const signupFailure = new Counter({
    name: "stock_ai_auth_signup_failure_total",
    help: "Nombre total d'inscriptions échouées",
    registers: [registry],
  });

  const sessionRefresh = new Counter({
    name: "stock_ai_auth_session_refresh_total",
    help: "Nombre total de rafraîchissements de session",
    registers: [registry],
  });

  const activeSessions = new Gauge({
    name: "stock_ai_auth_active_sessions",
    help: "Nombre de sessions actives",
    registers: [registry],
  });

  return {
    registry,
    loginSuccess,
    loginFailure,
    loginLatency,
    signupSuccess,
    signupFailure,
    sessionRefresh,
    activeSessions,
  };
}

function getMetrics(): MetricsRegistry {
  if (!metrics) {
    const globalWithMetrics = globalThis as typeof globalThis & {
      __stockAiMetrics?: MetricsRegistry;
    };

    metrics = globalWithMetrics.__stockAiMetrics ?? initializeMetrics();
    globalWithMetrics.__stockAiMetrics = metrics;
  }

  return metrics;
}

export function recordLoginMetrics(params: {
  success: boolean;
  durationMs: number;
  email?: string;
}) {
  const { loginSuccess, loginFailure, loginLatency } = getMetrics();
  const durationSeconds = params.durationMs / 1000;
  loginLatency.observe(durationSeconds);

  if (params.success) {
    loginSuccess.inc();
  } else {
    loginFailure.inc();
  }
}

export function recordSignupMetrics(params: { success: boolean }) {
  const { signupSuccess, signupFailure } = getMetrics();

  if (params.success) {
    signupSuccess.inc();
  } else {
    signupFailure.inc();
  }
}

export function incrementActiveSessions() {
  const { activeSessions } = getMetrics();
  activeSessions.inc();
}

export function decrementActiveSessions() {
  const { activeSessions } = getMetrics();
  activeSessions.dec();
}

export function recordSessionRefresh() {
  const { sessionRefresh } = getMetrics();
  sessionRefresh.inc();
}

export function getMetricsRegistry() {
  return getMetrics().registry;
}

export type AuthMetricsSnapshot = {
  loginSuccess: number;
  loginFailure: number;
  loginSuccessRate: number;
  avgLoginDurationMs: number | null;
  signupSuccess: number;
  signupFailure: number;
  activeSessions: number;
  sessionRefresh: number;
};

async function extractCounterValue(counter: Counter | Gauge) {
  const data = await counter.get();
  const values = Array.isArray(data.values) ? data.values : [];
  return values[0]?.value ?? 0;
}

export async function getAuthMetricsSnapshot(): Promise<AuthMetricsSnapshot> {
  const {
    loginSuccess,
    loginFailure,
    loginLatency,
    signupSuccess,
    signupFailure,
    activeSessions,
    sessionRefresh,
  } = getMetrics();

  const [
    loginSuccessValue,
    loginFailureValue,
    signupSuccessValue,
    signupFailureValue,
    activeSessionsValue,
    sessionRefreshValue,
  ] = await Promise.all([
    extractCounterValue(loginSuccess),
    extractCounterValue(loginFailure),
    extractCounterValue(signupSuccess),
    extractCounterValue(signupFailure),
    extractCounterValue(activeSessions),
    extractCounterValue(sessionRefresh),
  ]);

  const totalLogins = loginSuccessValue + loginFailureValue;
  const loginSuccessRate =
    totalLogins > 0 ? loginSuccessValue / totalLogins : 1;

  const latencyData = await loginLatency.get();
  const latencyValues = Array.isArray(latencyData.values)
    ? latencyData.values
    : [];
  const sumEntry = latencyValues.find((value) =>
    value.metricName?.endsWith("_sum"),
  );
  const countEntry = latencyValues.find((value) =>
    value.metricName?.endsWith("_count"),
  );

  const latencySum = sumEntry?.value ?? 0;
  const latencyCount = countEntry?.value ?? 0;
  const avgLoginDurationMs =
    latencyCount > 0 ? (latencySum / latencyCount) * 1000 : null;

  return {
    loginSuccess: loginSuccessValue,
    loginFailure: loginFailureValue,
    loginSuccessRate,
    avgLoginDurationMs,
    signupSuccess: signupSuccessValue,
    signupFailure: signupFailureValue,
    activeSessions: activeSessionsValue,
    sessionRefresh: sessionRefreshValue,
  };
}
