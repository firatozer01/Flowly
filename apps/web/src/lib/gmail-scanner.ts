import { google } from "googleapis";
import { getServiceByDomain } from "@flowly/subscriptions-db";

export interface ScannedSubscription {
  name: string;
  amount: number;
  currency: string;
  billingDate: Date;
  domain?: string;
  serviceId?: string;
  color?: string;
  category?: string;
  gmailMessageId: string;
}

const BILLING_PATTERNS = [
  /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))\s*(TL|₺|TRY|USD|\$|EUR|€)/gi,
  /(TL|₺|TRY|USD|\$|EUR|€)\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))/gi,
];

const SENDER_PATTERNS = [
  { domain: "netflix.com", name: "Netflix" },
  { domain: "spotify.com", name: "Spotify" },
  { domain: "apple.com", name: "Apple" },
  { domain: "google.com", name: "Google" },
  { domain: "microsoft.com", name: "Microsoft" },
  { domain: "amazon.com", name: "Amazon" },
  { domain: "adobe.com", name: "Adobe" },
  { domain: "blutv.com", name: "BluTV" },
  { domain: "gain.tv", name: "Gain" },
  { domain: "youtube.com", name: "YouTube" },
  { domain: "notion.so", name: "Notion" },
  { domain: "figma.com", name: "Figma" },
  { domain: "github.com", name: "GitHub" },
  { domain: "slack.com", name: "Slack" },
  { domain: "zoom.us", name: "Zoom" },
  { domain: "duolingo.com", name: "Duolingo" },
  { domain: "anthropic.com", name: "Claude" },
  { domain: "openai.com", name: "ChatGPT" },
  { domain: "canva.com", name: "Canva" },
  { domain: "dropbox.com", name: "Dropbox" },
  { domain: "discord.com", name: "Discord" },
  { domain: "twitter.com", name: "X Premium" },
  { domain: "x.com", name: "X Premium" },
  { domain: "linkedin.com", name: "LinkedIn" },
  { domain: "grammarly.com", name: "Grammarly" },
  { domain: "disneyplus.com", name: "Disney+" },
  { domain: "hbo.com", name: "HBO Max" },
  { domain: "evernote.com", name: "Evernote" },
  { domain: "1password.com", name: "1Password" },
  { domain: "lastpass.com", name: "LastPass" },
  { domain: "setapp.com", name: "Setapp" },
  { domain: "todoist.com", name: "Todoist" },
  { domain: "trello.com", name: "Trello" },
  { domain: "atlassian.com", name: "Atlassian" },
  { domain: "jetbrains.com", name: "JetBrains" },
  { domain: "twitch.tv", name: "Twitch" },
  { domain: "cursor.sh", name: "Cursor" },
  { domain: "vercel.com", name: "Vercel" },
  { domain: "digitalocean.com", name: "DigitalOcean" },
  { domain: "aws.amazon.com", name: "AWS" },
];

function extractAmount(text: string): { amount: number; currency: string } | null {
  for (const pattern of BILLING_PATTERNS) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match) {
      const amountStr = (match[1] || match[2]).replace(/\./g, "").replace(",", ".");
      const currencyStr = (match[2] || match[1]).trim();
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0 && amount < 100000) {
        const currency =
          currencyStr.includes("$") || currencyStr.toUpperCase() === "USD"
            ? "USD"
            : currencyStr.includes("€") || currencyStr.toUpperCase() === "EUR"
            ? "EUR"
            : "TRY";
        return { amount, currency };
      }
    }
  }
  return null;
}

function extractDomainFromEmail(email: string): string | null {
  const match = email.match(/@([^>]+)/);
  return match ? match[1].toLowerCase() : null;
}

function buildOAuthClient(accessToken: string, refreshToken?: string | null) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  return client;
}

export async function scanGmailForSubscriptions(
  accessToken: string,
  refreshToken?: string | null
): Promise<ScannedSubscription[]> {
  const auth = buildOAuthClient(accessToken, refreshToken);
  const gmail = google.gmail({ version: "v1", auth });

  const knownSenders = SENDER_PATTERNS.map((p) => `from:${p.domain}`).join(" OR ");
  const subjectQuery = `subject:(fatura OR ödeme OR receipt OR invoice OR subscription OR renewed OR billing OR "thank you for your purchase" OR "your order")`;
  const query = `(${knownSenders}) OR (${subjectQuery}) newer_than:180d`;

  const listRes = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: 100,
  });

  const messages = listRes.data.messages || [];
  const results: ScannedSubscription[] = [];
  const seenDomains = new Set<string>();

  for (const msg of messages) {
    try {
      const detail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      });

      const headers = detail.data.payload?.headers || [];
      const from = headers.find((h) => h.name === "From")?.value || "";
      const subject = headers.find((h) => h.name === "Subject")?.value || "";
      const date = headers.find((h) => h.name === "Date")?.value || "";

      const domain = extractDomainFromEmail(from);
      if (!domain) continue;

      const senderMatch = SENDER_PATTERNS.find((p) => domain.includes(p.domain));
      if (!senderMatch) continue;
      if (seenDomains.has(senderMatch.domain)) continue;

      const combined = `${subject} ${from}`;
      const extracted = extractAmount(combined);

      const service = getServiceByDomain(senderMatch.domain);
      const billingDate = date ? new Date(date) : new Date();

      results.push({
        name: service?.name || senderMatch.name,
        amount: extracted?.amount ?? service?.typical_price_try ?? 0,
        currency: extracted?.currency ?? "TRY",
        billingDate,
        domain: senderMatch.domain,
        serviceId: service?.id,
        color: service?.color,
        category: service?.category,
        gmailMessageId: msg.id!,
      });

      seenDomains.add(senderMatch.domain);
    } catch {
      continue;
    }
  }

  return results;
}
