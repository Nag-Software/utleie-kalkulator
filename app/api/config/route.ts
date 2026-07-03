import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";

export function GET() {
  const { features } = getConfig();
  return NextResponse.json({ paymentsEnabled: features.payments });
}
