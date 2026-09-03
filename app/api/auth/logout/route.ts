import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";
import { getConfig } from "@/lib/config";

export async function GET() {
  await clearSession();
  return NextResponse.redirect(new URL("/", getConfig().siteUrl));
}
