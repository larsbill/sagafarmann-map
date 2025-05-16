'use client';

import { useRef, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
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

  useEffect(() => {
    if (!mapRef.current) return;

    const raster = new TileLayer({
      source: new XYZ({
        url:
          'https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        attributions: '© OpenStreetMap contributors © CARTO',
      }),
    });
    const view = new View({
      projection: 'EPSG:3857',
      center: fromLonLat([4.5, 55]),
      zoom: 18,
      minZoom: 2,
    });
    const map = new Map({
      target: mapRef.current,
      layers: [raster],
      view,
      controls: [],
    });

    if (data.length > 0) {
      const sorted = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const defaultStyle = new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: '#c41c2d' }),
        }),
      });
      const lineStyle = new Style({
        fill: new Fill({ color: 'white' }),
        stroke: new Stroke({ width: 3, color: 'black' }),
      });

      const features: Feature<Point | LineString>[] = sorted.map((pt) => {
        const feat = new Feature(new Point(fromLonLat([pt.longitude, pt.latitude])));
        feat.set('data', pt);
        feat.setId(pt.id);
        feat.setStyle(defaultStyle);
        return feat;
      });

      if (sorted.length >= 2) {
        const coords = sorted.map((pt) => fromLonLat([pt.longitude, pt.latitude]));
        const line = new Feature(new LineString(coords));
        line.setStyle(lineStyle);
        features.push(line);
      }

      const source = new VectorSource({ features });
      const layer = new VectorLayer({
        source,
        updateWhileAnimating: true,
        updateWhileInteracting: true,
      });
      map.addLayer(layer);

      const extent = source.getExtent();

      const params = new URLSearchParams(window.location.search);
      const markerId = params.get('marker');

      if (markerId) {
        const feature = source.getFeatureById(markerId);
        if (feature) {
          const geom = feature.getGeometry() as Point;
          const coord = geom.getCoordinates();
          view.setCenter(coord);
          view.setZoom(Math.min(view.getMaxZoom() || 12, 12));
        } else {
          view.fit(extent, { padding: [40, 40, 40, 40], maxZoom: 20 });
        }
      } else {
        view.fit(extent, { padding: [40, 40, 40, 40], maxZoom: 20 });
      }

      const lastPt = sorted[sorted.length - 1];
      const lastCoord = fromLonLat([lastPt.longitude, lastPt.latitude]);
      const pingEl = document.createElement('div');
      pingEl.className = 'relative flex items-center justify-center';
      pingEl.innerHTML = `
        <span class="absolute inline-flex h-4 w-4 rounded-full bg-primary opacity-75 animate-[ping_3s_ease-in-out_infinite]"></span>
        <span class="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
      `;
      const pingOverlay = new Overlay({
        element: pingEl,
        positioning: 'center-center',
        stopEvent: false,
      });
      map.addOverlay(pingOverlay);
      pingOverlay.setPosition(lastCoord);

      map.on('singleclick', (evt) => {
        const hitTolerance = 8;
        const feat = map.forEachFeatureAtPixel(evt.pixel, (f) => f, { hitTolerance });
        if (feat?.get('data')) {
          const pt = feat.get('data') as LiveData;
          view.animate({
            center: evt.coordinate,
            duration: 500,
          });
          window.history.pushState({}, '', `?marker=${encodeURIComponent(pt.id)}`);
        } else {
          window.history.pushState({}, '', window.location.pathname);
        }
      });
    }

    return () => {
      map.setTarget(undefined);
    };
  }, [data]);

  return <div ref={mapRef} className="w-full h-full" />;
}
