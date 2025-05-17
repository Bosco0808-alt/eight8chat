"use client";
import { useAtom } from "jotai";
import { isDarkModeAtom } from "@/atoms";
import styles from "./ColorThemeToggler.module.scss";
import { useEffect } from "react";
import { changeColorMode } from "@/actions";

export default function ColorThemeToggler({
  preferUseDarkMode,
  userId,
}: {
  preferUseDarkMode: boolean | null;
  userId: number | null;
}) {
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  useEffect(() => {
    if (preferUseDarkMode) {
      setIsDarkMode(true);
      return;
    }
    if (preferUseDarkMode === false && preferUseDarkMode !== null) {
      setIsDarkMode(false);
      return;
    }
    const storedIsDarkMode = localStorage.getItem("mode");
    storedIsDarkMode === "light" ? setIsDarkMode(false) : setIsDarkMode(true);
  }, []);
  useEffect(() => {
    if (preferUseDarkMode === null) {
      localStorage.setItem("mode", isDarkMode ? "dark" : "light");
      return;
    }
    (async () => {
      if (userId) {
        const unParsedResult = await changeColorMode(userId);
        const { result, errMessage } = JSON.parse(unParsedResult);
        console.log(result, errMessage);
      }
    })();
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
