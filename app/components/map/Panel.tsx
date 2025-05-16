"use client";

import React from "react";
import { LiveData } from "@/app/types";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "usehooks-ts";

import {
  MapPin,
  Calendar,
  Compass,
  Thermometer,
  Battery,
  Plug,
  Gauge,
  LocateFixed,
} from "lucide-react";

interface InfoPanelProps {
  liveData: LiveData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// helper to split number at the dot and style the fractional part
function FormattedDecimal({ value }: { value: number }) {
  const [intPart, decPart] = value.toFixed(6).split(".");
  return (
    <div className="flex items-baseline">
      <span className="text-lg">{intPart}</span>
      <span className="text-sm text-muted-foreground">.{decPart}</span>
    </div>
  );
}

export function InfoPanel({
  liveData,
  open,
  onOpenChange,
}: InfoPanelProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const formattedDate = new Date(liveData.date).toLocaleString();
  const yesNo = (b: boolean) => (b ? "Yes" : "No");

  const PanelBody = () => (
    <div className="flex flex-col justify-between h-full w-full px-4">
      <div className="flex flex-col gap-4 items-center">
        <div className="flex w-full items-center justify-between p-3 border rounded-md">
          <div className="flex w-full items-center space-x-2">
            <LocateFixed className="w-5 h-5" />
            <div className="flex flex-row gap-2">
              <FormattedDecimal value={liveData.latitude} />
              <FormattedDecimal value={liveData.longitude} />
            </div>
          </div>
          <div className="flex items-center">
            <Thermometer className="w-5 h-5" />
            <div className="flex items-baseline space-x-1">
              <span className="text-lg">{liveData.temperature}</span>
              <span className="text-sm text-muted-foreground">°C</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 w-full gap-4">
          <div className="flex w-full items-center space-x-3 p-3 border rounded-md">
            <Gauge className="w-5 h-5" />
            <div>
              <div className="text-sm font-medium">Speed</div>
              <div className="flex items-baseline space-x-1">
                <span className="text-lg">{liveData.speed}</span>
                <span className="text-sm text-muted-foreground">km/h</span>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center space-x-3 p-3 border rounded-md">
            <Compass className="w-5 h-5" />
            <div>
              <div className="text-sm font-medium">Course</div>
              <div className="flex items-baseline space-x-1">
                <span className="text-lg">{liveData.course}</span>
                <span className="text-lg text-muted-foreground">°</span>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center space-x-3 p-3 border rounded-md">
            <Gauge className="w-5 h-5" />
            <div>
              <div className="text-sm font-medium">Avg Speed</div>
              <div className="flex items-baseline space-x-1">
                <span className="text-lg">{liveData.average_speed}</span>
                <span className="text-sm text-muted-foreground">km/h</span>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center space-x-3 p-3 border rounded-md">
            <Compass className="w-5 h-5" />
            <div>
              <div className="text-sm font-medium">Avg Course</div>
              <div className="flex items-baseline space-x-1">
                <span className="text-lg">{liveData.average_course}</span>
                <span className="text-lg text-muted-foreground">°</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground my-4">
        <Battery className="w-4 h-4" />
        <span>{liveData.battery}%</span>
        <Plug className="w-4 h-4" />
        <span>{yesNo(liveData.plugged_in)}</span>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
        <SheetContent side="left" overlay={false}>
          <SheetHeader>
            <SheetTitle asChild>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <div className="flex items-baseline space-x-1">
                  <span className="text-lg">Live location tracking</span>
                </div>
              </div>
            </SheetTitle>
            <SheetDescription asChild>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{formattedDate}</span>
              </div>
            </SheetDescription>
          </SheetHeader>
          <PanelBody />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle asChild>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <div className="flex items-baseline space-x-1">
                <span className="text-lg">Live location tracking</span>
              </div>
            </div>
          </DrawerTitle>
          <DrawerDescription asChild>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>{formattedDate}</span>
            </div>
          </DrawerDescription>
        </DrawerHeader>
        <PanelBody />
      </DrawerContent>
    </Drawer>
  );
}
