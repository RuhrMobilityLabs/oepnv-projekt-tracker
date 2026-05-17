import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";

export default function TitleBar() {
  return (
    <header className="border-b border-border/70 bg-surface-elevated/80 backdrop-blur supports-[backdrop-filter]:bg-surface-elevated/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Image src="/favicon.png" alt="" width={24} height={24} className="h-6 w-6" />
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            ÖPNV Projekt Tracker
          </h1>
        </div>

        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
