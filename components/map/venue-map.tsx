"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Venue } from "@/lib/types";
import { calculateBounds, DEFAULT_MAP_CENTER, DEFAULT_ZOOM, createVenueIcon } from "@/lib/map-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar, ExternalLink } from "lucide-react";
import { getStatusLabel, getTypeLabel } from "@/lib/map-utils";
import { toPersianDigits } from "@/lib/booking-utils";

interface VenueMapProps {
  venues: Venue[];
  selectedVenueId?: string;
  onVenueSelect?: (venue: Venue) => void;
  onBookVenue?: (venue: Venue) => void;
  showHeatmap?: boolean;
}

// Component to fit bounds when venues change
function MapBoundsUpdater({ venues }: { venues: Venue[] }) {
  const map = useMap();

  React.useEffect(() => {
    if (venues.length > 0) {
      const bounds = calculateBounds(venues);
      if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      }
    }
  }, [venues, map]);

  return null;
}

export function VenueMap({
  venues,
  selectedVenueId,
  onVenueSelect,
  onBookVenue,
  showHeatmap = false,
}: VenueMapProps) {
  const handleMarkerClick = (venue: Venue) => {
    if (onVenueSelect) {
      onVenueSelect(venue);
    }
  };

  const handleBookClick = (venue: Venue, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookVenue) {
      onBookVenue(venue);
    }
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsUpdater venues={venues} />

        {venues.map((venue) => (
          <Marker
            key={venue.id}
            position={[venue.location.lat, venue.location.lng]}
            icon={createVenueIcon(venue)}
            eventHandlers={{
              click: () => handleMarkerClick(venue),
            }}
          >
            <Popup>
              <div className="p-4 space-y-3" dir="rtl">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base leading-tight">
                      {venue.nameFa}
                    </h3>
                    <Badge
                      variant="outline"
                      className={
                        venue.status === "active"
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : venue.status === "maintenance"
                          ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                          : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                      }
                    >
                      {getStatusLabel(venue.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getTypeLabel(venue.type)}
                  </p>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="line-clamp-1">{venue.location.addressFa}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>ظرفیت: {toPersianDigits(venue.capacity.toString())} نفر</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>
                      نرخ استفاده: {toPersianDigits(venue.utilizationRate.toString())}%
                    </span>
                  </div>
                </div>

                {/* University */}
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    {venue.universityName}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(`/venues?id=${venue.id}`, "_blank")}
                  >
                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    جزئیات
                  </Button>
                  {venue.status === "active" && (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => handleBookClick(venue, e)}
                    >
                      <Calendar className="h-3.5 w-3.5 ml-1" />
                      رزرو
                    </Button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
