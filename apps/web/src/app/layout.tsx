import type { Metadata } from "next";
import { Toaster } from "sonner";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Flowly — Abonelik Takip",
  description: "Tüm aboneliklerinizi tek yerden yönetin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#f0f4ff",
            },
          }}
        />
      </body>
    </html>
  );
}
