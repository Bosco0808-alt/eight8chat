import type { Metadata } from "next";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import Navbar from "./Navbar";

export const metadata: Metadata = {
  title: "Eight8Chat - Your Ultimate Web Chat App",
  description:
    "Discover eight8chat, the ultimate web chat app for seamless communication! Connect with friends and family through instant messaging, group chats, and enhanced privacy settings. Enjoy a user-friendly interface and customizable themes for a personalized chatting experience. Join eight8chat today and stay connected effortlessly! Eight8chat is still under heavy development, so expect some bugs and missing features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
