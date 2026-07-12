"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import { Map, List } from "lucide-react";

const publicBase = process.env.NEXT_PUBLIC_BASE_PATH || "/";

export default function TitleBar() {
  const pathname = usePathname();
  const isMapPage = pathname === "/map";

  return (
    <header className="border-b border-border/70 bg-surface-elevated/80 backdrop-blur supports-[backdrop-filter]:bg-surface-elevated/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
          <Image src={`${publicBase}logo.png`} alt="" width={24} height={24} className="h-6 w-6" />
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            ÖPNV Projekt Tracker
          </h1>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={isMapPage ? "/" : "/map"}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            {isMapPage ? (
              <>
                <List className="h-3.5 w-3.5" />
                Liste anzeigen
              </>
            ) : (
              <>
                <Map className="h-3.5 w-3.5" />
                Karte anzeigen
              </>
            )}
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
