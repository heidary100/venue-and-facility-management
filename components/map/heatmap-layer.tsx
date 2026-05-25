"use client";

import * as React from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
  options?: {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    max?: number;
    minOpacity?: number;
    gradient?: { [key: number]: string };
  };
}

export function HeatmapLayer({ points, options = {} }: HeatmapLayerProps) {
  const map = useMap();
  const heatLayerRef = React.useRef<L.HeatLayer | null>(null);

  React.useEffect(() => {
    if (!map) return;

    // Remove existing heat layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Create new heat layer
    const defaultOptions = {
      radius: 25,
      blur: 15,
      maxZoom: 13,
      max: 1.0,
      minOpacity: 0.4,
      gradient: {
        0.0: "#3b82f6",
        0.3: "#22c55e",
        0.5: "#eab308",
        0.7: "#f97316",
        1.0: "#ef4444",
      },
      ...options,
    };

    // @ts-ignore - leaflet.heat types
    const heatLayer = L.heatLayer(points, defaultOptions);
    heatLayer.addTo(map);
    heatLayerRef.current = heatLayer;

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
    };
  }, [map, points, options]);

  return null;
}
