import { NextResponse } from "next/server";
import { getMetricsRegistry } from "@/lib/metrics";

export async function GET() {
  const registry = getMetricsRegistry();
  const metrics = await registry.metrics();

  return new NextResponse(metrics, {
    status: 200,
    headers: {
      "Content-Type": registry.contentType,
      "Cache-Control": "no-store",
    },
  });
}
