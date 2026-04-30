import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { deleteSubscription } from "@/lib/db/queries";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await deleteSubscription(id, userId);
  return NextResponse.json({ success: true });
}
