"use client";

import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState } from "react";
import type { Coordinates } from "@/lib/schemas/projectSchema";
import { MapIcon } from "lucide-react";

interface ProjectStation {
  name: string;
  coordinates: Coordinates;
  status: string;
}

interface ProjectMapProps {
  projectName?: string;
  projectCoordinates?: Coordinates;
  stations?: ProjectStation[];
}

const STATUS_LABELS: Record<string, string> = {
  existing: "Bestehend",
  planned: "Geplant",
};

export default function ProjectMap({ projectName, projectCoordinates, stations }: ProjectMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (!consented || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      const icon = L.divIcon({
        className: "",
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
          <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#2563eb"/>
          <circle cx="12" cy="12" r="5" fill="white"/>
        </svg>`,
        iconSize: [24, 36],
        iconAnchor: [12, 36],
        popupAnchor: [0, -36],
      });

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

      if (projectCoordinates) {
        allPoints.push([projectCoordinates.lat, projectCoordinates.lng]);
        const mainIcon = L.divIcon({
          className: "",
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="#dc2626"/>
            <circle cx="12" cy="12" r="5" fill="white"/>
          </svg>`,
          iconSize: [24, 36],
          iconAnchor: [12, 36],
          popupAnchor: [0, -36],
        });
        L.marker([projectCoordinates.lat, projectCoordinates.lng], { icon: mainIcon })
          .bindPopup(`<strong>${projectName || "Projekt"}</strong>`)
          .addTo(map);
      }

      stations?.forEach((station) => {
        const { lat, lng } = station.coordinates;
        allPoints.push([lat, lng]);
        const statusLabel = STATUS_LABELS[station.status] || station.status;
        L.marker([lat, lng], { icon })
          .bindPopup(`<strong>${station.name}</strong><br/>${statusLabel}`)
          .addTo(map);
      });

      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } else {
        map.setView([51.1657, 10.4515], 6);
      }

      map.invalidateSize();
      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [consented, projectCoordinates, stations, projectName]);

  if (!consented) {
    return (
      <section className="rounded-2xl border border-border bg-background/50 p-3">
        <h2 className="text-sm font-semibold text-foreground">Karte</h2>
        <div className="mt-3 flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-6 text-center">
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
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-background/50 p-3">
      <h2 className="text-sm font-semibold text-foreground">Karte</h2>
      <div ref={mapRef} className="mt-3 h-[400px] w-full overflow-hidden rounded-xl" />
    </section>
  );
}
