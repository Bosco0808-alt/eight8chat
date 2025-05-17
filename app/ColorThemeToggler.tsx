"use client";
import { useAtom } from "jotai";
import { isDarkModeAtom } from "@/atoms";
import styles from "./ColorThemeToggler.module.scss";
import { useEffect } from "react";

export default function ColorThemeToggler() {
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  useEffect(() => {
    const storedIsDarkMode = localStorage.getItem("mode");
    storedIsDarkMode === "light" ? setIsDarkMode(false) : setIsDarkMode(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("mode", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);
  return (
    <button
      onClick={() => setIsDarkMode((v) => !v)}
      className={`btn mx-2 ${styles.coloredThemeToggler}`}
    >
      {isDarkMode ? "⚪️" : "⚫️"}
    </button>
  );
}
