"use client";
import { ReactNode } from "react";
import { useAtom } from "jotai";
import { isDarkModeAtom } from "@/atoms";

export default function BodyThemeWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  return (
    <body
      data-bs-theme={isDarkMode ? "dark" : "light"}
      style={{ overflow: "hidden" }}
    >
      {children}
    </body>
  );
}
