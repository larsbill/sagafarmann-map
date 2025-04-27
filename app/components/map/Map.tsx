// components/map/Map.tsx

'use client';

import { useRef, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { transformExtent, fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Overlay from 'ol/Overlay';
import 'ol/ol.css';

import { LiveData } from '../../types';

type WorldMapProps = {
  data: LiveData[];
};

export default function WorldMap({ data }: WorldMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current || !popupRef.current) return;

    const europeBbox4326: [number, number, number, number] = [
      -35.58, 24.6, 44.83, 84.73,
    ];
    const europeExtent = transformExtent(
      europeBbox4326,
      'EPSG:4326',
      'EPSG:3857'
    );

    const raster = new TileLayer({
      preload: 256,
      cacheSize: 1024,
      source: new XYZ({
        url:
          'https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        attributions: '© OpenStreetMap contributors © CARTO',
        transition: 0,
      }),
    });

    const view = new View({
      projection: 'EPSG:3857',
      extent: europeExtent,
      constrainOnlyCenter: false,
      center: fromLonLat([4.5, 55]),
      zoom: 4,
      minZoom: 2,
    });

    const map = new Map({
      target: mapRef.current,
      layers: [raster],
      view,
      maxTilesLoading: 32,
      controls: [],
    });

    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: true,
    });
    map.addOverlay(overlay);

    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const pointStyle = new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({ color: '#f5f5f5' }),
        stroke: new Stroke({ width: 2, color: 'black' }),
      }),
    });
    const lineStyle = new Style({
      stroke: new Stroke({ width: 3, color: '#c41c2d' }),
    });

    const pointFeatures = sorted.map((pt) => {
      const coords = fromLonLat([pt.longitude, pt.latitude]);
      const feat = new Feature(new Point(coords));
      feat.setStyle(pointStyle);
      feat.set('data', pt);
      return feat;
    });

    const lineCoords = sorted.map((pt) =>
      fromLonLat([pt.longitude, pt.latitude])
    );
    const lineFeature = new Feature(new LineString(lineCoords));
    lineFeature.setStyle(lineStyle);

    const vectorSource = new VectorSource({
      features: [...pointFeatures, lineFeature],
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
    });
    map.addLayer(vectorLayer);

    // Fit view to data extent
    const extent = vectorSource.getExtent();
    if (extent.every((c) => !isNaN(c))) {
      view.fit(extent, { padding: [40, 40, 40, 40], maxZoom: 12 });
    }

    // Click handler for popup
    map.on('singleclick', (evt) => {
      const feat = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feat && feat.get('data')) {
        const coords = (feat.getGeometry() as Point).getCoordinates();
        const pt: LiveData = feat.get('data');

        const formattedDate = new Date(pt.date).toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        popupRef.current!.innerHTML = `
          <div class="p-3 flex-1 pb-2">
            <ul class="divide-y divide-border">
              <li class="flex justify-between items-center py-2 gap-8">
                <span class="text-foreground/80 font-medium">Speed</span>
                <span class="font-semibold">${pt.speed} km/h</span>
              </li>
              <li class="flex justify-between items-center py-2 gap-8">
                <span class="text-foreground/80 font-medium">Course</span>
                <span class="font-semibold">${pt.course}°</span>
              </li>
              <li class="flex justify-between items-center py-2 gap-8">
                <span class="text-foreground/80 font-medium">Temperature</span>
                <span class="font-semibold">${pt.temperature}°C</span>
              </li>
            </ul>
            <div class="pt-1 text-xs text-foreground/25 text-center">
              ${formattedDate}
            </div>
          </div>
        `;
        overlay.setPosition(coords);
      } else {
        overlay.setPosition(undefined);
      }
    });

    return () => {
      map.setTarget(undefined);
    };
  }, [data]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <div
        ref={popupRef}
        className="
          absolute
          bg-background
          rounded-md
          shadow-md
          pointer-events-auto
        "
      />
    </div>
  );
}
