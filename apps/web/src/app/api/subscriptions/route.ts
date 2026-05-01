import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSubscription, getSubscriptionsByUser } from "@/lib/db/queries";

const createSchema = z.object({
  name: z.string().min(1),
  serviceId: z.string().optional(),
  domain: z.string().optional(),
  category: z.string().default("Diğer"),
  color: z.string().default("#6366f1"),
  amount: z.number().positive(),
  currency: z.string().default("TRY"),
  billingCycle: z.string().default("monthly"),
  nextBillingDate: z.string(),
  notes: z.string().optional(),
  gmailMessageId: z.string().optional(),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subs = await getSubscriptionsByUser(userId);
  return NextResponse.json(subs);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const sub = await createSubscription({
      ...parsed.data,
      userId,
      nextBillingDate: new Date(parsed.data.nextBillingDate),
      amount: parsed.data.amount.toString(),
    });
    return NextResponse.json(sub, { status: 201 });
  } catch (err) {
    console.error("createSubscription error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Database error" },
      { status: 500 }
    );
  }
}
