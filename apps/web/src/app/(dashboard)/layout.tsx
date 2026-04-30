import { Background } from "@/components/layout/background";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
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
