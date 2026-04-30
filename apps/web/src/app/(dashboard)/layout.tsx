import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Background } from "@/components/layout/background";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <>
      <Background />
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 min-h-screen">{children}</main>
      </div>
    </>
  );
}
