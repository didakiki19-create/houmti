import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Store } from '../types';

// Fix for default marker icons in Leaflet with React using CDN
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  stores: Store[];
  center?: [number, number];
  zoom?: number;
}

// Helper component to update map view
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

export const MapView: React.FC<MapViewProps> = ({ stores, center = [36.7538, 3.0588], zoom = 13 }) => {
  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-premium">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center as [number, number]} zoom={zoom} />
        {stores.map(store => (
          store.lat && store.lng && (
            <Marker key={store.id} position={[store.lat, store.lng] as [number, number]}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm">{store.name}</h3>
                  <p className="text-xs text-zinc-500">{store.neighborhood}</p>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">{store.distance}</p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};
