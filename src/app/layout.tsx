import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloseFlow — Turn missed opportunities into revenue",
  description:
    "AI revenue recovery system for local service businesses. Find stale quotes, inactive customers, and unanswered leads — then recover the revenue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
