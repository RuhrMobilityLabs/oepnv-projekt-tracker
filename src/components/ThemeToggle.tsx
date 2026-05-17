"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

type ThemeMode = "system" | "light" | "dark";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

function getSystemTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;

  if (theme === "system") {
    root.removeAttribute("data-theme");
    root.style.colorScheme = getSystemTheme();
    return;
  }

  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "system";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isThemeMode(stored) ? stored : "system";
}

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback();
    }
  };

  const onThemeChange = () => callback();

  const onMediaChange = () => callback();

  window.addEventListener("storage", onStorage);
  window.addEventListener("themechange", onThemeChange as EventListener);
  media.addEventListener("change", onMediaChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("themechange", onThemeChange as EventListener);
    media.removeEventListener("change", onMediaChange);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore<ThemeMode>(subscribe, getStoredTheme, () => "system");
  const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => {
        window.localStorage.setItem(STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
        window.dispatchEvent(new Event("themechange"));
      }}
      aria-label={resolvedTheme === "dark" ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
      aria-pressed={resolvedTheme === "dark"}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-elevated text-foreground shadow-sm shadow-slate-950/5 transition hover:border-primary hover:text-primary focus:outline-none focus:ring-4 focus:ring-ring dark:shadow-black/20"
    >
      {resolvedTheme === "dark" ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}