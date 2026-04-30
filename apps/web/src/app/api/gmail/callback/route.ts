import { NextResponse } from "next/server";
import { google } from "googleapis";
import { saveGmailTokens } from "@/lib/db/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const userId = searchParams.get("state");

  if (!code || !userId) {
    return NextResponse.redirect(new URL("/gmail?error=missing_params", req.url));
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getToken(code);
  await saveGmailTokens(
    userId,
    tokens.access_token!,
    tokens.refresh_token ?? null,
    tokens.expiry_date ? new Date(tokens.expiry_date) : null
  );

  return NextResponse.redirect(new URL("/gmail?connected=true", req.url));
}
