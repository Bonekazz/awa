import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Awa",
  description: "App for remembering to drink water or do any other activity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body data-theme="light" className="w-[100dvw] h-[100dvh]">
        {children}
      </body>
    </html>
  );
}
