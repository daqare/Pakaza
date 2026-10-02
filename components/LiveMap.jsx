'use client';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Nairobi to Machakos coordinates (Example Route)
const ROUTE_COORDS = [
  [-1.2921, 36.8219], // Nairobi (Start)
  [-1.3500, 36.9500], // Midpoint
  [-1.5177, 37.2634], // Machakos (End)
];

export default function LiveMap({ parcelStatus }) {
  const [matatuPos, setMatatuPos] = useState(ROUTE_COORDS[0]);
  const [progress, setProgress] = useState(0);

  // Simulate Movement when status is IN_TRANSIT
  useEffect(() => {
    if (parcelStatus !== 'IN_TRANSIT') {
      setMatatuPos(ROUTE_COORDS[0]);
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.005; // Speed of simulation
        if (next >= 1) {
          clearInterval(interval);
          return 1;
        }
        
        // Calculate position between point 0 and 2
        const lat = ROUTE_COORDS[0][0] + (ROUTE_COORDS[2][0] - ROUTE_COORDS[0][0]) * next;
        const lng = ROUTE_COORDS[0][1] + (ROUTE_COORDS[2][1] - ROUTE_COORDS[0][1]) * next;
        setMatatuPos([lat, lng]);
        
        return next;
      });
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, [parcelStatus]);

  // Custom Icon using Leaflet's divIcon (Safe and reliable)
  const matatuIcon = L.divIcon({
    className: 'custom-div-icon',
    html: "<div style='font-size: 28px; text-align: center; line-height: 30px;'>🚐</div>",
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  return (
    <MapContainer 
      center={[-1.4, 37.0]} 
      zoom={9} 
      style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 1 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* The Route Line */}
      <Polyline positions={ROUTE_COORDS} color="#0047AB" weight={4} opacity={0.7} dashArray="10, 10" />
      
      {/* Start Point */}
      <Marker position={ROUTE_COORDS[0]}>
        <Popup><b>Origin:</b> Nairobi Hub</Popup>
      </Marker>
      
      {/* End Point */}
      <Marker position={ROUTE_COORDS[2]}>
        <Popup><b>Destination:</b> Machakos Hub</Popup>
      </Marker>

      {/* The Moving Matatu */}
      {parcelStatus === 'IN_TRANSIT' && (
        <Marker position={matatuPos} icon={matatuIcon}>
          <Popup>
            <b>Matatu KDA 123A</b><br/>
            Status: In Transit<br/>
            Progress: {Math.round(progress * 100)}%
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
