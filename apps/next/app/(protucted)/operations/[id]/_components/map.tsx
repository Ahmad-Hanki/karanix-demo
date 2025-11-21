"use client";

import { PaxType } from "@/types";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

type MapProps = {
  pax: PaxType[];
  vehiclePos: { lat: number; lng: number } | null;
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const DEFAULT_CENTER = {
  lat: 41.0082, // Istanbul-ish fallback
  lng: 28.9784,
};

const Map = ({ pax, vehiclePos }: MapProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  const center = useMemo(() => {
    if (vehiclePos) return vehiclePos;

    const validPax = pax.filter(
      (p) => typeof p.pickupLat === "number" && typeof p.pickupLng === "number"
    );

    if (validPax.length > 0) {
      const latSum = validPax.reduce((sum, p) => sum + p.pickupLat, 0);
      const lngSum = validPax.reduce((sum, p) => sum + p.pickupLng, 0);
      return {
        lat: latSum / validPax.length,
        lng: lngSum / validPax.length,
      };
    }

    return DEFAULT_CENTER;
  }, [vehiclePos, pax]);

  if (loadError) {
    return (
      <div className="border rounded-lg p-4 h-[400px] flex items-center justify-center">
        <span className="text-red-500 text-sm">Failed to load Google Maps</span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="border rounded-lg p-4 h-[400px] flex items-center justify-center">
        <span className="text-gray-500 text-sm">Loading map...</span>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-0 h-[400px] overflow-hidden">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Pax pickup markers */}
        {pax.map((p) =>
          typeof p.pickupLat === "number" && typeof p.pickupLng === "number" ? (
            <Marker
              key={p.id}
              position={{ lat: p.pickupLat, lng: p.pickupLng }}
              label={{
                text: p.seatNo ? String(p.seatNo) : "P",
                fontSize: "10px",
              }}
            />
          ) : null
        )}

        {/* Vehicle marker */}
        {vehiclePos && (
          <Marker
            position={vehiclePos}
            // You can customise icon later if you want a bus icon
          />
        )}
      </GoogleMap>
    </div>
  );
};

export { Map };
