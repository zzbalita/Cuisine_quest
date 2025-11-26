import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Restaurant {
  name: string;
  lat: number;
  lng: number;
  dishes: string[];
  rating: number;
}

interface MapProps {
  restaurants: Restaurant[];
  center?: [number, number];
  zoom?: number;
}

export default function Map({ restaurants, center = [21.03, 105.85], zoom = 13 }: MapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add restaurant markers
    restaurants.forEach(restaurant => {
      const marker = L.marker([restaurant.lat, restaurant.lng])
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${restaurant.name}</h3>
            <div style="margin-bottom: 8px; color: #f59e0b;">⭐ ${restaurant.rating}/5</div>
            <div style="font-size: 14px; color: #666;">
              <strong>Món đặc sắc:</strong><br/>
              ${restaurant.dishes.join(", ")}
            </div>
          </div>
        `);
      markersRef.current.push(marker);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [restaurants, center, zoom]);

  return <div id="map" className="w-full h-[500px] rounded-xl border-2 border-border shadow-lg" />;
}
