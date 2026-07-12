"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Project } from "@/lib/schemas/projectSchema";
import { STATUS_CONFIG } from "@/config/status";
import { getLatestStatus } from "@/lib/getLatestStatus";
import { MapIcon } from "lucide-react";

interface OverviewMapProps {
  projects: Project[];
}

function getMarkerCoordinates(project: Project): { lat: number; lng: number } | null {
  if (project.coordinates) {
    return { lat: project.coordinates.lat, lng: project.coordinates.lng };
  }

  if (project.stations) {
    const station = project.stations.find(
      (s) => s.coordinates && typeof s.coordinates.lat === "number" && typeof s.coordinates.lng === "number"
    );
    if (station) {
      return { lat: station.coordinates.lat, lng: station.coordinates.lng };
    }
  }

  return null;
}

function createPinIcon(L: typeof import("leaflet"), color: string) {
  return L.divIcon({
    className: "",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${color}"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

function getMobileSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none)").matches || window.innerWidth < 768;
}

function subscribeMobile(callback: () => void) {
  const mq = window.matchMedia("(hover: none)");
  mq.addEventListener("change", callback);
  window.addEventListener("resize", callback);
  return () => {
    mq.removeEventListener("change", callback);
    window.removeEventListener("resize", callback);
  };
}

export default function OverviewMap({ projects }: OverviewMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());
  const overlayRef = useRef<HTMLDivElement>(null);
  const [consented, setConsented] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [clickedProject, setClickedProject] = useState<Project | null>(null);
  const [overlayPos, setOverlayPos] = useState<{ left: number; top: number } | null>(null);
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, () => false);

  const activeProject = clickedProject || hoveredProject;

  useEffect(() => {
    if (!consented || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      const map = L.map(mapRef.current!, {
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const allPoints: [number, number][] = [];

      for (const project of projects) {
        const coords = getMarkerCoordinates(project);
        if (!coords) continue;

        const latestStatus = getLatestStatus(project);
        const statusConfig = STATUS_CONFIG[latestStatus as keyof typeof STATUS_CONFIG];
        const color = statusConfig?.color || "#71717a";

        allPoints.push([coords.lat, coords.lng]);

        const marker = L.marker([coords.lat, coords.lng], {
          icon: createPinIcon(L, color),
        });

        marker.on("click", () => {
          setClickedProject((prev) => {
            if (prev?.id === project.id) return null;
            return project;
          });
        });

        marker.on("mouseover", () => {
          setHoveredProject(project);
        });

        marker.on("mouseout", () => {
          setHoveredProject((prev) => {
            if (prev?.id === project.id) return null;
            return prev;
          });
        });

        marker.addTo(map);
        markerMapRef.current.set(project.id, marker);
      }

      map.on("click", () => {
        setClickedProject(null);
      });

      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } else {
        map.setView([51.1657, 10.4515], 6);
      }

      requestAnimationFrame(() => {
        map.invalidateSize();
      });
      mapInstanceRef.current = map;
    };

    const markerMap = markerMapRef.current;

    initMap();

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      markerMap.clear();
    };
  }, [consented, projects]);

  useEffect(() => {
    if (!activeProject || !mapInstanceRef.current || isMobile) {
      setOverlayPos(null);
      return;
    }

    const marker = markerMapRef.current.get(activeProject.id);
    if (!marker) {
      setOverlayPos(null);
      return;
    }

    const updatePosition = () => {
      if (!mapInstanceRef.current) return;
      const map = mapInstanceRef.current;
      const point = map.latLngToContainerPoint(marker.getLatLng());
      const mapRect = mapRef.current!.getBoundingClientRect();
      setOverlayPos({
        left: mapRect.left + point.x + 16,
        top: mapRect.top + point.y - 20,
      });
    };

    updatePosition();

    mapInstanceRef.current.on("move zoom resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      mapInstanceRef.current?.off("move zoom resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [activeProject, isMobile]);

  if (!consented) {
    return (
      <div className="mt-3 flex flex-col items-center gap-3 bg-surface p-6 text-center">
        <MapIcon className="h-8 w-8 text-muted" />
        <p className="text-sm leading-5 text-muted">
          Um die Karte anzuzeigen, werden Kartenkacheln von{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            OpenStreetMap
          </a>{" "}
          geladen. Dabei wird Ihre IP-Adresse an die Server von OpenStreetMap
          übermittelt.
        </p>
        <button
          onClick={() => setConsented(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
        >
          <MapIcon className="h-4 w-4" />
          Karte anzeigen
        </button>
      </div>
    );
  }

  const projectUrl = activeProject ? `/projects/${activeProject.id}` : undefined;

  const desktopOverlay = activeProject && !isMobile && overlayPos && (
    <a
      ref={overlayRef}
      href={projectUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed z-[9999] block max-w-sm rounded-2xl border border-border bg-surface-elevated p-3 shadow-xl shadow-slate-950/10 backdrop-blur transition hover:border-primary dark:shadow-black/30"
      style={{ left: overlayPos.left, top: overlayPos.top }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-sm font-semibold text-foreground">{activeProject.name}</h3>
      {activeProject.description && (
        <p className="mt-1 text-xs leading-4 text-muted">
          {truncateText(activeProject.description, 100)}
        </p>
      )}
      <span className="mt-2 inline-block text-xs font-semibold text-primary transition group-hover:underline">
        Klicken für Details
      </span>
    </a>
  );

  const mobileOverlay = activeProject && isMobile && (
    <a
      href={projectUrl}
      target="_blank"
      rel="noreferrer"
      className="absolute inset-x-0 bottom-0 z-[9999] block rounded-2xl border border-border bg-surface-elevated p-4 shadow-xl shadow-slate-950/10 backdrop-blur transition hover:border-primary dark:shadow-black/30 mx-2 mb-4"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-sm font-semibold text-foreground">{activeProject.name}</h3>
      {activeProject.description && (
        <p className="mt-1 text-xs leading-4 text-muted">
          {truncateText(activeProject.description, 100)}
        </p>
      )}
      <span className="mt-2 inline-block text-xs font-semibold text-primary transition">
        Klicken für Details
      </span>
    </a>
  );

  return (
    <div className="absolute inset-0">
      <div ref={mapRef} className="h-full w-full" />
      {desktopOverlay}
      {mobileOverlay}
    </div>
  );
}
