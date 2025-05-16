"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InfoPanel } from "./Panel";
import WorldMap from "./Map";
import { LiveData } from "@/app/types";

export function MapContainer({ data }: { data: LiveData[] }) {
  const params = useSearchParams();
  const [selected, setSelected] = useState<LiveData | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const marker = params.get("marker");
    if (marker) {
      const id = parseInt(marker, 10);
      const found = data.find((d) => d.id === id) ?? null;
      setSelected(found);
      setOpen(Boolean(found));

      if (!found) {
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [params, data]);

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      const url = new URL(window.location.href);
      url.searchParams.delete("marker");
      window.history.replaceState({}, "", url.toString());
    }
    setOpen(isOpen);
  }

  return (
    <>
      {selected && (
        <InfoPanel
          liveData={selected}
          open={open}
          onOpenChange={handleOpenChange}
        />
      )}
      <WorldMap data={data} />
    </>
  );
}
