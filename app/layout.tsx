import type { Metadata } from "next";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS

export const metadata: Metadata = {
  title: "Eight8Chat",
  description: "A chat app for making friends and chatting with them",
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
