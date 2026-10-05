import type { ReactNode } from "react";

function AttributionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={[
        "text-foreground underline underline-offset-2",
        "decoration-foreground/40 transition-colors",
        "hover:decoration-foreground",
      ].join(" ")}
    >
      {children}
    </a>
  );
}

export function MapAttribution() {
  return (
    <p
      className={[
        "absolute bottom-2 right-2 z-10",
        "rounded-md bg-background/90 px-2 py-1 shadow-lg backdrop-blur",
        "text-xs leading-tight text-foreground/80",
      ].join(" ")}
    >
      &copy;{" "}
      <AttributionLink href="https://www.openstreetmap.org/copyright">
        OpenStreetMap
      </AttributionLink>{" "}
      contributors &copy;{" "}
      <AttributionLink href="https://carto.com/attributions">CARTO</AttributionLink>
    </p>
  );
}
