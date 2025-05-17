import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.scss";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import Navbar from "./Navbar";
import SubNavbar from "./SubNavbar";
import BodyThemeWrapper from "./BodyThemeWrapper";

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
      <BodyThemeWrapper>
        <Navbar />
        <div className={styles.mainContentDiv}>
          {/* This padding is to prevent the content from being hidden behind the navbar
           * Future devs pls don't remove this padding, it is important for the layout
           * There may be a better way to do this, but this is the easiest way to do so
           * Wise words from the founder of Eight8Chat
           */}
          <SubNavbar />
          {children}
        </div>
      </BodyThemeWrapper>
    </html>
  );
}
