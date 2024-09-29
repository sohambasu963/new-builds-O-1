import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TimeHopTO",
  description: "New Builds Let's Go",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
