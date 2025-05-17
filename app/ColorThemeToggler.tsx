"use client";
import { useAtom } from "jotai";
import { isDarkModeAtom } from "@/atoms";
import styles from "./ColorThemeToggler.module.scss";

export default function ColorThemeToggler() {
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  return (
    <button
      onClick={() => setIsDarkMode((v) => !v)}
      className={`btn mx-2 ${styles.coloredThemeToggler}`}
    >
      {isDarkMode ? "⚪️" : "⚫️"}
    </button>
  );
}
